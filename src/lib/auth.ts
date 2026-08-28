import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import type { SessionUser } from "@/lib/types";

export type SessionData = {
  user?: SessionUser;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "dev-only-secret-change-me-32chars!!",
  cookieName: "smartlms_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session.user;
}
