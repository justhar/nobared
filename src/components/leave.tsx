"use client";

import { deleteRoom, leaveRoom } from "@/lib/actions/room.actions";
import { pusherClient } from "@/lib/pusher";
import { CornerUpLeft, LogOut } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/providers/Sessions.provider";

export default function Leave(props: any) {
  const route = useRouter();
  const { user } = useSession();

  return (
    <div className="mb-3">
      {user?.id === props.id ? (
        <Button
          variant={"destructive"}
          onClick={() => {
            deleteRoom(props.id);
            pusherClient.unbind_all();
            pusherClient.unsubscribe(`chat_${props.id}`);
            pusherClient.unsubscribe(`video_${props.id}`);
            route.push("/explore");
          }}
        >
          <span className="mr-1 max-sm:hidden">delete</span>
          <CornerUpLeft className="size-3.5" />
        </Button>
      ) : (
        <Button
          variant={"destructive"}
          onClick={() => {
            leaveRoom(props.id, user?.username);
            pusherClient.unsubscribe(`chat_${props.id}`);
            pusherClient.unsubscribe(`video_${props.id}`);
            pusherClient.unbind_all();

            route.push("/explore");
          }}
        >
          leave room
        </Button>
      )}
    </div>
  );
}
