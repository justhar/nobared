"use server";

import connectMongoDB from "../db";
import Room from "../models/room";
import { pusherServer } from "../pusher";
import ytstream from "yt-stream";
import ytdl from "ytdl-core";

export const createRoom = async (
  id: string | undefined,
  roomname: string | undefined,
  desc: string,
  pp: string | undefined,
  name: string | undefined
) => {
  await connectMongoDB();
  if (await getRoomId(id)) {
    return 400;
  } else {
    await Room.create({
      id,
      name: roomname,
      desc,
      user: [
        {
          name,
          pp,
        },
      ],
    });
  }
};

export const getRoomId = async (id: string | undefined) => {
  await connectMongoDB();
  return JSON.parse(JSON.stringify(await Room.findOne({ id: id })));
};

export const getRooms = async () => {
  await connectMongoDB();
  return await Room.find();
};

export const deleteRoom = async (id: string) => {
  await connectMongoDB();
  const result = await Room.deleteOne({ id: id });
  await pusherServer.trigger(`chat_${id}`, "status", { status: "deleted" });
};

export const sendMessage = async (
  id: string,
  userId: string | undefined,
  sender: string | undefined,
  pp: string | undefined,
  text: string
) => {
  await connectMongoDB();
  await Room.updateOne(
    { id },
    { $push: { message: { sender, id: userId, pp, text } } }
  );
  await pusherServer.trigger(`chat_${id}`, "message", {
    sender,
    id: userId,
    pp,
    text,
    date: Date.now(),
  });
};

export const searchVid = async (input: string) => {
  return await ytstream.search(input);
};

export const sendStreamStat = async (
  stat: boolean | undefined,
  seek: number | undefined,
  roomId: string
) => {
  await pusherServer.trigger(`video_${roomId}`, "stream", {
    type: "newuser",
    seek,
    stat,
  });
};

export const pickVideo = async (videoId: string, roomId: string) => {
  const info = await ytdl.getInfo(videoId);

  const audio = ytdl.chooseFormat(info.formats, {
    quality: "lowestaudio",
    filter: "audioonly",
  });
  let video;
  try {
    console.log("its 135");
    video = ytdl.chooseFormat(info.formats, {
      quality: "135",
    });
  } catch {
    console.log("its highest");
    video = ytdl.chooseFormat(info.formats, {
      quality: "highestvideo",
      filter: "videoonly",
    });
  }

  await connectMongoDB();
  await Room.updateOne(
    { id: roomId },
    { $set: { video: video.url, audio: audio.url } }
  );
  await pusherServer.trigger(`video_${roomId}`, "video", {
    video: video.url,
    audio: audio.url,
  });
  return { audio: audio.url, video: video.url };
};

export const unsetVideo = async (id: string) => {
  await Room.updateOne({ id }, { $unset: { video: 1, audio: 1 } });
  await pusherServer.trigger(`video_${id}`, "video", {
    video: "unset",
    audio: "unset",
  });
};

export const syncRoom = async (
  id: string,
  type: string,
  seek: number | undefined
) => {
  switch (type) {
    case "play":
      await pusherServer.trigger(`video_${id}`, "stream", {
        type,
        seek,
      });
      break;
    case "pause":
      await pusherServer.trigger(`video_${id}`, "stream", {
        type,
        seek,
      });
      break;
    case "seek":
      await pusherServer.trigger(`video_${id}`, "stream", {
        type,
        seek,
      });
  }
};

export const connectRoom = async (
  id: string,
  name: string | undefined,
  pp: string | undefined
) => {
  await connectMongoDB();
  if (await Room.findOne({ id, "user.name": name })) {
    return 0;
  } else {
    await Room.updateOne({ id }, { $push: { user: [{ name, pp }] } });
    await Room.updateOne(
      { id },
      { $push: { message: [{ sender: name, type: "join" }] } }
    );
    await pusherServer.trigger(`chat_${id}`, "connection", {
      sender: name,
      type: "join",
      pp: pp,
    });
  }
};

export const leaveRoom = async (id: string, name: string | undefined) => {
  await connectMongoDB();
  await Room.updateOne(
    { id, "user.name": name },
    { $pull: { user: { name } } }
  );
  await Room.updateOne(
    { id },
    { $push: { message: [{ sender: name, type: "leave" }] } }
  );

  await pusherServer.trigger(`chat_${id}`, "connection", {
    sender: name,
    type: "leave",
  });
};
