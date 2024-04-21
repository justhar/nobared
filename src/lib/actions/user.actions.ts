"use server";

// import connectMongoDB from "../db";
import { google } from "@/lib/auth"
import { cookies } from "next/headers"
import { generateCodeVerifier, generateState } from "arctic"

export const createGoogleAuthorizationURL = async () => {
  try {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    })

    cookies().set("state", state, {
      httpOnly: true,
    })

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    )

    return {
      success: true,
      data: authorizationURL,
    }
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}
// import { User } from "../models/user";

// interface Params {
//     username: string;
//     email: string;
//   }

// export async function updateUser({
//     username, email
//   }: Params): Promise<void> {
//     try {
//       connectMongoDB();
  
//       await User.updateOne(
//         { email },
//         { $set: { name: username, age: 30 } }
//       );
//     } catch (error: any) {
//       throw new Error(`Failed to update user: ${error.message}`);
//     }
//   }