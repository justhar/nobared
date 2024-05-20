import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { google } from "@/lib/auth";
import User from "@/lib/models/user";
import connectMongoDB from "@/lib/db";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.json(
        { error: "Invalid request" },
        {
          status: 400,
        }
      );
    }

    const codeVerifier = cookies().get("codeVerifier")?.value;
    const savedState = cookies().get("state")?.value;

    if (!codeVerifier || !savedState) {
      return NextResponse.json(
        { error: "Code verifier or saved state is not exists" },
        {
          status: 400,
        }
      );
    }

    if (savedState !== state) {
      return NextResponse.json(
        {
          error: "State does not match",
        },
        {
          status: 400,
        }
      );
    }

    const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
      await google.validateAuthorizationCode(code, codeVerifier);

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      }
    );

    const googleData = (await googleRes.json()) as GoogleUser;
    await connectMongoDB();
    const user = await User.findOne({ email: googleData.email });
    if (!user) {
      try {
        await User.create({
          _id: googleData.id,
          email: googleData.email,
          picture: googleData.picture,
          username: googleData.name,
        });
      } catch (err) {
        console.log(err);
      }
    }

    const session = await lucia.createSession(googleData.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    cookies().set("state", "", {
      expires: new Date(0),
    });
    cookies().set("codeVerifier", "", {
      expires: new Date(0),
    });

    const cb = cookies().get("cb")?.value;

    if (cb) {
      return NextResponse.redirect(
        new URL(`/room?id=${cb}`, process.env.NEXT_PUBLIC_BASE_URL),
        {
          status: 302,
        }
      );
    } else {
      return NextResponse.redirect(
        new URL(`/explore`, process.env.NEXT_PUBLIC_BASE_URL),
        {
          status: 302,
        }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
};
