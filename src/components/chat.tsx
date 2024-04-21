"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CornerDownLeft } from "lucide-react";
import { deleteRoom, leaveRoom, test } from "@/lib/actions/room.actions";
import { toast } from "./ui/use-toast";
import Bubbles from "./message";
import { useSession } from "@/lib/providers/Sessions.provider";
import { notFound } from "next/navigation";
// import { useRouter } from "next/router";

function Message(props: any) {
  const { user } = useSession();
  // const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  function onSubmit() {}

  useEffect(() => {
    // console.log(user);
    const handleBeforeUnload = async (event: any) => {
      event.preventDefault();
      if (user?.id === props.chatId) {
        await deleteRoom(props.chatId);
        await pusherClient.unsubscribe(props.chatId);
        // console.log("yes true");
      } else {
        await leaveRoom(props.chatId, user?.username);
        await pusherClient.unsubscribe(props.chatId);
      }
    };
    // console.log("user id", user?.id);
    // console.log("chat id", props.chatId);

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function untuk menghapus event listener
    return () => {
      // router.beforePopState(() => true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const con = pusherClient.subscribe(`${props.chatId}`);
    con.bind("connect", function (data: any) {
      console.log(data);
      setMessages((prev) => [data, ...(prev || [])]);
      // setMessages(data);
    });
    if (user?.id !== props.chatId) {
      con.bind("status", function (data: any) {
        if (data.status === "ownerleave") {
          notFound;
        }
      });
    }
    return () => {
      pusherClient.unsubscribe(props.chatId);
    };
  }, [props]);
  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 col-span-1">
      <div className="flex-1">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5 border-b">
          Chat Room
        </h2>
        {JSON.stringify(messages)}
        <Bubbles />
        {JSON.stringify(user?.id)}
      </div>
      <div
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              toast({
                title: "Scheduled: Catch up ",
                description: "Friday, February 10, 2023 at 5:57 PM",
              });
            }
          }}
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button onClick={() => test()} size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Message;
