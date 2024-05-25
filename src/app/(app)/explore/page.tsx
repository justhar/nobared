"use client";

import React, { useEffect, useState } from "react";
import Roomcard from "@/components/roomcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
export const dynamic = "force-dynamic";

function Explore() {
  const route = useRouter();
  const [rooms, setRooms] = useState([]);
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [dele, setDele] = useState<boolean>(true);

  const del = searchParams.get("del");

  useEffect(() => {
    setFilteredRooms(
      rooms.filter((room: { name: string }) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, rooms]);

  if (dele && del) {
    toast({
      title: "the room was deleted",
      description: "by the host",
    });
    setDele(false);
  }
  useEffect(() => {
    fetch("/api/rooms", {})
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((error) => console.error("Error fetching data:", error));

    const intervalId = setInterval(() => {
      fetch("/api/rooms", { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => {
          setRooms(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, 3000); // fetch every 3 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex justify-center min-h-[calc(100vh-5rem)]">
      <div className="max-w-[77rem] mt-3 w-full flex flex-col gap-5 p-3 text-textPrimary">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Explore some room
        </h2>
        <div className="flex flex-col sm:flex-row">
          <Button onClick={() => route.push("/create")}>New Room</Button>
          <Input
            className="focus-visible:ring-0 sm:ml-7 sm:mt-0 mt-2"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredRooms[0] ? (
          filteredRooms.map((item: any) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between gap-5"
              key={item.id}
            >
              <Roomcard rooms={item} />
            </div>
          ))
        ) : (
          <div className="justify-center m-auto max-w-lg flex center text-center pl-10 pr-10">
            <h2 className="scroll-m-20 pb-2 text-zinc-500 text-3xl font-semibold tracking-tight first:mt-0">
              theres no room available at the moment. please make a room to
              watch together.{" "}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
