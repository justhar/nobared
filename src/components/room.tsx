import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CornerDownLeft } from "lucide-react";
type roomname = {
  roomname: string;
};

function RoomInside(roomname: roomname) {
  return (
    <main className="grid min-h-[calc(100vh-5rem)] gap-4 overflow-auto p-4 md:grid-cols-3">
      <div className="md:col-span-2 relative flex-col items-start gap-8 flex bg-red-900">
        <h1>{roomname.roomname}</h1>
      </div>
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 col-span-1">
        <div className="flex-1">away</div>
        <form
          className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          x-chunk="dashboard-03-chunk-1"
        >
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default RoomInside;
