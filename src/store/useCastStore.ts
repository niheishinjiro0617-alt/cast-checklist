"use client";

import { useState, useEffect, useCallback } from "react";
import { Cast, ChecklistItem, Phase, Evaluator, Genre } from "@/types";
import { createTemplateItems } from "@/data/template";

const STORAGE_KEY = "cast-checklist-data";

function loadFromStorage(): Cast[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(casts: Cast[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(casts));
}

function createCast(name: string): Cast {
  return {
    id: `cast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    items: createTemplateItems(),
  };
}

const defaultCasts: Cast[] = [
  createCast("スンヨン"),
  createCast("さくら"),
  createCast("りな"),
];

export function useCastStore() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    setCasts(saved ?? defaultCasts);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveToStorage(casts);
  }, [casts, loaded]);

  const addCast = useCallback((name: string) => {
    setCasts((prev) => [...prev, createCast(name)]);
  }, []);

  const toggleItem = useCallback((castId: string, itemId: string) => {
    setCasts((prev) =>
      prev.map((c) =>
        c.id !== castId
          ? c
          : {
              ...c,
              items: c.items.map((it) =>
                it.id !== itemId ? it : { ...it, checked: !it.checked }
              ),
            }
      )
    );
  }, []);

  const setEvaluator = useCallback(
    (castId: string, itemId: string, evaluator: Evaluator | "") => {
      setCasts((prev) =>
        prev.map((c) =>
          c.id !== castId
            ? c
            : {
                ...c,
                items: c.items.map((it) =>
                  it.id !== itemId ? it : { ...it, evaluator }
                ),
              }
        )
      );
    },
    []
  );

  const addItem = useCallback(
    (
      castId: string,
      phase: Phase,
      category: string,
      name: string,
      criteria: string,
      genre: Genre
    ) => {
      const newItem: ChecklistItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        phase,
        category,
        name,
        criteria,
        checked: false,
        evaluator: "",
        genre,
      };
      setCasts((prev) =>
        prev.map((c) =>
          c.id !== castId ? c : { ...c, items: [...c.items, newItem] }
        )
      );
    },
    []
  );

  const updateItem = useCallback(
    (
      castId: string,
      itemId: string,
      updates: Partial<Pick<ChecklistItem, "category" | "name" | "criteria" | "evaluator" | "genre">>
    ) => {
      setCasts((prev) =>
        prev.map((c) =>
          c.id !== castId
            ? c
            : {
                ...c,
                items: c.items.map((it) =>
                  it.id !== itemId ? it : { ...it, ...updates }
                ),
              }
        )
      );
    },
    []
  );

  const getCast = useCallback(
    (id: string) => casts.find((c) => c.id === id) ?? null,
    [casts]
  );

  const getProgress = useCallback(
    (cast: Cast) => {
      const phases: Phase[] = ["基礎", "P0", "P1", "P2", "P3"];
      return phases.map((p) => {
        const items = cast.items.filter((it) => it.phase === p);
        const done = items.filter((it) => it.checked).length;
        return { phase: p, total: items.length, done };
      });
    },
    []
  );

  return { casts, loaded, addCast, toggleItem, setEvaluator, addItem, updateItem, getCast, getProgress };
}
