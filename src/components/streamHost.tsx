"use client";
import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  deleteRoom,
  pickVideo,
  sendStreamStat,
  unsetVideo,
} from "@/lib/actions/room.actions";
import { pusherClient } from "@/lib/pusher";
import ReactPlayer from "react-player";
import { syncRoom } from "@/lib/actions/room.actions";
import { ArrowLeft, CornerUpLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

//TODO: UNSET AND REALTIME.
//TODO: PAUSE/UNSET THE AUDIO WHEN ITS GO SEARCH

function Host(props: any) {
  const route = useRouter();

  const [video, setVideo] = useState<string>(props.room.video || "");
  const [audio, setAudio] = useState<string>(props.room.audio || "");
  const [input, setInput] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [play, setPlay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<ReactPlayer>(null);
  const audioInput = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio(audio) : undefined
  );

  // TODO: LOADING!! (NOT ONLY THIS, ALL OF THE LOADING SHIT)
  function searchHandler() {
    if (!input.trim() || input === "") {
      setResults([]);
    } else {
      // Set loading state to true
      setLoading(true);

      fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      })
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          // Set loading state to false after data is fetched
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          // Set loading state to false in case of an error
          setLoading(false);
        });
    }
  }

  function expiredHandler() {
    setExpired(true);
  }

  async function pickHandler(index: number) {
    setLoading(true);
    setResults([]);
    const { video, audio } = await pickVideo(results[index].id, props.roomId);
    setAudio(audio);
    if (audioInput.current) {
      audioInput.current.src = audio;
    }
    setVideo(video);
    setLoading(false);
  }

  function playHandler() {
    audioInput.current?.play();
    // console.log("playing");
    setPlay(true);
    // console.log(play);
    if (audioInput.current && videoRef.current) {
      audioInput.current.currentTime = videoRef.current.getCurrentTime();
    }
    syncRoom(props.roomId, "play", videoRef.current?.getCurrentTime());
  }

  function pauseHandler() {
    setPlay(false);
    audioInput.current?.pause();
    syncRoom(props.roomId, "pause", videoRef.current?.getCurrentTime());
  }

  function progressHandler() {
    // console.log(audioInput.current?.currentTime);
    // console.log(videoRef.current?.getCurrentTime());
    if (audioInput.current && videoRef.current) {
      if (
        audioInput.current.currentTime - videoRef.current.getCurrentTime() >
        0.4
      ) {
        audioInput.current.currentTime = videoRef.current.getCurrentTime();
      }
    }
    console.log("play", videoRef.current?.props.playing);
  }

  function bufferHandler() {
    if (audioInput.current && videoRef.current) {
      audioInput.current.currentTime = videoRef.current.getCurrentTime();
    }
    console.log("buffering");
    syncRoom(props.roomId, "seek", videoRef.current?.getCurrentTime());
  }
  useEffect(() => {
    pusherClient.subscribe(`chat_${props.chatId}`);
    pusherClient.bind(
      "connection",
      function (data: any) {
        data.type === "join" &&
          setTimeout(() => {
            sendStreamStat(
              videoRef.current?.props.playing,
              videoRef.current?.getCurrentTime(),
              props.roomId
            );
          }, 3000);
        console.log(data, videoRef.current?.props.playing);
      },
      3000
    );
    return () => {
      pusherClient.unsubscribe(`chat_${props.roomId}`);
      pusherClient.unbind_all();
    };
  }, []);

  return (
    <>
      <div className="flex justify-between mb-3">
        <p className="my-auto pb-3">room {props.room.name}</p>
        <Button
          variant={"destructive"}
          onClick={() => {
            pusherClient.unbind_all();
            pusherClient.unsubscribe(`chat_${props.roomId}`);
            pusherClient.unsubscribe(`video_${props.roomId}`);
            audioInput.current?.pause();
            console.log("delete");
            deleteRoom(props.roomId);
            route.replace("/explore");
            // videoRef.current?.getInternalPlayer().current.pause();
          }}
        >
          <span className="mr-1 max-sm:hidden">delete</span>
          <CornerUpLeft className="size-3.5" />
        </Button>
      </div>
      <div
        className={cn("w-full h-full md:col-span-2 bg-secondary rounded-xl", {
          "aspect-video":
            (video !== "" && audio !== "") || results.length === 0,
        })}
      >
        <div className="flex justify-center items-center h-full w-full">
          {video === "" ? (
            <div
              className={cn("w-full flex-col", {
                "justify-center items-center h-full": results[0],
              })}
            >
              <div className="flex-col text-center items-center justify-center mb-4">
                <h4 className="font-semibold tracking-tight transition-colors m-5">
                  search yt
                </h4>
                <div className="flex-row flex justify-center">
                  <Input
                    type="search"
                    className="w-1/3 max-sm:w-1/2"
                    placeholder="video alsipan"
                    value={input}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        e.preventDefault();
                        searchHandler();
                      }
                    }}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button
                    type="submit"
                    onClick={searchHandler}
                    className="ml-4"
                    disabled={loading}
                  >
                    search
                  </Button>
                </div>
              </div>
              <div className="m-2 ">
                <div
                  className={cn(" gap-8", {
                    "grid flex-col sm:grid-cols-2 xl:grid-cols-3": !loading,
                    "flex justify-center": loading,
                  })}
                >
                  {results ? (
                    !loading ? (
                      results.map((data, index) => {
                        return (
                          <Card
                            onClick={(e) => pickHandler(index)}
                            key={index}
                            className="w-full h-full relative cursor-pointer"
                          >
                            <div className="relative inline-block">
                              <p className="absolute bottom-0 left-0 bg-black text-white text-xs ml-1 mb-1 p-1 rounded-md">
                                {data.length_text}
                              </p>
                              <Image
                                src={data.thumbnail}
                                alt="hey"
                                width={1000}
                                height={1000}
                                className="rounded-md"
                              />
                            </div>
                            <div className="mt-2 m-2">
                              <p>{data.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {data.author}
                              </p>
                            </div>
                          </Card>
                        );
                      })
                    ) : (
                      <p className="text-center m-10">loading...</p>
                    )
                  ) : (
                    <p> no result</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {!expired ? (
                <div className="w-full h-full aspect-video rounded-xl relative">
                  {/* <p className="bg-transparent relative m-auto">search</p> */}
                  <ReactPlayer
                    url={video}
                    ref={videoRef}
                    controls
                    onError={expiredHandler}
                    width="100%"
                    playing={play}
                    height="100%"
                    muted
                    onBuffer={bufferHandler}
                    onPlay={playHandler}
                    onPause={pauseHandler}
                    onSeek={bufferHandler}
                    onProgress={progressHandler}
                    className="rounded-xl relative"
                  />
                  <Button
                    onClick={() => {
                      setVideo("");
                      setAudio("");
                      setLoading(false);
                      unsetVideo(props.roomId);
                      audioInput.current?.pause();
                    }}
                    className={`absolute top-0 left-0  bg-transparent hover:bg-transparent`}
                  >
                    <ArrowLeft className="text-white size-3.5" />
                  </Button>
                  <audio src={audio} ref={audioRef}></audio>
                  <div className="flex-row flex"></div>
                </div>
              ) : (
                <div className="flex flex-col m-10">
                  <p className="text-center">
                    your streaming session is expired, click the button to
                    search again.
                  </p>
                  <Button
                    onClick={() => {
                      setExpired(false);
                      setVideo("");
                      unsetVideo(props.roomId);
                      setAudio("");
                    }}
                    className="mt-3"
                  >
                    search
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default Host;
