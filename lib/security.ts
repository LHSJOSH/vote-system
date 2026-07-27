import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getKstDateKey, getNextKstMidnight } from "@/lib/kst";

export const ADMIN_COOKIE = "ai_vote_admin";
export const ADMIN_ATTEMPT_COOKIE = "ai_vote_admin_attempt";
export const VOTE_COOKIE = "ai_vote_guard";

type SignedPayload = Record<string, string | number | boolean>;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET 환경변수를 16자 이상으로 설정해 주세요.");
  }
  return secret;
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function signToken(payload: SignedPayload) {
  const body = encode(JSON.stringify(payload));
  const signature = createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

export function verifyToken<T extends SignedPayload>(token?: string): T | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", getSecret())
    .update(body)
    .digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    return JSON.parse(decode(body)) as T;
  } catch {
    return null;
  }
}

export function safePinMatches(candidate: string) {
  const pin = process.env.ADMIN_PIN;
  if (!pin || pin.length < 4) {
    throw new Error("ADMIN_PIN 환경변수를 4자 이상으로 설정해 주세요.");
  }
  const left = Buffer.from(candidate);
  const right = Buffer.from(pin);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const payload = verifyToken<{ role: string; expiresAt: number }>(token);
  return Boolean(
    payload?.role === "admin" && payload.expiresAt > Date.now(),
  );
}

export async function hasVotedToday() {
  return Boolean(await getVoteIdentityToday());
}

export async function getVoteIdentityToday() {
  const token = (await cookies()).get(VOTE_COOKIE)?.value;
  const payload = verifyToken<{ kstDate: string; submissionId: string }>(token);
  if (
    payload?.kstDate !== getKstDateKey() ||
    typeof payload.submissionId !== "string"
  ) {
    return null;
  }
  return payload;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 8 * 60 * 60,
  };
}

export function voteCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: getNextKstMidnight(),
  };
}
