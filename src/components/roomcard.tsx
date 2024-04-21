import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Button } from "./ui/button";
import Link from "next/link";

// interface Rooms {
//   _id: number;
//   name: string;
//   desc: string;
//   __v: number;
// }

function Roomcard(rooms: any) {
  console.log(rooms.rooms.user.map((name: any) => name));
  return (
    <Card key={rooms.rooms.id}>
      <CardHeader>
        <div className="justify-between flex flex-row">
          <CardTitle>{rooms.rooms.name}</CardTitle>
        </div>
        <CardDescription>{rooms.rooms.desc}</CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex flex-row w-full justify-between">
          <AvatarStack
            maxAvatarsAmount={2}
            // avatars={[
            //   "https://lh3.googleusercontent.com/a/ACg8ocKtAfBlHs2s6zeANJXQvELzn9OhZILH65prLlp6hF3R7Tmzj2k=s96-c",
            //   "https://lh3.googleusercontent.com/a/ACg8ocKtAfBlHs2s6zeANJXQvELzn9OhZILH65prLlp6hF3R7Tmzj2k=s96-c",
            // ]}
            avatars={rooms.rooms.user.map((name: any) => name.pp.toString())}
          />
          <Button>
            <Link href={`/room?id=${rooms.rooms.id}`}>Join!</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Roomcard;
