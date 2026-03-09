import { openrouter } from "@openrouter/ai-sdk-provider";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import {
  streamText,
  convertToModelMessages,
  generateId,
  stepCountIs,
  type UIMessage,
} from "ai";

const composio = new Composio({ provider: new VercelProvider() });

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const session = await composio.create("user_123");
  const tools = await session.tools();

  const result = streamText({
    model: openrouter("openrouter/free"),
    system: "You are a helpful assistant specialized in tool integrations via Composio. Always prioritize relevant tools, explain your reasoning briefly, and avoid unnecessary steps. Examples: For GitHub tasks, use GitHub tools; for Slack, use Slack tools.",
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: () => generateId(),
  });
}