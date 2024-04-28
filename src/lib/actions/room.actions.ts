"use server";

import connectMongoDB from "../db";
import Room from "../models/room";
import { pusherServer } from "../pusher";

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
// export const getRoom = async (id: string | undefined) => {
//     await connectMongoDB()
//     return JSON.parse(JSON.stringify(await Room.findOne({id: id})))
// }

export const getRooms = async () => {
  await connectMongoDB();
  return await Room.find();
};

// TODO: delete the video too
export const deleteRoom = async (id: string) => {
  await connectMongoDB();
  const result = await Room.deleteOne({ id: id });
  await pusherServer.trigger(`chat_${id}`, "status", { status: "deleted" });
  return result;
};

export const sendMessage = async (
  id: string,
  sender: string | undefined,
  pp: string | undefined,
  text: string
) => {
  await connectMongoDB();
  await Room.updateOne({ id }, { $push: { message: [{ sender, pp, text }] } });
  await pusherServer.trigger(`chat_${id}`, "message", {
    sender,
    pp,
    text,
    date: Date.now(),
  });
};

export const connectRoom = async (id: string, name: string, pp: string) => {
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
      name,
      type: "join",
    });
  }
};

export const leaveRoom = async (id: string, name: string | undefined) => {
  await connectMongoDB();
  await Room.updateOne({ id }, { $pull: { user: { name } } });
  await Room.updateOne(
    { id },
    { $push: { message: [{ sender: name, type: "leave" }] } }
  );

  await pusherServer.trigger(`chat_${id}`, "connection", {
    name,
    type: "leave",
  });
};
