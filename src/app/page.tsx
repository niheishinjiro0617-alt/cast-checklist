"use client";

import { useState } from "react";
import Link from "next/link";
import { useCastStore } from "@/store/useCastStore";

export default function Dashboard() {
  const { casts, loaded, addCast, getProgress } = useCastStore();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      addCast(newName.trim());
      setNewName("");
      setShowModal(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#666666]">読み込み中...</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-[#111111]">
          キャスト研修チェックリスト
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#006400] text-white px-5 py-2.5 rounded-md hover:bg-[#004d00] transition text-sm font-medium"
        >
          ＋ キャストを追加
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gap: 24 }}>
        {casts.map((cast) => {
          const progress = getProgress(cast);
          return (
            <Link
              key={cast.id}
              href={`/cast/${cast.id}`}
              className="block bg-white p-6 transition"
              style={{
                borderRadius: 12,
                border: "1px solid #111",
                borderLeft: "3px solid transparent",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderLeft = "3px solid #006400"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderLeft = "3px solid transparent"; }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 12 }}>
                {cast.name}
              </h2>
              <div className="space-y-2">
                {progress.map(({ phase, total, done }) => {
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={phase}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: 11, color: "#666" }}>{phase}</span>
                        <span style={{ fontSize: 11, color: "#666" }}>
                          {total > 0 ? `${pct}%` : "—"}
                        </span>
                      </div>
                      <div style={{ background: "#e8e8e8", borderRadius: 3, height: 5 }}>
                        {total > 0 && (
                          <div
                            style={{
                              background: "#006400",
                              height: 5,
                              borderRadius: 3,
                              width: `${pct}%`,
                              transition: "width 0.3s",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-sm border border-[#e0e0e0]">
            <h3 className="text-lg font-semibold mb-4 text-[#111111]">
              キャストを追加
            </h3>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="名前を入力"
              className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006400] mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewName("");
                }}
                className="px-4 py-2 text-sm text-[#666666] hover:text-[#111111]"
              >
                キャンセル
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 text-sm bg-[#006400] text-white rounded-md hover:bg-[#004d00]"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
