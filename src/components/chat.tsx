"use client";

import React, { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CornerDownLeft } from "lucide-react";
import { deleteRoom, leaveRoom, sendMessage } from "@/lib/actions/room.actions";
import { toast } from "./ui/use-toast";
import { useSession } from "@/lib/providers/Sessions.provider";
import { notFound, useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
// import { Toast } from "./ui/toast";
// import { useRouter } from "next/router";

function Message(props: any) {
  const { user } = useSession();
  const route = useRouter();
  // const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [messages, setMessages] = useState<any[]>(props.room.message);

  const sendMessageHandler = async () => {
    if (!input.trim() || !canSendMessage) {
      return toast({
        title: "u cannot send a blank message",
      });
    }
    setCanSendMessage(false);

    try {
      setCanSendMessage(false);
      sendMessage(props.chatId, user?.username, user?.picture, input);
      setInput("");
      // if (messageCount >= 2) {
      setCanSendMessage(false);
      setTimeout(() => {
        setCanSendMessage(true);
      }, 3000);
      // }
    } catch (e) {
      // toast.error("Something went wrong. Please try again later.");
    } finally {
      setCanSendMessage(false);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(`chat_${props.chatId}`);

    pusherClient.bind("message", function (data: any) {
      setMessages((prev) => [...(prev || []), data]);
    });
    pusherClient.bind("connection", function (data: any) {
      setMessages((prev) => [...(prev || []), data]);
    });
    pusherClient.bind("status", function (data: any) {
      leaveRoom(props.chatId, user?.username);
      pusherClient.unsubscribe(`chat_${props.chatId}`);
      pusherClient.unbind_all();

      route.push("/explore");
    });

    scrollDownRef.current?.scrollIntoView(false);
    const handleBeforeUnload = async (event: any) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      pusherClient.unsubscribe(`chat_${props.chatId}`);
      pusherClient.unbind_all();
    };
  }, []);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollDownRef.current?.scrollIntoView(false);
  }, [messages]);
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
                variant={"destructive"}
                onClick={() => {
                  deleteRoom(props.chatId);
                  pusherClient.unbind_all();
                  pusherClient.unsubscribe(`chat_${props.chatId}`);
                  route.push("/explore");
                }}
              >
                delete room
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                onClick={() => {
                  leaveRoom(props.chatId, user?.username);
                  pusherClient.unsubscribe(`chat_${props.chatId}`);
                  pusherClient.unbind_all();

                  route.push("/explore");
                }}
              >
                leave room
              </Button>
            )}
          </div>
        </div>
        {/* {JSON.stringify(user?.id)} */}
      </div>
      <div className="mb-4 h-full max-h-[50vh]">
        <ScrollArea className="h-full max-h-[50vh] flex-1 rounded-md border p-3 overflow-y-auto mb-4">
          <div ref={scrollDownRef}>
            {messages.map((data, index) => {
              const isCurrentUser = data.sender === user?.username;

              const hasNextMessageFromSameUser =
                index < messages.length - 1 &&
                messages[index].sender === messages[index + 1].sender;

              if (data.type) {
                return (
                  <div
                    key={index}
                    className="flex justify-center m-3 items-center "
                  >
                    <Badge className="bg-gray-200">
                      <span className="text-purple-600">
                        {data.name}{" "}
                        <span className="text-gray-500">
                          {data.type === "join" ? "joined" : "left"}
                        </span>
                      </span>
                    </Badge>
                  </div>
                );
              }

              return (
                <div key={index}>
                  <div
                    className={cn("flex items-end mt-1", {
                      "justify-end": isCurrentUser,
                    })}
                  >
                    <div
                      className={cn(
                        "flex flex-col space-y-2 text-base max-w-xs mx-2",
                        {
                          "order-1 items-end": isCurrentUser,
                          "order-2 items-start": !isCurrentUser,
                        }
                      )}
                    >
                      <span
                        className={cn(
                          "px-4 py-2 rounded-lg inline-block break-all",
                          {
                            "bg-purple-600 text-white": isCurrentUser,
                            "bg-gray-200 text-gray-900": !isCurrentUser,
                            "rounded-br-none":
                              !hasNextMessageFromSameUser && isCurrentUser,
                            "rounded-bl-none":
                              !hasNextMessageFromSameUser && !isCurrentUser,
                          }
                        )}
                      >
                        {data.text}
                        <span className="ml-2 text-xs text-gray-400">
                          {format(data.date, "HH:mm")}
                        </span>
                      </span>
                    </div>

                    <div
                      className={cn("relative w-6 h-6", {
                        "order-2": isCurrentUser,
                        "order-1": !isCurrentUser,
                        invisible: hasNextMessageFromSameUser,
                      })}
                    >
                      <Image
                        fill
                        alt="Profile picture"
                        referrerPolicy="no-referrer"
                        src={data.pp}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 96vw, 600px"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      <div
        className="relative overflow-hidden max-h-[30vh] h-full rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          value={input}
          disabled={!canSendMessage}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            canSendMessage
              ? "Type your message here..."
              : "Wait 2 sec to send message again"
          }
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              sendMessageHandler();
              setInput("");
            }
          }}
          className="min-h-12 w-full h-full resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="absolute bottom-0 right-0 flex items-end p-3 pt-0">
          <Button
            onClick={() => sendMessageHandler()}
            size="sm"
            className="gap-1.5"
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
