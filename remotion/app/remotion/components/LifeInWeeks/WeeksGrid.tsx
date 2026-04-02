import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";

const WEEKS_PER_YEAR = 52;
const CELL_SIZE = 15;
const GAP = 2;
const FONT_FAMILY = "Inter, sans-serif";

const EMPTY_COLOR = "rgba(255, 255, 255, 0.08)";
const LIVED_COLOR = "#ef4444";
const REMAINING_COLOR = "rgba(96, 165, 250, 0.4)";

export const WeeksGrid: React.FC<{
  age: number;
  lifeExpectancy: number;
}> = ({ age, lifeExpectancy }) => {
  const frame = useCurrentFrame();
  const totalYears = lifeExpectancy;
  const livedWeeks = age * WEEKS_PER_YEAR;
  const totalWeeks = totalYears * WEEKS_PER_YEAR;

  // Phase A: Grid fade-in (frames 0-30)
  const gridOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const gridScale = interpolate(frame, [0, 30], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Phase B: Fill lived weeks (frames 15-210)
  const fillProgress = interpolate(frame, [15, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const filledCount = Math.floor(fillProgress * livedWeeks);

  // Phase C: Remaining weeks pulse (frames 220-260)
  const pulseProgress = interpolate(frame, [220, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Pre-compute cell colors for performance
  const cellColors = useMemo(() => {
    const colors: string[] = new Array(totalWeeks);
    for (let i = 0; i < totalWeeks; i++) {
      if (i < filledCount) {
        colors[i] = LIVED_COLOR;
      } else if (i >= livedWeeks && pulseProgress > 0) {
        colors[i] = REMAINING_COLOR;
      } else {
        colors[i] = EMPTY_COLOR;
      }
    }
    return colors;
  }, [filledCount, pulseProgress, livedWeeks, totalWeeks]);

  const gridWidth = WEEKS_PER_YEAR * (CELL_SIZE + GAP) - GAP;

  // Year label positions
  const yearLabels = useMemo(() => {
    const labels: number[] = [];
    for (let i = 0; i <= totalYears; i += 10) {
      labels.push(i);
    }
    return labels;
  }, [totalYears]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: gridOpacity,
      }}
    >
      <div
        style={{
          position: "relative",
          transform: `scale(${gridScale})`,
        }}
      >
        {/* Year labels */}
        <div
          style={{
            position: "absolute",
            left: -46,
            top: 0,
          }}
        >
          {yearLabels.map((year) => (
            <div
              key={year}
              style={{
                position: "absolute",
                top: year * (CELL_SIZE + GAP),
                right: 0,
                height: CELL_SIZE,
                display: "flex",
                alignItems: "center",
                fontFamily: FONT_FAMILY,
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.4)",
                fontWeight: 500,
              }}
            >
              {year}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: GAP,
          }}
        >
          {Array.from({ length: totalYears }).map((_, yearIndex) => (
            <div key={yearIndex} style={{ display: "flex", gap: GAP }}>
              {Array.from({ length: WEEKS_PER_YEAR }).map((_, weekIndex) => {
                const weekNumber = yearIndex * WEEKS_PER_YEAR + weekIndex;
                return (
                  <div
                    key={weekIndex}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      borderRadius: 2,
                      backgroundColor: cellColors[weekNumber],
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Age marker line */}
        {fillProgress >= 1 && (
          <div
            style={{
              position: "absolute",
              left: -8,
              top: age * (CELL_SIZE + GAP) - 1,
              width: gridWidth + 16,
              height: 2,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              opacity: pulseProgress,
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
