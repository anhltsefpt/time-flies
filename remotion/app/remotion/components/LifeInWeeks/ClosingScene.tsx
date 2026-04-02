import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT_FAMILY = "Inter, sans-serif";

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
  });

  const scale = interpolate(entrance, [0, 1], [0.9, 1]);

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: entrance * fadeOut,
      }}
    >
      <h1
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 120,
          fontWeight: 700,
          color: "white",
          margin: 0,
          transform: `scale(${scale})`,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Make every week count.
      </h1>
    </AbsoluteFill>
  );
};
