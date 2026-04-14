// src/inngest/client.ts
import { Inngest } from "inngest";

const isInngestDev = process.env.INNGEST_DEV === "1";

export const inngest = new Inngest({
  id: "mob-design-ai",
  // The Inngest API route will give an error if it's not in dev mode and there's no signing key.
  // We use INNGEST_DEV here because it's more explicit than NODE_ENV.
  dev: isInngestDev,
  eventQueueBaseUrl: process.env.INNGEST_EVENT_QUEUE_BASE_URL || (isInngestDev ? "http://localhost:8288/" : undefined),
});
