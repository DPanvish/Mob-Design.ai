// src/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "mob-design-ai",
  // The Inngest API route will give an error if it's not in dev mode and there's no signing key.
  // We use INNGEST_DEV here because it's more explicit than NODE_ENV.
  dev: process.env.INNGEST_DEV === "1",
  eventQueueBaseUrl: "http://localhost:8288/",
});
