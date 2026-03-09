import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get or create user in DB
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId },
    });
  }

  // Get all chats for the user
  const chats = await prisma.chat.findMany({
    where: { userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // Get the last message for preview
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Format the response
  const formattedChats = chats.map((chat) => ({
    id: chat.id,
    title: chat.title || "Untitled Chat",
    createdAt: chat.createdAt,
    messageCount: chat._count.messages,
    lastMessage: chat.messages[0]?.content || null,
  }));

  return Response.json({ chats: formattedChats });
}
