import { BallResult } from "../types/ball";

const STORAGE_KEY = "ball-true-set";

export function loadBallResults(): BallResult[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as BallResult[]) : [];
}

export function saveBallResults(results: BallResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}
