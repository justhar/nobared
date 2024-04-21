import mongoose from "mongoose";

interface Message {
    sender: number;
    room: number;
    message: string;
    time: TimeRanges;
  }
   
  const MessageSchema = new mongoose.Schema<Message>({
    sender: {
        type: Number,
            required: true,
      },
    room: {
      type: Number,
required: true,
    },
    message: {
      type: String,
      required: true,
    }
  }, {timestamps: true}
  );
   
  export default mongoose.models?.Message || mongoose.model<Message>('Message', MessageSchema);