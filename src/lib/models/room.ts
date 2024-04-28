import mongoose from "mongoose";

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
    user: [
      {
        name: { type: String },
        pp: { type: String },
      },
    ],
    message: [
      {
        sender: { type: String },
        id: { type: String },
        pp: { type: String },
        text: { type: String },
        date: {
          type: Date,
          default: Date.now(),
        },
        type: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models?.Room ||
  mongoose.model<Room>("Room", RoomSchema);
