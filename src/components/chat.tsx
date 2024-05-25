"use client";

import React, { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { leaveRoom, sendMessage } from "@/lib/actions/room.actions";
import { toast } from "./ui/use-toast";
import { useSession } from "@/lib/providers/Sessions.provider";
import { useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import Copy from "./copy";
import { AvatarStack } from "./ui/avatar-stack";

//TODO: QUIT SOUND GONE.

function Message(props: any) {
  const { user } = useSession();
  const route = useRouter();
  const [input, setInput] = useState<string>("");
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [messages, setMessages] = useState<any[]>(props.room.message);
  const [avatars, setAvatars] = useState<any[]>(
    props.room.user.map((name: any) => name.pp.toString())
  );

  const sendMessageHandler = async () => {
    if (!input.trim() || !canSendMessage) {
      return toast({
        title: "u cannot send a blank message",
      });
    }
    setCanSendMessage(false);

    try {
      setCanSendMessage(false);
      sendMessage(props.chatId, user?.id, user?.username, user?.picture, input);
      setInput("");
      // if (messageCount >= 2) {
      setCanSendMessage(false);
      setTimeout(() => {
        setCanSendMessage(true);
      }, 500);
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
      if (data.type === "join") {
        setAvatars((prev) => [...(prev || []), data.pp]);
      } else {
        setAvatars((prevAvatars) => prevAvatars.slice(0, -1));
      }
    });
    pusherClient.bind("status", function (data: any) {
      leaveRoom(props.chatId, user?.username);
      pusherClient.unsubscribe(`chat_${props.chatId}`);
      pusherClient.unbind_all();

      route.push("/explore?del=true");
    });

    // scrollDownRef.current?.scrollIntoView(false);
    const handleBeforeUnload = async (event: any) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      pusherClient.unsubscribe(`chat_${props.chatId}`);
      pusherClient.unbind_all();
    };
  }, []);

  // const scrollDownRef = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   scrollDownRef.current?.scrollIntoView(false);
  // }, [messages]);
  return (
    <>
      <div className="mt-3 mb-3 flex-row flex justify-between">
        <AvatarStack maxAvatarsAmount={4} avatars={avatars}></AvatarStack>
        <Copy room={props.chatId} />
      </div>
      <div className="max-h-[calc(100vh-5rem)] mt-3">
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 col-span-1">
          <div className=" flex-row flex justify-between">
            <div className="flex-col mb-2">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Chat room
              </h4>
              <p className="text-sm text-muted-foreground">
                room {props.room.name}
              </p>
            </div>
          </div>
          {/* {JSON.stringify(user?.id)} */}
          {
            // TODO: SHOW ALL THE PARTICIPANT
          }
          <div className="mb-4">
            <ScrollArea className="h-[50vh] flex-1 rounded-md border p-3 overflow-y-auto mb-4">
              <div>
                {messages.map((data, index) => {
                  const isCurrentUser = data.sender === user?.username;

                  const hasNextMessageFromSameUser =
                    index < messages.length - 1 &&
                    messages[index].id === messages[index + 1].id;
                  if (data.type) {
                    return (
                      <div
                        key={index}
                        className="flex justify-center m-3 items-center "
                      >
                        <Badge className="bg-gray-200">
                          <span className="text-purple-600">
                            {data.sender}{" "}
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
                            "flex flex-col space-y-2 text-base max-w-[50vw] mx-2",
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
          <div className="relative overflow-hidden max-h-[30vh] rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
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
                  ? "Type your message here... (Enter to send message)"
                  : "Wait 0.5 sec to send message again"
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Message;
