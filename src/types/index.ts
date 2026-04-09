export type Phase = "基礎" | "P0" | "P1" | "P2" | "P3";
export type Genre = "カフェ" | "バー" | "スイーツ" | "共通";
export type Evaluator = "芳本 大樹" | "真奈 沓掛" | "田中 マネージャー";

export interface ChecklistItem {
  id: string;
  phase: Phase;
  category: string;
  name: string;
  criteria: string;
  checked: boolean;
  evaluator: Evaluator | "";
  genre: Genre;
}

export interface Cast {
  id: string;
  name: string;
  items: ChecklistItem[];
}
