import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ArrowRight, BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import NewChatDialog from "@/components/NewChatDialog";

export default async function Home() {
  const { userId } = await auth();
  let firstChat;
  if (userId) {
    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));
    firstChat = userChats[0];
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-violet-600 to-indigo-600 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-violet-600" />
            <h1 className="text-4xl font-bold text-gray-900">URLMind</h1>
          </div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        <main className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Your Personal AI-Powered Knowledge Base
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create your own knowledge base from your favorite URLs and get
            AI-powered answers instantly with URLMind.
          </p>

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sign-in <LogIn className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {firstChat ? (
              <Link href={`/chat/${firstChat.id}`}>
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Ignite Knowledge
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <NewChatDialog />
            )}
          </SignedIn>
        </main>

        <footer className="mt-12 text-center text-gray-500">
          <p>&copy; 2024 URLMind. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
