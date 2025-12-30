"use client";

import { useState } from "react";
import { GameStatus, SystemState } from "../types/plan";
import { applyGameResult, initialState } from "../lib/planEngine";
import { loadState, saveState } from "../lib/storage";
;

export function usePlanSystem() {
  const [state, setState] = useState<SystemState>(() => loadState() ?? initialState);

  function updateStatus(status: GameStatus) {
    setState((prev) => {
      const next = applyGameResult(prev, status);
      saveState(next);
      return next;
    });
  }

  function setBaseBet(value: number) {
  setState((prev) => {
    const next = {
      ...prev,
      baseBet: value,
      planIndex: 1,
      loseCountInPlan: 0,
      accumulatedLoss: 0,
    };
    saveState(next);
    return next;
  });
}


  function reset() {
    saveState(initialState);
    setState(initialState);
  }

  return { state, updateStatus, reset, setBaseBet };
}


