import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT_FAMILY = "Inter, sans-serif";

export const TextReveal: React.FC<{
  line1: React.ReactNode;
  line2?: React.ReactNode;
  accentColor?: string;
}> = ({ line1, line2, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const line1In = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const line2In = line2
    ? spring({
        frame,
        fps,
        config: { damping: 200 },
        durationInFrames: 30,
        delay: 15,
      })
    : 0;

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const line1Y = interpolate(line1In, [0, 1], [50, 0]);
  const line2Y = interpolate(line2In, [0, 1], [40, 0]);

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
          gap: 20,
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 144,
            fontWeight: 700,
            color: accentColor || "white",
            textAlign: "center",
            lineHeight: 1.2,
            opacity: line1In,
            transform: `translateY(${line1Y}px)`,
          }}
        >
          {line1}
        </div>
        {line2 && (
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.5)",
              textAlign: "center",
              lineHeight: 1.4,
              opacity: line2In,
              transform: `translateY(${line2Y}px)`,
            }}
          >
            {line2}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
