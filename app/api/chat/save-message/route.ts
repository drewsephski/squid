import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { UIMessage } from "ai";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, chatId }: { message: UIMessage, chatId?: string } = await req.json();

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
    // Fallback to default chat for backward compatibility
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

  // Save the message
  await prisma.message.create({
    data: {
      chatId: chat.id,
      role: message.role,
      content: JSON.stringify(message.parts),  // Changed from JSON.stringify(message.parts)
    },
  });

  return Response.json({ success: true });
}