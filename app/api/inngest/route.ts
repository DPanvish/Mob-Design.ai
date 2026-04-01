import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { processTask } from "@/inngest/functions/functions";
import { generateScreens } from "@/inngest/functions/generateScreens";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processTask,
    generateScreens
  ],
});