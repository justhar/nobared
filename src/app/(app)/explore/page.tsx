import React from "react";
import Roomcard from "@/components/roomcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getRooms } from "@/lib/actions/room.actions";

async function Explore() {
  const rooms: any = await getRooms();
  return (
    <div className="flex justify-center min-h-[calc(100vh-5rem)]">
      <div className="max-w-[77rem] mt-3 w-full flex flex-col gap-5 p-3 text-textPrimary">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Explore some room
        </h2>
        <div className="flex flex-col sm:flex-row">
          <Button>
            <Link href="/create">New Room</Link>
          </Button>
          <Input
            className="focus-visible:ring-0 sm:ml-7 sm:mt-0 mt-2"
            placeholder="Search..."
          />
        </div>
        {rooms[0] ? (
          rooms.map((item: any) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between gap-5">
              <Roomcard rooms={item} key={item.id} />
            </div>
          ))
        ) : (
          <div className="justify-center m-auto max-w-lg flex center text-center pl-10 pr-10">
            <h2 className="scroll-m-20 pb-2 text-zinc-500 text-3xl font-semibold tracking-tight first:mt-0">
              theres no room available at the moment. please make a room to
              watch together.
            </h2>
          </div>
        )}
        {/* {rooms} */}
      </div>
    </div>
  );
}

export default Explore;
