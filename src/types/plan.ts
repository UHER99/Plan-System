export type GameStatus = "W" | "L";

export type SystemState = {
  planIndex: number;
  loseCountInPlan: number;
  accumulatedLoss: number;
  baseBet: number;   // NEW
};


export type BallResult = {
  balls: [number, number, number];
  timestamp: number;
};

export const MAX_HISTORY = 30;
