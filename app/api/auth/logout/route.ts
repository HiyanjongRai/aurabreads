import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getSession } from "@/lib/auth";
import { logAuthEvent } from "@/lib/audit-log";

function getIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const session = await getSession();

  if (session) {
    await logAuthEvent({
      action: "LOGOUT",
      email: session.email,
      ip,
      success: true,
      userId: session.userId,
    });
  }

  await deleteSession();

  return NextResponse.json({ success: true, message: "Logged out successfully." });
}
