import { getOptions, getVoteBySubmissionId } from "@/lib/supabase";
import { getVoteIdentityToday } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const identity = await getVoteIdentityToday();
    const [options, existingVote] = await Promise.all([
      getOptions(),
      identity
        ? getVoteBySubmissionId(identity.submissionId)
        : Promise.resolve(null),
    ]);
    return Response.json(
      { options, hasVoted: Boolean(existingVote), existingVote },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to load options", error);
    return Response.json(
      {
        error:
          "투표 선택지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 503 },
    );
  }
}
