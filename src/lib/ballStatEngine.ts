import { BallResult } from "../types/ball";

export const MAX_HISTORY = 30;

/* ======================================================
   ADD + ROLLING 30
   ====================================================== */

export function addResult(
  prev: BallResult[],
  balls: [number, number, number]
): BallResult[] {
  const next: BallResult = {
    balls,
    timestamp: Date.now(),
  };

  const updated = [...prev, next];
  return updated.length > MAX_HISTORY
    ? updated.slice(updated.length - MAX_HISTORY)
    : updated;
}

/* ======================================================
   BASIC FREQUENCY
   ====================================================== */

function calcFrequency(results: BallResult[]) {
  const freq = Array(6).fill(0);
  results.forEach(r => r.balls.forEach(b => freq[b - 1]++));
  return freq;
}

/* ======================================================
   SPLIT HOT / WARM / COLD
   ====================================================== */

function splitGroups(freq: number[]) {
  const ranked = freq
    .map((f, i) => ({ n: i + 1, f }))
    .sort((a, b) => b.f - a.f);

  return {
    hot: ranked.slice(0, 2).map(x => x.n),   // top 2
    warm: ranked.slice(2, 4).map(x => x.n),  // next 2
    cold: ranked.slice(4, 6).map(x => x.n),  // last 2
  };
}

/* ======================================================
   WEIGHTED PICK BY GROUP
   ====================================================== */

function pickFromGroup(
  hot: number[],
  warm: number[],
  cold: number[]
): number {
  const r = Math.random();

  if (r < 0.5 && hot.length > 0) {
    return hot[Math.floor(Math.random() * hot.length)];
  }

  if (r < 0.9 && warm.length > 0) {
    return warm[Math.floor(Math.random() * warm.length)];
  }

  return cold[Math.floor(Math.random() * cold.length)];
}

/* ======================================================
   SMART TRUTH SET (50 / 40 / 10)
   ====================================================== */

export function getTheTrueSet(
  results: BallResult[]
): [number, number, number] {
  // ถ้าข้อมูลยังน้อย → ใช้สิ่งที่มี
  if (results.length < 1) {
    return [1, 2, 3];
  }

  const freq = calcFrequency(results);
  const { hot, warm, cold } = splitGroups(freq);

  const selected = new Set<number>();

  while (selected.size < 3) {
    const n = pickFromGroup(hot, warm, cold);
    selected.add(n);
  }

  return Array.from(selected) as [number, number, number];
}
