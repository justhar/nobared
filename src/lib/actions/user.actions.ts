"use server";

// import connectMongoDB from "../db";
import { google, lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";

export const createGoogleAuthorizationURL = async (cb: string | null) => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    cookies().set("state", state, {
      httpOnly: true,
    });

    cb &&
      cookies().set("cb", cb as string, {
        httpOnly: true,
      });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(authorizationURL)),
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
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
