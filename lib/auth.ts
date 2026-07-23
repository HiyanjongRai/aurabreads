import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  decryptSession,
  encryptSession,
  sessionCookieName,
  sessionDurationMs,
} from "@/lib/session";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
};

export async function createSession(user: { id: string; email: string }) {
  const token = await encryptSession({ userId: user.id, email: user.email });
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + sessionDurationMs),
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(sessionCookieName)?.value);
});

export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  const session = await getSession();
  if (!session) return null;

  return getDb().user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      createdAt: true,
    },
  });
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
