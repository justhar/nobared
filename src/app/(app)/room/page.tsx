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
  if (searchParams.id !== user?.user.id) {
    connectRoom(searchParams.id, user?.user.username, user?.user.picture);
  }
  return (
    <>
      <main className="min-h-[calc(100vh-5rem)] overflow-auto p-4 ">
        <div className="flex justify-between">
          <p className="my-auto pb-3">room {rooms.name}</p>
          <Leave id={searchParams.id} />
        </div>
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
        <div className="mt-3 mb-3 flex-row flex justify-between">
          <AvatarStack
            maxAvatarsAmount={4}
            avatars={rooms.user.map((name: any) => name.pp.toString())}
          ></AvatarStack>
          <Copy room={rooms.id} />
        </div>
        <div className="max-h-[calc(100vh-5rem)] mt-3">
          <Message chatId={searchParams.id} room={rooms} />
        </div>
      </main>
    </>
  );
}

export default Room;
