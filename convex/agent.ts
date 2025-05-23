import { google } from "@ai-sdk/google"; 
import { Agent } from "@convex-dev/agent";
import { v } from "convex/values";
import { components } from "./_generated/api"; 
import { action, internalQuery } from "./_generated/server";
import { z } from "zod";
import { generateBasicReview } from "./fallbackReview";

const createThreadSchema = z.object({
  prompt: z.string(),
  code: z.string().min(50, { message: "Code must be at least 50 characters long." }),
});

export const getEnvVars = internalQuery({
  handler: async () => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables");
    }
    
    return { apiKey };
  },
});

const supportAgent = new Agent(components.agent, {
  chat: google.chat("gemini-1.5-pro-latest"), 
  textEmbedding: google.embedding("text-embedding-004"),
  instructions:
    "You are a code review assistant that is a Senior Software Engineer. Your goal is to help developers review their code by providing constructive feedback, identifying potential issues, and suggesting improvements. Focus on code quality, best practices, and potential bugs but avoid being too basic.",
  tools: {},
});

export const supportAgentStep = supportAgent.asAction({ maxSteps: 10 });

export const createCodeReviewThread = action({
  args: {
    prompt: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const validatedArgs = createThreadSchema.parse(args);
    const { prompt, code } = validatedArgs;

    console.log("Creating code review thread with Gemini model");
    
    try {
      const { threadId, thread } = await supportAgent.createThread(ctx);

      const result = await thread.generateText({
        prompt: `${prompt}\n\nHere's the code to review:\n\`\`\`\n${code}\n\`\`\``,
      });

      console.log("Agent Response (Gemini):", result.text);
      console.log("Thread ID:", threadId);

      return { threadId, text: result.text };
    } catch (error: unknown) {
      console.error("Error in code review thread:", error);
      
      if (error instanceof Error && error.message.includes("API key")) {
        throw new Error(`Gemini API key issue: ${error.message}. Please check your environment variables.`);
      }
      
      // If we hit API limits or other errors, generate a basic review instead
      console.log("Generating fallback code review due to API error");
      const fallbackReview = generateBasicReview(prompt, code);
      return {
        threadId: "fallback-review-" + Date.now(),
        text: fallbackReview
      };
    }
  },
});
