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
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const composio = new Composio({ provider: new VercelProvider() });

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const chatId = url.searchParams.get('chatId');

  // Get or create user in DB
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId },
    });
  }

  let chat;

  if (chatId) {
    // Fetch specific chat
    chat = await prisma.chat.findFirst({
      where: { id: parseInt(chatId), userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }
  } else {
    // Get or create default chat (for backward compatibility)
    chat = await prisma.chat.findFirst({
      where: { userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title: "Default Chat",
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }
  }

  // Convert DB messages to UIMessage format
  const messages: UIMessage[] = chat.messages.map((msg: Prisma.Message) => {
    let parts;
    try {
      // Try to parse as JSON parts array
      parts = JSON.parse(msg.content);
    } catch {
      // Fallback to text content for backward compatibility
      parts = [{ type: "text" as const, text: msg.content }];
    }
    return {
      id: msg.id.toString(),
      role: msg.role as "user" | "assistant",
      content: msg.content,
      parts,
      createdAt: msg.createdAt,
    };
  });

  return Response.json({ messages });
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, chatId }: { messages: UIMessage[], chatId?: string } = await req.json();

  // Get or create user in DB
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId },
    });
  }

  // Get or create chat
  let chat;
  if (chatId) {
    chat = await prisma.chat.findFirst({
      where: { id: parseInt(chatId), userId: user.id },
    });
    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }
  } else {
    // Get or create default chat (for backward compatibility)
    chat = await prisma.chat.findFirst({
      where: { userId: user.id },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title: "Default Chat",
        },
      });
    }
  }

  // Save new messages to DB
  for (const message of messages) {
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: message.role,
        content: JSON.stringify(message.parts),
      },
    });
  }

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