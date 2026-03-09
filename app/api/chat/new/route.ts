import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
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

  // Create a new chat
  const newChat = await prisma.chat.create({
    data: {
      userId: user.id,
      title: "New Chat",
    },
  });

  return Response.json({ chatId: newChat.id });
}
