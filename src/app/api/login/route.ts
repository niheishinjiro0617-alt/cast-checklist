import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  const correctPassword = process.env.APP_PASSWORD || "three2024";
  if (password === correctPassword) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth", "OK", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  return NextResponse.json({ error: "invalid" }, { status: 401 });
}
