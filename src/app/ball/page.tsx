"use client";

import { useState } from "react";
import { useBallStats } from "../../hooks/useBallStats";

/* ======================================================
   ICON MAP (ICON ONLY)
   ====================================================== */

const BALL_ICON_MAP: Record<number, { icon: string; label: string }> = {
  1: { icon: "🐔", label: "Chicken" },
  2: { icon: "🦐", label: "Shrimp" },
  3: { icon: "🎃", label: "Turtle" },
  4: { icon: "🦀", label: "Crab" },
  5: { icon: "🐟", label: "Fish" },
  6: { icon: "🐸", label: "Frog" },
};

const ALL_BALLS = [1, 2, 3, 4, 5, 6];

/* ======================================================
   UI COMPONENTS
   ====================================================== */

function BallSlot({
  value,
  onClick,
}: {
  value: number | null;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: value ? "#f1f5f9" : "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30,
        cursor: "pointer",
      }}
      title={value ? BALL_ICON_MAP[value].label : "Select"}
    >
      {value ? BALL_ICON_MAP[value].icon : "❔"}
    </div>
  );
}

function Dropdown({
  onSelect,
  onClose,
}: {
  onSelect: (n: number) => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 0,
        right: 0,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 10,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        zIndex: 20,
      }}
    >
      {ALL_BALLS.map((n) => (
        <button
          key={n}
          onClick={() => {
            onSelect(n);
            onClose();
          }}
          title={BALL_ICON_MAP[n].label}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            fontSize: 30,
            cursor: "pointer",
          }}
        >
          {BALL_ICON_MAP[n].icon}
        </button>
      ))}
    </div>
  );
}

function RenderRow({ balls }: { balls: number[] }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        justifyContent: "center",
      }}
    >
      {balls.map((b, i) => (
        <div
          key={i}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          {BALL_ICON_MAP[b].icon}
        </div>
      ))}
    </div>
  );
}

/* ======================================================
   PAGE
   ====================================================== */

export default function BallPage() {
  const { results, saveManual, getTrueSet, reset } = useBallStats();

  const [trueSet, setTrueSet] = useState<[number, number, number] | null>(null);

  const [manual, setManual] = useState<(number | null)[]>([null, null, null]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [showResetModal, setShowResetModal] = useState(false);

  function selectBall(index: number, value: number) {
    const next = [...manual];
    next[index] = value;
    setManual(next);
  }

  function saveSelection() {
    if (manual.some((v) => v == null)) return;
    saveManual(manual as [number, number, number]);
    setManual([null, null, null]);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
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
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Get The Ball</h2>

        {/* ===== SYSTEM SUGGEST ===== */}
        <section style={{ marginBottom: 20 }}>
          <button
            onClick={() => {
              setOpenIndex(null);
              setTrueSet(getTrueSet());
            }}
            style={primaryBtn}
          >
            Get It
          </button>

          <p></p>

          {trueSet && <RenderRow balls={trueSet} />}
        </section>

        <Divider />

        {/* ===== MANUAL SELECT (DROPDOWN) ===== */}
        <section style={{ marginBottom: 20 }}>
          <h4 style={sectionTitle}>Insert Ball</h4>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              position: "relative",
            }}
          >
            {manual.map((v, i) => (
              <div key={i} style={{ position: "relative" }}>
                <BallSlot
                  value={v}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                />

                {openIndex === i && (
                  <Dropdown
                    onSelect={(n) => selectBall(i, n)}
                    onClose={() => setOpenIndex(null)}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={saveSelection}
            disabled={manual.some((v) => v == null)}
            style={{
              ...primaryBtn,
              marginTop: 14,
              opacity: manual.some((v) => v == null) ? 0.5 : 1,
            }}
          >
            Save
          </button>
        </section>

        <Divider />

        {/* ===== SAVED DATA ===== */}
        <section>
          <div style={rowBetween}>
            <h4 style={sectionTitle}>Ball List</h4>
            <button onClick={() => setShowResetModal(true)} style={dangerBtn}>
              Reset
            </button>
          </div>

          {results.length === 0 && <p style={{ color: "#6b7280" }}>No data</p>}

          {[...results].reverse().map((r, i) => (
            <div key={r.timestamp} style={dataRow}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                No. {results.length - i}
              </div>
              <RenderRow balls={r.balls} />
            </div>
          ))}
        </section>
      </div>

      {/* ===== RESET MODAL ===== */}
      {showResetModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Reset all data?</h3>
            <p style={{ color: "#6b7280" }}>
              This will delete all saved results.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowResetModal(false)}
                style={secondaryBtn}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  reset();
                  setTrueSet(null);
                  setManual([null, null, null]);
                  setShowResetModal(false);
                }}
                style={dangerBtn}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   STYLES
   ====================================================== */

const Divider = () => (
  <div
    style={{
      height: 1,
      background: "#e5e7eb",
      margin: "20px 0",
    }}
  />
);

const primaryBtn = {
  width: "100%",
  height: 42,
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  border: "none",
};

const secondaryBtn = {
  flex: 1,
  height: 40,
  background: "#e5e7eb",
  borderRadius: 8,
  border: "none",
};

const dangerBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 12px",
};

const sectionTitle = {
  marginBottom: 8,
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const dataRow = {
  padding: "8px 0",
  borderBottom: "1px dashed #e5e7eb",
};

const modalOverlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalBox = {
  width: 300,
  background: "#fff",
  borderRadius: 12,
  padding: 20,
};
