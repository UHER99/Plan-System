import { GameStatus, SystemState } from "../types/plan";


export const initialState: SystemState = {
  planIndex: 1,
  loseCountInPlan: 0,
  accumulatedLoss: 0,
  baseBet: 5,  
};


export function getPlanRule(planIndex: number, baseBet: number) {
  const betAmount = planIndex * baseBet;

  let maxLose: number;
  if (planIndex === 1) maxLose = 6;
  else if (planIndex === 2) maxLose = 3;
  else if (planIndex === 3) maxLose = 2;
  else maxLose = 1;

  return { betAmount, maxLose };
}


export function applyGameResult(
  state: SystemState,
  status: GameStatus
): SystemState {
  if (status === "W") {
    return {
      ...state,
      planIndex: 1,
      loseCountInPlan: 0,
      accumulatedLoss: 0,
    };
  }

  const rule = getPlanRule(state.planIndex, state.baseBet);

  const nextLoseCount = state.loseCountInPlan + 1;
  const nextAccumulatedLoss = state.accumulatedLoss + rule.betAmount;

  if (nextLoseCount >= rule.maxLose) {
    return {
      ...state,
      planIndex: state.planIndex + 1,
      loseCountInPlan: 0,
      accumulatedLoss: nextAccumulatedLoss,
    };
  }

  return {
    ...state,
    loseCountInPlan: nextLoseCount,
    accumulatedLoss: nextAccumulatedLoss,
  };
}
