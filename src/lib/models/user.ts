import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
 
interface User {
  _id: string,
  email: string,
  picture: string,
  username: string,
}
 
const UserSchema = new mongoose.Schema<User>({
  _id: {
    type: String,
        required: true,
  },
  email: {
    type: String,
        required: true,
  },
  picture: {
    type: String,
        required: true,
  },
  username: {
    type: String,
        required: true,
  },
  //. . . other fields
});
 
export default mongoose.models.User || mongoose.model<User>('User', UserSchema);
 
//models/session.ts
 
interface Session {
  user_id: string;
  expires_at: Date;
}
 
export const SessionSchema = new mongoose.Schema<Session>({
  user_id: {
    type: String,
    required: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
}, {timestamps: true});
// adapter for lucia
export const adapter = new MongodbAdapter(
  mongoose.connection.collection('sessions'),
  mongoose.connection.collection('users')
);