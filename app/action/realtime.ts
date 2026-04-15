"use server"

import { getSubscriptionToken } from "inngest/realtime";
import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";
import { realtimeTopics, userRealtimeChannel } from "@/inngest/realtime";

export async function fetchRealtimeSubscriptionToken() {
  const { userId } = await auth();
  
  if(!userId){
    return null;
  }

  return getSubscriptionToken(inngest, {
    channel: userRealtimeChannel(userId),
    topics: [...realtimeTopics],
  });
}
