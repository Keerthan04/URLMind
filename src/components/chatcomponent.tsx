"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Menu, Plus, Send, X } from "lucide-react";

export default function ChatComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [urls, setUrls] = React.useState([""]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Submitted URLs:",
      urls.filter((url) => url.trim() !== "")
    );
    // Here you would typically send the URLs to your backend or process them
    setUrls([""]); // Reset the form after submission
  };

  return (
    <div className="flex h-screen bg-[#F4F4F9]">
      {/* Mobile sidebar trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[300px] p-0 bg-[#5D3FD3] text-white"
        >
          <Sidebar urls={urls} setUrls={setUrls} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-[300px] bg-[#5D3FD3] text-white">
        <Sidebar urls={urls} setUrls={setUrls} />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {/* Chat messages would go here */}
          <div className="space-y-4">
            <ChatMessage sender="user" message="Hello, how are you?" />
            <ChatMessage
              sender="ai"
              message="I'm doing well, thank you for asking! How can I assist you today?"
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-gray-200">
          <form className="flex space-x-2">
            <Input placeholder="Type your message..." className="flex-1" />
            <Button type="submit" className="bg-[#0077FF] hover:bg-[#0066CC]">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4 md:hidden bg-[#0077FF] hover:bg-[#0066CC] text-white">
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Chat</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {urls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUrlField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addUrlField}
              className="w-full"
            >
              Add Another URL
            </Button>
            <Button
              type="submit"
              className="w-full bg-[#0077FF] hover:bg-[#0066CC] text-white"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Sidebar({
  urls,
  setUrls,
}: {
  urls: string[];
  setUrls: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#0077FF] hover:bg-[#0066CC] text-white">
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Chat</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(
                  "Submitted URLs:",
                  urls.filter((url) => url.trim() !== "")
                );
                setUrls([""]); // Reset the form after submission
              }}
              className="space-y-4"
            >
              {urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...urls];
                      newUrls[index] = e.target.value;
                      setUrls(newUrls);
                    }}
                    className="flex-1"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newUrls = urls.filter((_, i) => i !== index);
                        setUrls(newUrls);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setUrls([...urls, ""])}
                className="w-full"
              >
                Add Another URL
              </Button>
              <Button
                type="submit"
                className="w-full bg-[#0077FF] hover:bg-[#0066CC] text-white"
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {["Chat 1", "Chat 2", "Chat 3"].map((chat, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#4D2DB3]"
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              {chat}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ChatMessage({
  sender,
  message,
}: {
  sender: "user" | "ai";
  message: string;
}) {
  return (
    <div
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          sender === "user"
            ? "bg-[#0077FF] text-white"
            : "bg-[#E0F7FA] text-gray-800"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
