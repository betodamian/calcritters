// Tracks which critters a player has met, stored in the browser so the project
// needs no accounts or database to be fully playable. A database-backed version
// (see supabase/schema.sql) can replace this without touching the UI.

"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "calcritters:found";
const CHANGED_EVENT = "calcritters:found-changed";

export function getFound(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function isFound(slug: string): boolean {
  return getFound().includes(slug);
}

export function markFound(slug: string): void {
  if (typeof window === "undefined") return;
  const current = getFound();
  if (current.includes(slug)) return;
  const next = [...current, slug];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CHANGED_EVENT));
  } catch {
    // Storage can be unavailable (private mode); discovery just won't persist.
  }
}

/** Clears all discovered critters. Used by the "reset Critterdex" control. */
export function resetFound(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CHANGED_EVENT));
  } catch {
    // Storage can be unavailable (private mode); nothing to reset in that case.
  }
}

export function onFoundChange(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener();
  window.addEventListener(CHANGED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// --- React hooks ------------------------------------------------------------
// These use useSyncExternalStore so components subscribe to the store without
// effects, and stay correct across hydration.

const EMPTY: string[] = [];
let snapshot: string[] = EMPTY;

// Return a cached array reference unless the contents actually changed, so
// useSyncExternalStore doesn't loop on a fresh reference every render.
function getSnapshot(): string[] {
  const next = getFound();
  if (
    next.length === snapshot.length &&
    next.every((slug, index) => slug === snapshot[index])
  ) {
    return snapshot;
  }
  snapshot = next;
  return snapshot;
}

/** Subscribe to the set of met critters. */
export function useFound(): string[] {
  return useSyncExternalStore(onFoundChange, getSnapshot, () => EMPTY);
}

/** True only after the component has hydrated on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
