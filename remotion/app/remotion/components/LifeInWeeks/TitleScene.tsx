import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT_FAMILY = "Inter, sans-serif";

export const TitleScene: React.FC<{
  age: number;
  lifeExpectancy: number;
}> = ({ age, lifeExpectancy }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
  });

  const subtitleIn = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
    delay: 12,
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleY = interpolate(titleIn, [0, 1], [40, 0]);
  const subtitleY = interpolate(subtitleIn, [0, 1], [30, 0]);

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
          marginTop: -200,
        }}
      >
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            margin: 0,
            opacity: titleIn,
            transform: `translateY(${titleY}px)`,
          }}
        >
          Your Life in Weeks
        </h1>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 34,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.6)",
            margin: 0,
            opacity: subtitleIn,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          Age {age} · Life expectancy {lifeExpectancy}
        </p>
      </div>
    </AbsoluteFill>
  );
};
