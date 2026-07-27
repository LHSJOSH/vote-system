import { isAdminAuthenticated } from "@/lib/security";
import { uploadModelImage } from "@/lib/supabase";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json(
      { error: "관리자 인증이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return Response.json(
        { error: "등록할 이미지 파일을 선택해 주세요." },
        { status: 400 },
      );
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return Response.json(
        { error: "이미지는 최대 5MB까지 등록할 수 있습니다." },
        { status: 400 },
      );
    }

    return Response.json({ imageUrl: await uploadModelImage(file) });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "이미지를 업로드하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
