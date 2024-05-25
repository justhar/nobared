"use client";

import { pusherClient } from "@/lib/pusher";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";
import { CornerUpLeft, Fullscreen } from "lucide-react";
import screenfull from "screenfull";
import { connectRoom, leaveRoom } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/providers/Sessions.provider";

function View(props: any) {
  const [video, setVideo] = useState<string>(props.room.video || "");
  const [audio, setAudio] = useState<string>(props.room.audio || "");
  const { user } = useSession();
  // const [hasWindow, setHasWindow] = useState<boolean>(false);
  const route = useRouter();
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [expired, setExpired] = useState<boolean>(false);
  const [gone, setGone] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<ReactPlayer>(null);
  const audioInput = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio(audio) : undefined
  );

  useEffect(() => {
    connectRoom(props.roomId, user?.username, user?.picture);
    // setHasWindow(true);
    pusherClient.subscribe(`video_${props.roomId}`);

    pusherClient.bind("video", function (data: any) {
      if (data.video === "unset") {
        setVideo("");
        setAudio("");
        audioInput.current && audioInput.current.pause();
        setVideoPlaying(false);
      } else {
        setVideo(data.video);
        setAudio(data.audio);
        console.log("data", data.audio);
        console.log("Audio", audio);
        if (audioInput.current) {
          audioInput.current.src = data.audio;
          // audio;
        }
      }
    });

    pusherClient.bind("stream", function (data: any) {
      switch (data.type) {
        case "play":
          videoRef.current?.seekTo(data.seek);
          if (audioInput.current) {
            audioInput.current.currentTime = data.seek;
            audioInput.current.play();
          }
          setVideoPlaying(true);
          setExpired(false);
          //TODO: WTH? VIDEOPLAYING FALSE=PLAY?
          break;
        case "pause":
          videoRef.current?.seekTo(data.seek);
          audioInput.current?.pause();
          setVideoPlaying(false);
          setExpired(false);
          break;
        case "seek":
          videoRef.current?.seekTo(data.seek);
          setExpired(false);
          break;
        case "newuser":
          videoRef.current?.seekTo(data.seek);
          setVideoPlaying(data.stat);
          if (audioInput.current && data.seek) {
            audioInput.current.currentTime = data.seek;
          }
          audioInput.current?.play();
          console.log(data);
      }
    });

    return () => {
      pusherClient.unsubscribe(`video_${props.roomId}`);
      pusherClient.unbind_all();
    };
  }, []);

  function progressHandler() {
    if (audioInput.current && videoRef.current) {
      if (
        audioInput.current.currentTime - videoRef.current.getCurrentTime() >
        0.4
      ) {
        audioInput.current.currentTime = videoRef.current.getCurrentTime();
      }
    }
  }

  const handleClickFullscreen = () => {
    if (
      screenfull.isEnabled &&
      videoRef.current &&
      videoRef.current.getInternalPlayer()
    ) {
      const playerElement = videoRef.current.getInternalPlayer() as Element;
      screenfull.request(playerElement);
    }
    console.log(audio);
  };

  function expiredHandler(e: any) {
    setExpired(true);
    console.log(e);
  }

  return (
    <>
      <div className="flex justify-between mb-3">
        <p className="my-auto pb-3">room {props.room.name}</p>
        <Button
          variant={"destructive"}
          onClick={() => {
            pusherClient.unsubscribe(`chat_${props.roomId}`);
            pusherClient.unsubscribe(`video_${props.roomId}`);
            pusherClient.unbind_all();
            audioInput.current?.pause();
            leaveRoom(props.roomId, user?.username);
            setVideoPlaying(false);
            audioInput.current?.pause();
            // route.push("/explore");
            // route.("/explore");
            route.push("/explore");
          }}
        >
          <span className="mr-1 max-sm:hidden">leave room</span>
          <CornerUpLeft className="size-3.5" />
        </Button>
      </div>
      <div className="w-full md:col-span-2 bg-destructive rounded-xl aspect-video">
        <div className="flex justify-center items-center h-full w-full">
          {video !== "" && audio !== "" ? (
            <>
              {!expired ? (
                <div className="w-full h-full aspect-video rounded-xl relative">
                  {!gone && (
                    <div className="absolute top-0 left-0 w-full h-full backdrop-filter backdrop-blur-lg"></div>
                  )}
                  <ReactPlayer
                    url={video}
                    ref={videoRef}
                    onProgress={progressHandler}
                    width="100%"
                    height="100%"
                    onError={(e) => expiredHandler(e)}
                    playing={videoPlaying}
                    controls={false}
                    className="view"
                    muted
                  />
                  <audio src={audio} ref={audioRef}></audio>
                  <Button
                    onClick={handleClickFullscreen}
                    className={`absolute bottom-0 right-0  bg-transparent hover:bg-transparent`}
                  >
                    <Fullscreen className="text-white size-3.5" />
                  </Button>
                  <div
                    className={` bottom-0 left-0 text-gray-800 ${
                      videoPlaying ? "hidden" : "absolute"
                    } text-red-200 m-2 rounded-lg`}
                  >
                    <p>paused by host</p>
                  </div>
                  <Button
                    onClick={() => {
                      setGone(true);
                      audioInput.current?.play();
                      if (audioInput.current && videoRef.current) {
                        audioInput.current.currentTime =
                          videoRef.current?.getCurrentTime();
                      }
                    }}
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                      gone
                        ? "hidden"
                        : "bg-transparent hover:bg-transparent text-white"
                    }`}
                  >
                    click me to continue
                  </Button>
                </div>
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
