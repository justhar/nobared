import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

// interface Rooms {
//   _id: number;
//   name: string;
//   desc: string;
//   __v: number;
// }

function Roomcard(rooms: any) {
  const router = useRouter();
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
            avatars={rooms.rooms.user.map((name: any) => name.pp.toString())}
          />
          <Button onClick={() => router.push(`/room?id=${rooms.rooms.id}`)}>
            <p>Join!</p>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Roomcard;
