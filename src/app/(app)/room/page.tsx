import { notFound, redirect } from "next/navigation";
import { connectRoom, getRoomId } from "@/lib/actions/room.actions";
import Message from "@/components/chat";
import { validateRequest } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "room | nobared",
  description: "go watch together in nobared",
};

async function Room({ searchParams }: { searchParams: any }) {
  const user = await validateRequest();
  // console.log(user.user?.id);
  if (!user.user) {
    redirect("/signin");
  }
  if (!searchParams.id) {
    redirect("/explore");
  }
  const rooms = await getRoomId(searchParams.id);
  // console.log(rooms, "heyy");
  if (!rooms) {
    notFound();
  }
  if (searchParams.id !== user?.user.id) {
    connectRoom(searchParams.id, user?.user.username, user?.user.picture);
  }
  // console.log(initialMessage);
  // console.log(JSON.stringify(searchParams.id));
  return (
    <div>
      <main className="grid min-h-[calc(100vh-5rem)] gap-4 overflow-auto p-4 md:grid-cols-3">
        <div className="md:col-span-2 relative flex-col items-start gap-8 flex bg-red-900">
          <h1>
            {JSON.stringify(searchParams.id)}
            userid: {user.user.id}
          </h1>
        </div>
        <Message chatId={searchParams.id} room={rooms} />
      </main>
    </div>
  );
  // return <>{JSON.stringify(searchParams)}</>;
}

export default Room;
