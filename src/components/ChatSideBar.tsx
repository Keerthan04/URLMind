'use client'
import React, { useState } from "react";
import { DrizzleChat } from "@/db/schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [urls, setUrls] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddUrl = () => {
    setUrls([...urls, ""]);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: urls.filter((url) => url.trim() !== ""),
          chat_name: chatName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      router.push(`/chat/${data.chat_id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full max-h-screen overflow-scroll soff p-4 text-gray-200 bg-gray-900">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full border-dashed border-white border">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Chat
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chat</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chat-name" className="text-right">
                  Chat Name
                </Label>
                <Input
                  id="chat-name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {urls.map((url, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={`url-${index}`} className="text-right">
                    URL {index + 1}
                  </Label>
                  <Input
                    id={`url-${index}`}
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="col-span-3"
                  />
                </div>
              ))}
              <Button type="button" onClick={handleAddUrl} variant="outline">
                Add URL
              </Button>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Chat"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex max-h-screen overflow-scroll pb-20 flex-col gap-2 mt-4">
        {chats.length === 0 ? (
          <p>No chats</p>
        ) : (
          chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  "rounded-lg p-3 text-slate-300 flex items-center",
                  {
                    "bg-blue-600 text-white": chat.id === chatId,
                    "hover:text-white": chat.id !== chatId,
                  }
                )}
              >
                <MessageCircle className="mr-2" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.chat_name}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSideBar;
