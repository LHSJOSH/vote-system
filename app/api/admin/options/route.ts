import {
  archiveOption,
  createOption,
  getOptions,
  updateOption,
} from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/security";
import {
  optionCreateSchema,
  optionDeleteSchema,
  optionUpdateSchema,
} from "@/lib/validation";

function unauthorized() {
  return Response.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    return Response.json(
      { options: await getOptions(true) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to load admin options", error);
    return Response.json(
      { error: "선택지를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    const parsed = optionCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요." },
        { status: 400 },
      );
    }
    return Response.json(
      { option: await createOption(parsed.data) },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "선택지를 추가하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    const parsed = optionUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요." },
        { status: 400 },
      );
    }
    const { id, ...patch } = parsed.data;
    return Response.json({ option: await updateOption(id, patch) });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "선택지를 수정하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    const parsed = optionDeleteSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "선택지를 확인해 주세요." }, { status: 400 });
    }
    return Response.json({ option: await archiveOption(parsed.data.id) });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "선택지를 비활성화하지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
