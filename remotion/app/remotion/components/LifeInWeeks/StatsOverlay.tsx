import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT_FAMILY = "Inter, sans-serif";

export const StatsOverlay: React.FC<{
  age: number;
  lifeExpectancy: number;
}> = ({ age, lifeExpectancy }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const livedPercent = ((age / lifeExpectancy) * 100).toFixed(1);
  const remainingWeeks = ((lifeExpectancy - age) * 52).toLocaleString();

  const line1In = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
  });

  const line2In = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
    delay: 15,
  });

  const line1Y = interpolate(line1In, [0, 1], [40, 0]);
  const line2Y = interpolate(line2In, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 180,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 76,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.8)",
            margin: 0,
            opacity: line1In,
            transform: `translateY(${line1Y}px)`,
          }}
        >
          You've lived{" "}
          <span style={{ fontWeight: 700, color: "#f87171" }}>
            {livedPercent}%
          </span>
        </p>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 76,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.8)",
            margin: 0,
            opacity: line2In,
            transform: `translateY(${line2Y}px)`,
          }}
        >
          <span style={{ fontWeight: 700, color: "#60a5fa" }}>
            {remainingWeeks}
          </span>{" "}
          weeks remaining
        </p>
      </div>
    </AbsoluteFill>
  );
};
