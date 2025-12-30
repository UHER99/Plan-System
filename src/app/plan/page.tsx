"use client";

import { usePlanSystem } from "@/src/hooks/usePlanSystem";
import { getPlanRule } from "@/src/lib/planEngine";
import { useState } from "react";

type ConfirmType = "W" | "L" | null;

export default function PlanPage() {
  const { state, updateStatus, setBaseBet } = usePlanSystem();
  const rule = getPlanRule(state.planIndex, state.baseBet);

  const [confirmType, setConfirmType] = useState<ConfirmType>(null);

  function onConfirm() {
    if (!confirmType) return;
    updateStatus(confirmType);
    setConfirmType(null);
  }

  return (
    <div
      style={{
        background: "#f4f6f8",
        padding: 16,
        display: "flex",
        justifyContent: "center",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Plan System</h2>

        {/* Base Bet Selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14,  fontWeight: "bold" }}>Start Amount (PLAN 1)</label>
          <select
            value={state.baseBet}
            onChange={(e) => setBaseBet(Number(e.target.value))}
            style={{ 
              width: "100%",
              marginTop: 6,
              height: 40,
              borderRadius: 8,
              padding: "0 12px",
            }}
          >
            {[5, 10, 15, 20, 25, 30, 35, 40, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Info */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#6b7280" }}>Plan: {state.planIndex}</div>
          <div style={{ color: "#6b7280" }}>Bet Amount: {rule.betAmount}</div>
          <div style={{ color: "#6b7280" }}>
            Lose: {state.loseCountInPlan + 1} / {rule.maxLose}
          </div>
          <div style={{ color: "#6b7280" }}>Total Loss: {state.accumulatedLoss}</div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setConfirmType("W")}
            style={{
              flex: 1,
              height: 44,
              background: "#16a34a",
              color: "#fff",
              borderRadius: 8,
              border: "none",
            }}
          >
            Win
          </button>

          <button
            onClick={() => setConfirmType("L")}
            style={{
              flex: 1,
              height: 44,
              background: "#dc2626",
              color: "#fff",
              borderRadius: 8,
              border: "none",
            }}
          >
            Loss
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmType && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#fff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>
              Confirm {confirmType === "W" ? "WIN" : "LOSS"}
            </h3>

            <p style={{ fontSize: 14, color: "#555" }}>
              Are you sure you want to mark this round
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 20,
              }}
            >
              <button
                onClick={() => setConfirmType(null)}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                }}
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 8,
                  border: "none",
                  background: confirmType === "W" ? "#16a34a" : "#dc2626",
                  color: "#fff",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
