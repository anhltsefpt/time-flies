import React from "react";
import { z } from "zod";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { LifeInWeeksProps } from "../../schemata";
import { TextReveal } from "./TextReveal";
import { WeeksGrid } from "./WeeksGrid";
import { WeeksLeftScene } from "./WeeksLeftScene";
import { ClosingScene } from "./ClosingScene";

loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Timeline (30fps):
// Scene 1: "You are 30 years old"         frames 0-75     (2.5s)
// Scene 2: "Expected to live until 80"     frames 75-150   (2.5s)
// Scene 3: "That's 4,160 weeks total"      frames 150-225  (2.5s)
// Scene 4: "How many weeks left?"          frames 225-300  (2.5s)
// Scene 5: "1,560 weeks already passed"    frames 300-375  (2.5s)
// Scene 6: Grid animation                  frames 375-675  (10s)
// Scene 7: "2,600 weeks left"              frames 675-775  (3.3s)
// Scene 8: "Make every week count."        frames 775-885  (3.7s)

export const LifeInWeeks: React.FC<z.infer<typeof LifeInWeeksProps>> = ({
  age,
  lifeExpectancy,
}) => {
  const totalWeeks = lifeExpectancy * 52;
  const livedWeeks = age * 52;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      {/* Scene 1: Your age */}
      <Sequence from={0} durationInFrames={75} layout="none">
        <TextReveal line1={`You are ${age} years old`} />
      </Sequence>

      {/* Scene 2: Life expectancy */}
      <Sequence from={75} durationInFrames={75} layout="none">
        <TextReveal line1={`Expected to live until ${lifeExpectancy}`} />
      </Sequence>

      {/* Scene 3: Total weeks */}
      <Sequence from={150} durationInFrames={75} layout="none">
        <TextReveal
          line1={`That's ${totalWeeks.toLocaleString()} weeks`}
          line2="total in your lifetime"
        />
      </Sequence>

      {/* Scene 4: Weeks already passed */}
      <Sequence from={225} durationInFrames={75} layout="none">
        <TextReveal
          line1={`${livedWeeks.toLocaleString()} weeks`}
          line2="have already passed"
          accentColor="#ef4444"
        />
      </Sequence>

      {/* Scene 5: The question */}
      <Sequence from={300} durationInFrames={75} layout="none">
        <TextReveal
          line1="Do you know how many weeks you have left?"
          accentColor="#f87171"
        />
      </Sequence>

      {/* Scene 6: Grid animation */}
      <Sequence from={375} durationInFrames={300} layout="none">
        <WeeksGrid age={age} lifeExpectancy={lifeExpectancy} />
      </Sequence>

      {/* Scene 7: Weeks left reveal */}
      <Sequence from={675} durationInFrames={100} layout="none">
        <WeeksLeftScene age={age} lifeExpectancy={lifeExpectancy} />
      </Sequence>

      {/* Scene 8: Closing */}
      <Sequence from={775} durationInFrames={110} layout="none">
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
