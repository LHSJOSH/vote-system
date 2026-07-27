import { NextResponse } from "next/server";
import { saveVote } from "@/lib/supabase";
import { formatKstTimestamp, getKstDateKey } from "@/lib/kst";
import {
  getVoteIdentityToday,
  signToken,
  VOTE_COOKIE,
  voteCookieOptions,
} from "@/lib/security";
import { voteSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = voteSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: "입력 내용을 다시 확인해 주세요." },
        { status: 400 },
      );
    }

    const now = new Date();
    const identity = await getVoteIdentityToday();
    const result = await saveVote({
      submissionId: identity?.submissionId ?? parsed.data.submissionId,
      nickname: parsed.data.nickname,
      optionId: parsed.data.optionId,
      optionName: "",
      reason: parsed.data.reason,
      votedAtIso: now.toISOString(),
      votedAtKst: formatKstTimestamp(now),
      kstDate: getKstDateKey(now),
    });

    const response = NextResponse.json({
      success: true,
      updated: result.updated,
      vote: result.vote,
    });
    response.cookies.set(
      VOTE_COOKIE,
      signToken({
        kstDate: getKstDateKey(now),
        submissionId: result.vote.submissionId,
      }),
      voteCookieOptions(),
    );
    return response;
  } catch (error) {
    console.error("Failed to submit vote", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "투표를 저장하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
