"use client";

import React from "react";
import { DrizzleChat } from "@/db/schema";
import Link from "next/link";
import { cn } from "@/lib/utils";
import NewChatDialog from "./NewChatDialog";
import { BookOpen, MessageCircle } from "lucide-react";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};
const ChatSideBar = ({ chats, chatId }: Props) => {

  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <div className="flex items-center mb-6">
        <BookOpen className="h-8 w-8 text-[#F4F4F9]" />
        <h1 className="ml-2 text-2xl font-bold text-gray-200">
          <Link href="/">URLMind</Link>
        </h1>{" "}
      </div>
      <NewChatDialog/>

      <div className="flex h-screen overflow-auto pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.chat_name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    // <div className="w-full h-screen p-4 bg-[#5D3FD3] text-gray-900">
    //   {/* Header Section */}
    //   <div className="flex items-center mb-6">
    //     <BookOpen className="h-8 w-8 text-[#F4F4F9]" />
    //     <h1 className="ml-2 text-2xl font-bold text-gray-900">URLMind</h1>
    //   </div>

    //   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    //     <DialogTrigger asChild>
    //       <Button className="w-full border-dashed border-[#0077FF] border bg-[#0077FF] hover:bg-[#5ba7ff] hover:text-white">
    //         <PlusCircle className="mr-2 w-4 h-4" />
    //         New Chat
    //       </Button>
    //     </DialogTrigger>
    //     <DialogContent>
    //       <DialogHeader>
    //         <DialogTitle>Create New Chat</DialogTitle>
    //       </DialogHeader>
    //       <Form {...form}>
    //         <form onSubmit={form.handleSubmit(handleSubmit)}>
    //           <div className="grid gap-4 py-4">
    //             <FormField
    //               name="chatName"
    //               control={form.control}
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <FormLabel>Chat Name</FormLabel>
    //                   <FormControl>
    //                     <Input {...field} placeholder="Enter chat name" />
    //                   </FormControl>
    //                   <FormMessage />
    //                 </FormItem>
    //               )}
    //             />
    //             {form.watch("urls").map((url, index) => (
    //               <FormField
    //                 key={index}
    //                 name={`urls.${index}`}
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>URL {index + 1}</FormLabel>
    //                     <FormControl>
    //                       <Input {...field} placeholder="Enter URL" />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //             ))}
    //             <Button
    //               type="button"
    //               onClick={handleAddUrl}
    //               variant="outline"
    //               className="bg-[#E0F7FA] hover:bg-[#0077FF] hover:text-white"
    //             >
    //               Add URL
    //             </Button>
    //           </div>
    //           <div className="flex justify-end">
    //             <Button
    //               type="submit"
    //               disabled={isLoading}
    //               className="bg-[#0077FF] text-white hover:bg-[#5D3FD3]"
    //             >
    //               {isLoading ? "Creating..." : "Create Chat"}
    //             </Button>
    //           </div>
    //         </form>
    //       </Form>
    //     </DialogContent>
    //   </Dialog>

    //   <div className="flex h-screen overflow-auto pb-20 flex-col gap-2 mt-4">
    //     {chats.map((chat) => (
    //       <Link key={chat.id} href={`/chat/${chat.id}`}>
    //         <div
    //           className={cn("rounded-lg p-3 flex items-center", {
    //             "bg-[#0077FF] text-white": chat.id === chatId,
    //             "hover:bg-[#5D3FD3] hover:text-white text-[#5D3FD3]":
    //               chat.id !== chatId,
    //           })}
    //         >
    //           <MessageCircle className="mr-2" />
    //           <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
    //             {chat.chat_name}
    //           </p>
    //         </div>
    //       </Link>
    //     ))}
    //   </div>
    // </div>
  );
};

export default ChatSideBar;
