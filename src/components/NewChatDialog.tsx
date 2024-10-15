"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, PlusCircle } from "lucide-react";
import {toast} from 'sonner'
const formSchema = z.object({
  chatName: z.string().min(1, "Chat name is required"),
  urls: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one URL is required"),
});

export default function NewChatDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: "",
      urls: [""],
    },
  });

  const handleAddUrl = () => {
    const currentUrls = form.getValues("urls");
    form.setValue("urls", [...currentUrls, ""]);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: values.urls.filter((url) => url.trim() !== ""),
          chat_name: values.chatName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      toast.success("Chat created successfully");
      router.push(`/chat/${data.chat_id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <BookOpen className="h-4 w-4 text-violet-600" />
          <DialogTitle>Craft a Chat</DialogTitle>
          <DialogDescription>Ignite Conversation with URLs</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="chatName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter chat name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("urls").map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`urls.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter URL" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                onClick={handleAddUrl}
                variant="outline"
                className="bg-[#E0F7FA] hover:bg-[#0077FF] hover:text-white"
              >
                Add URL
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#0077FF] text-white hover:bg-[#5D3FD3]"
              >
                {isLoading ? "Creating..." : "Create Chat"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
