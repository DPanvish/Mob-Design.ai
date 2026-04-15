import { realtime, staticSchema } from "inngest/realtime";

import type { FrameTypes, ScreenPlan } from "@/types";

export const userRealtimeChannel = realtime.channel({
  name: (userId: string) => `user:${userId}`,
  topics: {
    "generation.start": {
      schema: staticSchema<{
        status: "running";
        projectId: string;
      }>(),
    },
    "analysis.start": {
      schema: staticSchema<{
        status: "analyzing";
        projectId: string;
      }>(),
    },
    "analysis.complete": {
      schema: staticSchema<{
        status: "generating";
        theme?: string;
        totalScreens: number;
        screens: ScreenPlan[];
        projectId: string;
      }>(),
    },
    "frame.created": {
      schema: staticSchema<{
        frame: FrameTypes;
        screenId: string;
        projectId: string;
      }>(),
    },
    "generation.complete": {
      schema: staticSchema<{
        status: "completed";
        projectId: string;
      }>(),
    },
  },
});

export const realtimeTopics = [
  "generation.start",
  "analysis.start",
  "analysis.complete",
  "frame.created",
  "generation.complete",
] as const;
