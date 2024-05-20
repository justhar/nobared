"use client";

import { pusherClient } from "@/lib/pusher";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const ReactPlayer: any = dynamic(() => import("react-player"), { ssr: false });

function View(props: any) {
  const [video, setVideo] = useState<string>(props.room.video || "unset");
  const [audio, setAudio] = useState<string>(props.room.audio || "unset");
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    pusherClient.subscribe(`video_${props.roomId}`);

    pusherClient.bind("video", function (data: any) {
      if (data.video === "unset") {
        setVideo("unset");
        setAudio("unset");
      } else {
        setVideo(data.video);
        setAudio(data.audio);
      }
    });

    return () => {
      pusherClient.unsubscribe(`video_${props.roomId}`);
      pusherClient.unbind_all();
    };
  }, []);

  return (
    <>
      <div className="w-full md:col-span-2 bg-destructive rounded-xl aspect-video">
        <div className="flex justify-center items-center h-full w-full">
          {video === "unset" && audio === "unset" ? (
            <>
              {!expired ? (
                <ReactPlayer
                  url={video}
                  onError={() => setExpired(true)}
                  width="100%"
                  height="100%"
                  controls
                />
              ) : (
                <p className="text-center m-10">
                  this video streaming session is expired, u must tell the owner
                  of this room to refresh the session.
                </p>
              )}
            </>
          ) : (
            <div className="m-10">
              <p>
                its either{" "}
                <span className="text-purple-500">
                  {props.room.user[0].name}{" "}
                </span>
                (the owner of this room) is still searching for a video to watch
                or he/she is currently not online.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default View;
