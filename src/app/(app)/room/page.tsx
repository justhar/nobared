import { notFound, redirect } from "next/navigation";
import { connectRoom, getRoomId } from "@/lib/actions/room.actions";
import Message from "@/components/chat";
import { validateRequest } from "@/lib/auth";
import { Metadata } from "next";
import Host from "@/components/streamHost";
import View from "@/components/streamView";
import { AvatarStack } from "@/components/ui/avatar-stack";
import room from "@/lib/models/room";
import Copy from "@/components/copy";
import Leave from "@/components/leave";
import { useSession } from "@/lib/providers/Sessions.provider";

export const metadata: Metadata = {
  title: `room | nobared`,
  description: "go watch together in nobared",
};

type searchParams = {
  searchParams: {
    id: string;
  };
};

async function Room({ searchParams }: searchParams) {
  const user = await validateRequest();
  if (!user.user) {
    redirect(`/signin?cb=${searchParams.id}`);
  }
  if (!searchParams.id) {
    redirect("/explore");
  }
  const rooms = await getRoomId(searchParams.id);
  if (!rooms) {
    notFound();
  }
  return (
    <>
      <main className="min-h-[calc(100vh-5rem)] overflow-auto p-4 ">
        {searchParams.id == user?.user.id ? (
          <Host
            roomId={searchParams.id}
            room={rooms}
            className="w-full h-full object-cover aspect-video "
          />
        ) : (
          <View
            room={rooms}
            roomId={searchParams.id}
            className="w-full h-full object-cover aspect-video "
          />
        )}
        <Message chatId={searchParams.id} room={rooms} />
      </main>
    </>
  );
}

export default Room;
