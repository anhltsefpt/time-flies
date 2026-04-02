import { z } from "zod";

export const CompositionProps = z.object({
  title: z.string(),
});

export const LifeInWeeksProps = z.object({
  age: z.number().min(1).max(120),
  lifeExpectancy: z.number().min(1).max(120),
});

export const defaultLifeInWeeksProps: z.infer<typeof LifeInWeeksProps> = {
  age: 30,
  lifeExpectancy: 80,
};

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "React Router and Remotion",
};

export const RenderRequest = z.object({
  inputProps: CompositionProps,
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };
