import React, { useEffect } from "react";
import { getRoomId } from "@/lib/actions/room.actions";
import { redirect } from "next/navigation";
import RoomForm from "@/components/form";
import { validateRequest } from "@/lib/auth";

export default async function Create() {
  const user = await validateRequest();
  if (!user.user) {
    redirect("/signin");
  }

  if (await getRoomId(user?.user?.id)) {
    redirect("/room?id=" + user?.user?.id);
  }

  return (
    <div className="flex justify-center min-h-[calc(100vh-5rem)]">
      <div className="max-w-[77rem] md:mt-3 w-full flex flex-col gap-3 p-3 text-textPrimary">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create a new room
        </h1>
        <p className="leading-7 ">
          Create a new room to watch a youtube video together and share it with
          your friends.
        </p>
        <RoomForm />
      </div>
    </div>
  );
}
