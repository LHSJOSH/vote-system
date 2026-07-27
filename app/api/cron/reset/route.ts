import { resetStaleVotes } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return Response.json({ success: true, ...(await resetStaleVotes()) });
  } catch (error) {
    console.error("Daily reset failed", error);
    return Response.json(
      { error: "일일 초기화에 실패했습니다." },
      { status: 500 },
    );
  }
}
