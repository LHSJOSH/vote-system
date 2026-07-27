import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getKstWeekStartKey } from "@/lib/kst";
import type {
  AiOption,
  ResultItem,
  ResultsPayload,
  VoteRecord,
} from "@/lib/types";

type OptionRow = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  color: string;
  enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type VoteRow = {
  submission_id: string;
  nickname: string;
  option_id: string;
  option_name: string;
  reason: string;
  voted_at: string;
  voted_at_kst: string;
  kst_date: string;
};

let adminClient: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (adminClient) return adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error("Supabase 서버 환경변수가 설정되지 않았습니다.");
  }
  adminClient = createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  return adminClient;
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function optionFromRow(row: OptionRow): AiOption {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    color: row.color,
    enabled: row.enabled,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function voteFromRow(row: VoteRow): VoteRecord {
  return {
    submissionId: row.submission_id,
    nickname: row.nickname,
    optionId: row.option_id,
    optionName: row.option_name,
    reason: row.reason,
    votedAtIso: row.voted_at,
    votedAtKst: row.voted_at_kst,
    kstDate: row.kst_date,
  };
}

export async function getOptions(includeDisabled = false) {
  let query = getSupabaseAdmin()
    .from("options")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (!includeDisabled) query = query.eq("enabled", true);
  const { data, error } = await query;
  throwIfError(error);
  return ((data ?? []) as OptionRow[]).map(optionFromRow);
}

export async function createOption(
  input: Omit<AiOption, "id" | "createdAt" | "updatedAt">,
) {
  if (input.enabled) {
    const { count, error } = await getSupabaseAdmin()
      .from("options")
      .select("id", { count: "exact", head: true })
      .eq("enabled", true);
    throwIfError(error);
    if ((count ?? 0) >= 8) {
      throw new Error("활성 선택지는 최대 8개까지 등록할 수 있습니다.");
    }
  }

  const { data, error } = await getSupabaseAdmin()
    .from("options")
    .insert({
      name: input.name,
      description: input.description,
      image_url: input.imageUrl,
      color: input.color,
      enabled: input.enabled,
      sort_order: input.sortOrder,
    })
    .select()
    .single();
  throwIfError(error);
  return optionFromRow(data as OptionRow);
}

export async function updateOption(
  id: string,
  patch: Partial<Omit<AiOption, "id" | "createdAt" | "updatedAt">>,
) {
  const options = await getOptions(true);
  const current = options.find((option) => option.id === id);
  if (!current) throw new Error("선택지를 찾을 수 없습니다.");
  if (
    patch.enabled &&
    !current.enabled &&
    options.filter((option) => option.enabled).length >= 8
  ) {
    throw new Error("활성 선택지는 최대 8개까지 등록할 수 있습니다.");
  }

  const update: Record<string, string | number | boolean> = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.imageUrl !== undefined) update.image_url = patch.imageUrl;
  if (patch.color !== undefined) update.color = patch.color;
  if (patch.enabled !== undefined) update.enabled = patch.enabled;
  if (patch.sortOrder !== undefined) update.sort_order = patch.sortOrder;

  const { data, error } = await getSupabaseAdmin()
    .from("options")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  throwIfError(error);
  return optionFromRow(data as OptionRow);
}

export async function archiveOption(id: string) {
  return updateOption(id, { enabled: false });
}

export async function uploadModelImage(file: File) {
  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const extension = extensionByType[file.type];
  if (!extension) throw new Error("JPG, PNG, WEBP, GIF 이미지만 등록할 수 있습니다.");

  const path = `${crypto.randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();
  const { error } = await getSupabaseAdmin()
    .storage
    .from("model-images")
    .upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
  throwIfError(error);

  const { data } = getSupabaseAdmin()
    .storage
    .from("model-images")
    .getPublicUrl(path);
  return data.publicUrl;
}

export async function getVotes(fromDate?: string) {
  let query = getSupabaseAdmin()
    .from("votes")
    .select("*")
    .order("voted_at", { ascending: false });
  if (fromDate) query = query.gte("kst_date", fromDate);
  const { data, error } = await query;
  throwIfError(error);
  return ((data ?? []) as VoteRow[]).map(voteFromRow);
}

export async function getVoteBySubmissionId(submissionId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("votes")
    .select("*")
    .eq("submission_id", submissionId)
    .gte("kst_date", getKstWeekStartKey())
    .maybeSingle();
  throwIfError(error);
  return data ? voteFromRow(data as VoteRow) : null;
}

export async function saveVote(vote: VoteRecord) {
  const { data: existing, error: existingError } = await getSupabaseAdmin()
    .from("votes")
    .select("submission_id")
    .eq("submission_id", vote.submissionId)
    .maybeSingle();
  throwIfError(existingError);

  const { data: optionData, error: optionError } = await getSupabaseAdmin()
    .from("options")
    .select("*")
    .eq("id", vote.optionId)
    .eq("enabled", true)
    .maybeSingle();
  throwIfError(optionError);
  if (!optionData) throw new Error("현재 선택할 수 없는 AI 모델입니다.");
  const option = optionFromRow(optionData as OptionRow);

  const { data, error } = await getSupabaseAdmin()
    .from("votes")
    .upsert({
      submission_id: vote.submissionId,
      nickname: vote.nickname,
      option_id: option.id,
      option_name: option.name,
      reason: vote.reason,
      voted_at: vote.votedAtIso,
      voted_at_kst: vote.votedAtKst,
      kst_date: vote.kstDate,
    }, { onConflict: "submission_id" })
    .select()
    .single();
  throwIfError(error);
  return { vote: voteFromRow(data as VoteRow), updated: Boolean(existing) };
}

export async function getResults(): Promise<ResultsPayload> {
  const weekStart = getKstWeekStartKey();
  const [options, votes] = await Promise.all([
    getOptions(true),
    getVotes(weekStart),
  ]);
  const totalVotes = votes.length;
  const results: ResultItem[] = options
    .map((option) => {
      const count = votes.filter((vote) => vote.optionId === option.id).length;
      return {
        option,
        votes: count,
        percentage: totalVotes ? (count / totalVotes) * 100 : 0,
      };
    })
    .sort(
      (a, b) =>
        b.votes - a.votes ||
        a.option.sortOrder - b.option.sortOrder,
    );

  return {
    date: weekStart,
    totalVotes,
    results,
    votes,
    updatedAt: new Date().toISOString(),
  };
}

export async function resetWeeklyVotes() {
  const { count, error } = await getSupabaseAdmin()
    .from("votes")
    .delete({ count: "exact" })
    .not("submission_id", "is", null);
  throwIfError(error);

  const { count: optionsPreserved, error: countError } =
    await getSupabaseAdmin()
      .from("options")
      .select("id", { count: "exact", head: true });
  throwIfError(countError);

  return {
    weekStart: getKstWeekStartKey(),
    removed: count ?? 0,
    optionsPreserved: optionsPreserved ?? 0,
  };
}
