import { NextResponse } from "next/server";
import {
  ADMIN_ATTEMPT_COOKIE,
  ADMIN_COOKIE,
  adminCookieOptions,
  safePinMatches,
  signToken,
  verifyToken,
} from "@/lib/security";
import { loginSchema } from "@/lib/validation";

type AttemptPayload = { count: number; lockedUntil: number };

export async function POST(request: Request) {
  try {
    const attemptToken = request.headers
      .get("cookie")
      ?.split("; ")
      .find((value) => value.startsWith(`${ADMIN_ATTEMPT_COOKIE}=`))
      ?.split("=")
      .slice(1)
      .join("=");
    const attempt = verifyToken<AttemptPayload>(attemptToken) ?? {
      count: 0,
      lockedUntil: 0,
    };

    if (attempt.lockedUntil > Date.now()) {
      return Response.json(
        { error: "시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 },
      );
    }

    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success || !safePinMatches(parsed.data.pin)) {
      const count = attempt.count + 1;
      const lockedUntil =
        count >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
      const response = NextResponse.json(
        {
          error:
            count >= 5
              ? "시도 횟수를 초과했습니다. 15분 후 다시 시도해 주세요."
              : `PIN이 올바르지 않습니다. (${count}/5)`,
        },
        { status: count >= 5 ? 429 : 401 },
      );
      response.cookies.set(
        ADMIN_ATTEMPT_COOKIE,
        signToken({ count: count >= 5 ? 0 : count, lockedUntil }),
        {
          ...adminCookieOptions(),
          maxAge: 15 * 60,
        },
      );
      return response;
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      ADMIN_COOKIE,
      signToken({
        role: "admin",
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      }),
      adminCookieOptions(),
    );
    response.cookies.delete(ADMIN_ATTEMPT_COOKIE);
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return Response.json(
      { error: "관리자 로그인을 처리하지 못했습니다." },
      { status: 500 },
    );
  }
}
