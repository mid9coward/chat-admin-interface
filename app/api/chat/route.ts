import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Received messages:", messages);

    if (!process.env.OPENAI_API_KEY) {
      console.error("API Key is missing");
      return new Response(JSON.stringify({ error: "Missing API Key" }), {
        status: 500,
      });
    }

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages,
      system: "Bạn là trợ lý AI hữu ích, luôn trả lời bằng tiếng Việt.",
    });

    console.log("Response from OpenAI:", result);

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Error processing request" }), {
      status: 500,
    });
  }
}
