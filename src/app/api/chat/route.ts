import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {Message, StreamData, streamText} from "ai";
import {chats,messages as _messages} from "@/db/schema"
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { getContext } from "@/lib/context";

export const runtime = "edge";

export const maxDuration = 60;
const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY,
});

const model = google("models/gemini-1.5-pro-latest", {
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

export async function POST(req:Request) {
    try {
        const { messages, chatId } = await req.json();
        const _chats = await db
          .select()
          .from(chats)
          .where(eq(chats.id, chatId));
        if (_chats.length != 1) {
          return NextResponse.json(
            { error: "chat not found" },
            { status: 404 }
          );
        }
        const lastMessage = messages[messages.length - 1];
        const context = await getContext(lastMessage.content,_chats[0].namespace_name);

        const prompt = {
          role: "system",
          content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
        `,
        };
        const data = new StreamData();
        data.append({
          context: context,
        });
        const result = await streamText({
          model: model,
          messages: [
            prompt,
            ...messages.filter((message: Message) => message.role === "user"),
          ],
          async onFinish() {
            await db.insert(_messages).values({
              chatId: chatId,
              message_by: "user",
              message_content: lastMessage.content
            });
            await db.insert(_messages).values({
              chatId: chatId,
              message_by: "system",
              message_content: data.toString(),
            })
            data.close();
          },
        });
        return result.toDataStreamResponse({ data });
    } catch (error) {
        console.log("error in POST route of chat\n",error);
    }
}