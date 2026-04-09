"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCastStore } from "@/store/useCastStore";
import { Phase, Genre, Evaluator, ChecklistItem } from "@/types";

const phases: Phase[] = ["基礎", "P0", "P1", "P2", "P3"];
const genres: Genre[] = ["共通", "カフェ", "バー", "スイーツ"];
const evaluators: Evaluator[] = ["芳本 大樹", "真奈 沓掛", "田中 マネージャー"];

const genreBadgeColors: Record<Genre, string> = {
  共通: "bg-[#e8f5e9] text-[#006400]",
  カフェ: "bg-[#f1f8e9] text-[#33691e]",
  バー: "bg-[#e0f2f1] text-[#004d40]",
  スイーツ: "bg-[#f3e5f5] text-[#4a148c]",
};

export default function CastDetail() {
  const params = useParams();
  const castId = params.id as string;
  const { getCast, toggleItem, setEvaluator, addItem, updateItem, loaded } = useCastStore();
  const [activePhase, setActivePhase] = useState<Phase>("基礎");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    criteria: "",
    genre: "共通" as Genre,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Pick<ChecklistItem, "category" | "name" | "criteria" | "evaluator" | "genre">>({
    category: "",
    name: "",
    criteria: "",
    evaluator: "",
    genre: "共通",
  });

  const startEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditData({
      category: item.category,
      name: item.name,
      criteria: item.criteria,
      evaluator: item.evaluator,
      genre: item.genre,
    });
  };

  const saveEdit = () => {
    if (editingId) {
      updateItem(castId, editingId, editData);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#666666]">読み込み中...</p>
      </div>
    );
  }

  const cast = getCast(castId);

  if (!cast) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-[#666666]">キャストが見つかりません</p>
        <Link href="/" className="text-[#006400] hover:underline text-sm">
          ← キャスト一覧に戻る
        </Link>
      </div>
    );
  }

  const phaseItems = cast.items.filter((it) => it.phase === activePhase);
  const categories = Array.from(new Set(phaseItems.map((it) => it.category)));

  const handleAddItem = () => {
    if (formData.category.trim() && formData.name.trim()) {
      addItem(
        castId,
        activePhase,
        formData.category.trim(),
        formData.name.trim(),
        formData.criteria.trim(),
        formData.genre
      );
      setFormData({ category: "", name: "", criteria: "", genre: "共通" });
      setShowForm(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* パンくず */}
      <nav className="mb-8 text-sm text-[#666666]">
        <Link href="/" className="hover:text-[#006400]">
          ← キャスト一覧
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#111111] font-medium">{cast.name}</span>
      </nav>

      <h1 className="text-2xl font-bold mb-6 text-[#111111]">{cast.name}</h1>

      {/* Phase別 進捗バー */}
      <div className="flex flex-col gap-2 mb-8">
        {phases.map((p) => {
          const count = cast.items.filter((i) => i.phase === p).length;
          const done = cast.items.filter((i) => i.phase === p && i.checked).length;
          const pct = count > 0 ? Math.round((done / count) * 100) : 0;
          return (
            <div key={p} className="flex items-center gap-2">
              <span style={{ width: 40, fontSize: 11, color: "#666" }}>{p}</span>
              <div className="flex-1" style={{ background: "#e8e8e8", borderRadius: 3, height: 5 }}>
                {count > 0 && (
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
              <span style={{ width: 40, fontSize: 11, color: "#006400", textAlign: "right" }}>
                {count > 0 ? `${pct}%` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Phase タブ */}
      <div className="flex gap-1 mb-8 border-b border-[#e0e0e0]">
        {phases.map((p) => (
          <button
            key={p}
            onClick={() => {
              setActivePhase(p);
              setShowForm(false);
            }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activePhase === p
                ? "border-[#006400] text-[#006400]"
                : "border-transparent text-[#666666] hover:text-[#111111]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* チェックリストテーブル */}
      {phaseItems.length === 0 ? (
        <p className="text-[#666666] text-sm py-10 text-center">
          このPhaseにはまだ項目がありません
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e0e0e0] text-left text-[#666666]" style={{ background: "#f5f5f5" }}>
                <th className="py-3 pr-3 pl-3 font-medium">カテゴリ</th>
                <th className="py-3 pr-3 font-medium">項目名</th>
                <th className="py-3 pr-3 font-medium hidden sm:table-cell">
                  評価基準
                </th>
                <th className="py-3 pr-3 font-medium w-12 text-center">
                  Check
                </th>
                <th className="py-3 pr-3 font-medium">評価者</th>
                <th className="py-3 font-medium">Genre</th>
                <th className="py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) =>
                phaseItems
                  .filter((it) => it.category === cat)
                  .map((item, idx) => {
                    const isEditing = editingId === item.id;
                    return (
                    <tr
                      key={item.id}
                      className="border-b border-[#f5f5f5] hover:bg-[#f5f5f5]"
                      style={item.checked ? { borderLeft: "3px solid #006400" } : undefined}
                    >
                      <td className="py-3 pr-3 text-[#666666]">
                        {isEditing ? (
                          <input
                            value={editData.category}
                            onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
                            className="w-full border border-[#e0e0e0] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#006400]"
                          />
                        ) : (
                          idx === 0 ? cat : ""
                        )}
                      </td>
                      <td className="py-3 pr-3 text-[#111111]">
                        {isEditing ? (
                          <input
                            value={editData.name}
                            onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                            className="w-full border border-[#e0e0e0] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#006400]"
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td className="py-3 pr-3 text-[#666666] hidden sm:table-cell">
                        {isEditing ? (
                          <input
                            value={editData.criteria}
                            onChange={(e) => setEditData((d) => ({ ...d, criteria: e.target.value }))}
                            className="w-full border border-[#e0e0e0] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#006400]"
                          />
                        ) : (
                          item.criteria
                        )}
                      </td>
                      <td className="py-3 pr-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleItem(castId, item.id)}
                          className="w-4 h-4 rounded border-[#e0e0e0] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        {isEditing ? (
                          <select
                            value={editData.evaluator}
                            onChange={(e) => setEditData((d) => ({ ...d, evaluator: e.target.value as Evaluator | "" }))}
                            className="text-xs border border-[#e0e0e0] rounded-md px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#006400]"
                          >
                            <option value="">未選択</option>
                            {evaluators.map((ev) => (
                              <option key={ev} value={ev}>{ev}</option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={item.evaluator}
                            onChange={(e) =>
                              setEvaluator(
                                castId,
                                item.id,
                                e.target.value as Evaluator | ""
                              )
                            }
                            className="text-xs border border-[#e0e0e0] rounded-md px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#006400]"
                          >
                            <option value="">未選択</option>
                            {evaluators.map((ev) => (
                              <option key={ev} value={ev}>
                                {ev}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        {isEditing ? (
                          <select
                            value={editData.genre}
                            onChange={(e) => setEditData((d) => ({ ...d, genre: e.target.value as Genre }))}
                            className="text-xs border border-[#e0e0e0] rounded-md px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#006400]"
                          >
                            {genres.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              genreBadgeColors[item.genre]
                            }`}
                          >
                            {item.genre}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {isEditing ? (
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={saveEdit}
                              className="text-xs px-2.5 py-1 border border-[#006400] text-[#006400] rounded-md hover:bg-[#006400] hover:text-white transition"
                            >
                              保存
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-xs px-2.5 py-1 text-[#666666] hover:text-[#111111]"
                            >
                              取消
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="text-xs px-2.5 py-1 text-[#006400] hover:bg-[#f5f5f5] rounded-md transition"
                          >
                            編集
                          </button>
                        )}
                      </td>
                    </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 項目追加 */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 text-sm font-medium"
          style={{
            color: "#006400",
            border: "1px solid #006400",
            borderRadius: 6,
            padding: "6px 16px",
          }}
        >
          ＋ このPhaseに項目を追加
        </button>
      ) : (
        <div className="mt-6 bg-white border border-[#e0e0e0] rounded-md p-5 space-y-4">
          <h4 className="text-sm font-medium text-[#111111]">新しい項目を追加</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="カテゴリ"
              value={formData.category}
              onChange={(e) =>
                setFormData((d) => ({ ...d, category: e.target.value }))
              }
              className="border border-[#e0e0e0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006400]"
            />
            <input
              placeholder="項目名"
              value={formData.name}
              onChange={(e) =>
                setFormData((d) => ({ ...d, name: e.target.value }))
              }
              className="border border-[#e0e0e0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006400]"
            />
            <input
              placeholder="評価基準"
              value={formData.criteria}
              onChange={(e) =>
                setFormData((d) => ({ ...d, criteria: e.target.value }))
              }
              className="border border-[#e0e0e0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006400]"
            />
            <select
              value={formData.genre}
              onChange={(e) =>
                setFormData((d) => ({ ...d, genre: e.target.value as Genre }))
              }
              className="border border-[#e0e0e0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006400]"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddItem}
              className="px-4 py-2 text-sm bg-[#006400] text-white rounded-md hover:bg-[#004d00]"
            >
              追加
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-[#666666] hover:text-[#111111]"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
