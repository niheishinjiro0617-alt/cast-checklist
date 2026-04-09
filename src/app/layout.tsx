import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "キャスト研修チェックリスト",
  description: "キャスト研修の進捗管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen bg-[#fafafa]">
        <header
          style={{
            height: 52,
            background: "#006400",
            display: "flex",
            alignItems: "center",
            paddingLeft: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/three-logo.png"
            alt="THREE logo"
            style={{
              height: 28,
              filter: "brightness(0) invert(1)",
            }}
          />
        </header>
        {children}
      </body>
    </html>
  );
}
