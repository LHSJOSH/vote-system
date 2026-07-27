import { getResults } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json(
      { error: "관리자 인증이 필요합니다." },
      { status: 401 },
    );
  }
  try {
    return Response.json(await getResults(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load results", error);
    return Response.json(
      { error: "투표 결과를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
