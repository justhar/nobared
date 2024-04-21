import React from "react";
import Roomcard from "@/components/roomcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
function Explore() {
  return (
    <div className="flex justify-center min-h-[calc(100vh-5rem)]">
      <div className="max-w-[77rem] mt-3 w-full flex flex-col gap-5 p-3 text-textPrimary">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Explore some room
        </h2>
        <div className="flex flex-row ">
          <Button>
            <Link href="/create">New Room</Link>
          </Button>
          <Input
            className="focus-visible:ring-0 ml-7"
            placeholder="Search..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between gap-5">
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
          <Roomcard />
        </div>
      </div>
    </div>
  );
}

export default Explore;
