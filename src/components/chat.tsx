"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CornerDownLeft } from "lucide-react";
import { deleteRoom, leaveRoom, sendMessage } from "@/lib/actions/room.actions";
import { toast } from "./ui/use-toast";
import Bubbles from "./message";
import { useSession } from "@/lib/providers/Sessions.provider";
import { notFound, redirect } from "next/navigation";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

function Message(props: any) {
  const { user } = useSession();
  const route = useRouter();
  // const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessageHandler = async () => {
    if (!input || !canSendMessage) {
      return toast({
        title: "u cannot send a blank message",
      });
    }
    setCanSendMessage(false);

    try {
      // await axios.post("/api/message/send", { text: input, chatId });
      sendMessage(props.chatId, user?.username, user?.picture, input);
      setInput("");
      // if (textareaRef.current) {
      //   textareaRef.current.focus();
      // }

      // if (messageCount >= 2) {
      setCanSendMessage(false);
      setTimeout(() => {
        setCanSendMessage(true);
        // setMessageCount(0);
      }, 3000);
      // }
    } catch (e) {
      // toast.error("Something went wrong. Please try again later.");
    } finally {
      setCanSendMessage(true);
    }
  };

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
    con.bind("message", function (data: any) {
      setMessages((prev) => [data, ...(prev || [])]);
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
  }, [1]);
  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 col-span-1">
      <div className="flex-1">
        <div className=" flex-row flex justify-between">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-auto">
            Chat Room
          </h2>
          <div className="mb-2">
            {user?.id === props.chatId ? (
              <Button
                onClick={() => {
                  deleteRoom(props.chatId);
                  route.push("/explore");
                }}
              >
                delete room
              </Button>
            ) : (
              <Button
                onClick={() => {
                  leaveRoom(props.chatId, user?.username);
                  route.push("/explore");
                }}
              >
                leave room
              </Button>
            )}
          </div>
        </div>
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
              e.preventDefault();
              sendMessageHandler();
              setInput("");
            }
          }}
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button
            onClick={() => sendMessageHandler()}
            size="sm"
            className="ml-auto gap-1.5"
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Message;
