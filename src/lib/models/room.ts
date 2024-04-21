import mongoose from "mongoose";
import { date } from "zod";

interface Room {
  id: string;
  name: string;
  desc: string;
  user: [];
  message: [];
}

const RoomSchema = new mongoose.Schema<Room>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    user: [{ name: String, pp: String }],
    message: [
      {
        sender: String,
        pp: String,
        text: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models?.Room ||
  mongoose.model<Room>("Room", RoomSchema);
