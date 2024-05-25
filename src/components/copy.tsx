"use client";
import React from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { ClipboardType } from "lucide-react";

export default function Copy(props: any) {
  return (
    <Button
      onClick={(e) => {
        navigator.clipboard.writeText(
          `https://nobared.vercel.app/room?id=${props.room}`
        );
        toast({
          title: "share it!",
          description: "the link is copied to your clipboard",
        });
      }}
    >
      share <ClipboardType className="ml-1 size-3.5" />
    </Button>
  );
}
