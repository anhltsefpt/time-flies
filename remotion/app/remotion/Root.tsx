import { Composition } from "remotion";
import {
  DURATION_IN_FRAMES,
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_ID,
  COMPOSITION_WIDTH,
} from "./constants.mjs";
import { Main } from "./components/Main";
import { LifeInWeeks } from "./components/LifeInWeeks";
import { defaultLifeInWeeksProps } from "./schemata";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id={COMPOSITION_ID}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={COMPOSITION_FPS}
        width={COMPOSITION_WIDTH}
        height={COMPOSITION_HEIGHT}
        defaultProps={{ title: "stranger" }}
      />
      <Composition
        id="LifeInWeeks"
        component={LifeInWeeks}
        durationInFrames={885}
        fps={COMPOSITION_FPS}
        width={1080}
        height={1920}
        defaultProps={defaultLifeInWeeksProps}
      />
    </>
  );
};
