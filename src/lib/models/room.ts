import mongoose from "mongoose";

interface Room {
    id: string;
    name: string;
    desc: string;
    user: [
      anjya: string
    ];
  }
   
  const RoomShema = new mongoose.Schema<Room>({
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
    user: [{ name: String, pp: String }]
  }, {timestamps: true});
   
  export default mongoose.models?.Room || mongoose.model<Room>('Room', RoomShema);