import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { chats } from "@/db/schema";
import ChatComponent from "@/components/ChatComponent1";
import ChatSideBar from "@/components/ChatSideBar";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  console.log(userId);
  if (!userId) {
    redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  const parsedChatId = parseInt(chatId, 10);
  const defaultChatId = 1; // Default chat ID when there are no chats

  // Use the parsed chat ID if valid, otherwise use the default
  const currentChatId = !isNaN(parsedChatId) ? parsedChatId : defaultChatId;

  // Check if the current chat exists (if there are any chats)
  const currentChat = _chats.find((chat) => chat.id === currentChatId);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex w-full">
        {/* Chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={currentChatId} />
        </div>
        {/* Chat component or empty state */}
        <div className="flex-[3] border-l border-l-slate-200">
          {currentChat ? (
            <ChatComponent chatId={currentChatId} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">
                {_chats.length === 0
                  ? "No chats yet. Create a new chat to get started!"
                  : "Select a chat or create a new one."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
