import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const correct = process.env.APP_PASSWORD ?? "three2024";

  console.log("received:", password);
  console.log("correct:", correct);
  console.log("match:", password === correct);

  if (password === correct) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth", "OK", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }
  return NextResponse.json({ error: "invalid" }, { status: 401 });
}
