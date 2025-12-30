"use client";

import { useState } from "react";
import { BallResult } from "../types/ball";
import { addResult, getTheTrueSet } from "../lib/ballStatEngine";
import { loadBallResults, saveBallResults } from "../lib/ballStorage";

export function useBallStats() {
  const [results, setResults] = useState<BallResult[]>(() =>
    loadBallResults()
  );

  function saveManual(balls: [number, number, number]) {
    setResults(prev => {
      const next = addResult(prev, balls);
      saveBallResults(next);
      return next;
    });
  }

  function getTrueSet(): [number, number, number] {
    return getTheTrueSet(results);
  }

  //  RESET FUNCTION
  function reset() {
    saveBallResults([]);   // clear localStorage
    setResults([]);        // clear state
  }

  return {
    results,
    saveManual,
    getTrueSet,
    reset,        //  expose
  };
}
