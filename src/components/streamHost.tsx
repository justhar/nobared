"use client";
import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { pickVideo, unsetVideo } from "@/lib/actions/room.actions";
import { pusherClient } from "@/lib/pusher";
import ReactPlayer from "react-player";
import { ArrowLeft } from "lucide-react";

// TODO: SYNC THE VID AND AUIDO, USE THIS FOR REF https://www.blackbox.ai/chat/oj6f7xx

function Host(props: any) {
  const [video, setVideo] = useState<string>(props.room.video || "");
  const [audio, setAudio] = useState<string>(props.room.audio || "");
  const [input, setInput] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<ReactPlayer>(null);
  const audioInput = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio(audio) : undefined
  );
  // const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    pusherClient.subscribe(`video_${props.roomId}`);

    pusherClient.bind("video", function (data: any) {
      // console.log(data);
    });

    return () => {
      pusherClient.unsubscribe(`video_${props.roomId}`);
      pusherClient.unbind_all();
    };
  }, []);

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
    console.log("playing");
    if (audioInput.current && videoRef.current) {
      audioInput.current.currentTime = videoRef.current.getCurrentTime();
    }
    // console.log(videoRef.current?.getCurrentTime());
    // console.log(audioInput.current?.currentTime);
  }

  function pauseHandler() {
    audioInput.current?.pause();
  }

  function progressHandler(e: any) {
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
  }

  function bufferHandler() {
    if (audioInput.current && videoRef.current) {
      audioInput.current.currentTime = videoRef.current.getCurrentTime();
    }
    console.log("buffering");
  }

  return (
    <div
      className={cn("w-full h-full md:col-span-2 bg-secondary rounded-xl", {
        "aspect-video": (video !== "" && audio !== "") || results.length === 0,
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
                <Button type="submit" onClick={searchHandler} className="ml-4">
                  search
                </Button>
              </div>
            </div>
            <div className="m-2 ">
              <div className="grid flex-col sm:grid-cols-2 xl:grid-cols-3 gap-8 ">
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
                    <div>bla bla skeleton</div>
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
                  height="100%"
                  onBuffer={bufferHandler}
                  onPlay={playHandler}
                  onPause={pauseHandler}
                  onSeek={bufferHandler}
                  onProgress={(e: any) => progressHandler(e)}
                  className="rounded-xl relative"
                />
                <Button
                  onClick={() => alert("Hi!")}
                  className={`absolute top-0 left-0  bg-transparent hover:bg-transparent`}
                >
                  <ArrowLeft className="text-white size-3.5" />
                </Button>
                <audio src={audio} ref={audioRef}></audio>
                <div className="flex-row flex">
                  <Button
                    onClick={() => {
                      setVideo("");
                      setAudio("");
                      setLoading(false);
                      unsetVideo(props.roomId);
                    }}
                  >
                    unset
                  </Button>
                  <Button onClick={() => setAudioPlaying(true)}>audio</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col m-10">
                <p className="text-center">
                  your streaming session is expired, click the button to search
                  again.
                </p>
                <Button
                  onClick={() => {
                    setExpired(false);
                    setVideo("");
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
  );
}
export default Host;
