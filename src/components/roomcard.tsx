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

function Roomcard() {
  return (
    <Card>
      <CardHeader>
        <div className="justify-between flex flex-row">
          <CardTitle>haroki's room </CardTitle>
        </div>
        <CardDescription>
          bolabalinggodolananbolabali wes kapusan
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex flex-row w-full justify-between">
          <AvatarStack
            maxAvatarsAmount={2}
            avatars={[
              "https://github.com/shadcn.png",
              "https://github.com/shadcn.png",
              "https://github.com/shadcn.png",
            ]}
          />
          <Button>Join!</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Roomcard;
