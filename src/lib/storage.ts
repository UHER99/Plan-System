
import { SystemState } from "../types/plan";
import { initialState } from "./planEngine";

const STORAGE_KEY = "plan-system-state";

export function loadState(): SystemState {
  if (typeof window === "undefined") return initialState;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialState;

  try {
    return JSON.parse(raw) as SystemState;
  } catch {
    return initialState;
  }
}

export function saveState(state: SystemState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
