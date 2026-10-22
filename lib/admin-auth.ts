import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const DEFAULT_ADMIN_PASSWORD = "smartmotor2026";

const ADMIN_COOKIE = "sm_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function adminPassword(): { value: string; usingDefault: boolean } {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (configured) return { value: configured, usingDefault: false };
  return { value: DEFAULT_ADMIN_PASSWORD, usingDefault: true };
}

function sign(body: string, password: string): string {
  return createHmac("sha256", password).update(body).digest("base64url");
}

function passwordsMatch(input: string, expected: string): boolean {
  const left = createHmac("sha256", "admin-login").update(input).digest();
  const right = createHmac("sha256", "admin-login").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function adminPasswordsMatch(input: string): boolean {
  return passwordsMatch(input, adminPassword().value);
}

export function createAdminToken(): string {
  const password = adminPassword().value;
  const body = Buffer.from(
    JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  ).toString("base64url");
  return `${body}.${sign(body, password)}`;
}

export function adminTokenIsValid(token: string | undefined): boolean {
  if (!token) return false;
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;
  const body = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = sign(body, adminPassword().value);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString());
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      "exp" in parsed &&
      typeof parsed.exp === "number" &&
      parsed.exp > Date.now()
    );
  } catch {
    return false;
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies();
  return adminTokenIsValid(jar.get(ADMIN_COOKIE)?.value);
}

export async function setAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, createAdminToken(), cookieOptions());
}

export async function clearAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}
