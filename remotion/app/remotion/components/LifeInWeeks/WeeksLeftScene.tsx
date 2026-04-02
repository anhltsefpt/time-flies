import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT_FAMILY = "Inter, sans-serif";

export const WeeksLeftScene: React.FC<{
  age: number;
  lifeExpectancy: number;
}> = ({ age, lifeExpectancy }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const remainingWeeks = (lifeExpectancy - age) * 52;

  const numberIn = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 35,
  });

  const labelIn = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
    delay: 15,
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const numberScale = interpolate(numberIn, [0, 1], [0.8, 1]);
  const labelY = interpolate(labelIn, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 240,
            fontWeight: 700,
            color: "#60a5fa",
            opacity: numberIn,
            transform: `scale(${numberScale})`,
          }}
        >
          {remainingWeeks.toLocaleString()}
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 76,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.6)",
            opacity: labelIn,
            transform: `translateY(${labelY}px)`,
          }}
        >
          weeks left
        </div>
      </div>
    </AbsoluteFill>
  );
};
