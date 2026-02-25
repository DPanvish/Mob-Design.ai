"use server"

import { openrouter } from "@/lib/openrouter"
import { generateText } from "ai"

export const generateProjectName = async(prompt: string) => {
    try{
        const withTimeout = <T,>(p: Promise<T>, ms: number) => new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("LLM request timeout")), ms);
            p.then((value) => {
                clearTimeout(timer);
                resolve(value);
            }).catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
        });

        const {text} = await withTimeout(
            generateText({
                model: openrouter.chat("google/gemini-2.5-flash-lite"),
                system: `You are an AI assistant that generates very very short project names based on the user's prompt.
                - Keep it under 4 to 5 words.
                - Capitalize words appropriately.
                - Do not include special characters.
                `,
                prompt: prompt,
            }),
            10000
        );

        return text?.trim() || "Untitled Project";
    }catch(error){
        console.error("generateProjectName failed", error);
        return "Untitled Project";
    }
}