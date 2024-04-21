import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { lucia } from "@/lib/auth"
import { google } from "@/lib/auth"
import  User  from "@/lib/models/user"
import connectMongoDB from "@/lib/db"

interface GoogleUser {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    picture: string
    locale: string
  }
  
  export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url)
        const searchParams = url.searchParams
    
        const code = searchParams.get("code")
        const state = searchParams.get("state")
    
        if (!code || !state) {
          return NextResponse.json(
            { error: "Invalid request" },
            {
              status: 400,
            }
          )
        }
    
        const codeVerifier = cookies().get("codeVerifier")?.value
        const savedState = cookies().get("state")?.value
    
        console.log({ codeVerifier, savedState, state })
    
        if (!codeVerifier || !savedState) {
          return NextResponse.json(
            { error: "Code verifier or saved state is not exists" },
            {
              status: 400,
            }
          )
        }
    
        if (savedState !== state) {
          return NextResponse.json(
            {
              error: "State does not match",
            },
            {
              status: 400,
            }
          )
        }
    
        const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
          await google.validateAuthorizationCode(code, codeVerifier)
    
        const googleRes = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            method: "GET",
          }
        )
        console.log({ accessToken, idToken, accessTokenExpiresAt, refreshToken })
    
        const googleData = (await googleRes.json()) as GoogleUser
    
        console.log("google data", googleData)

        //connectdb
        await connectMongoDB();
        const user = await User.findOne({ email: googleData.email })
        if (!user) {
          try {          
            await User.create({ 
            _id: googleData.id,
            user_id: googleData.id,
            userId: googleData.id,
            id: googleData.id,
            email: googleData.email,
            picture: googleData.picture,
            username: googleData.name,
          })
        } catch (err) 
        {console.log(err)}
        } else {
            console.log("update user")
        }
        // await db.transaction(async (trx) => {
        //   const user = await trx.query.userTable.findFirst({
        //     where: eq(userTable.id, googleData.id),
        //   })
        //   console.debug("User", user)
        //   let session = null
        //   if (!user) {
        //     console.log("Creating user", user)
    
        //     const createdUserRes = await trx
        //       .insert(userTable)
        //       .values({
        //         email: googleData.email,
        //         id: googleData.id,
        //         name: googleData.name,
        //         profilePictureUrl: googleData.picture,
        //       })
        //       .returning({
        //         id: userTable.id,
        //       })
    
        //     if (createdUserRes.length === 0) {
        //       trx.rollback()
        //       return Response.json(
        //         { error: "Failed to create user" },
        //         {
        //           status: 500,
        //         }
        //       )
        //     }
    
        //     const createdOAuthAccountRes = await trx
        //       .insert(oauthAccountTable)
        //       .values({
        //         accessToken,
        //         expiresAt: accessTokenExpiresAt,
        //         id: googleData.id,
        //         provider: "google",
        //         providerUserId: googleData.id,
        //         userId: googleData.id,
        //         refreshToken,
        //       })
    
        //     if (createdOAuthAccountRes.rowCount === 0) {
        //       trx.rollback()
        //       return NextResponse.json(
        //         { error: "Failed to create OAuthAccountRes" },
        //         {
        //           status: 500,
        //         }
        //       )
        //     }
        //   } else {
        //     const updatedOAuthAccountRes = await trx
        //       .update(oauthAccountTable)
        //       .set({
        //         accessToken,
        //         expiresAt: accessTokenExpiresAt,
        //         refreshToken,
        //       })
        //       .where(eq(oauthAccountTable.id, googleData.id))
    
        //     if (updatedOAuthAccountRes.rowCount === 0) {
        //       trx.rollback()
        //       return Response.json(
        //         { error: "Failed to update OAuthAccountRes" },
        //         {
        //           status: 500,
        //         }
        //       )
        //     }
        //   }
    
        //   return NextResponse.redirect(
        //     new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL),
        //     {
        //       status: 302,
        //     }
        //   )
        // })
    
        const session = await lucia.createSession(googleData.id, {
          expiresIn: 60 * 60 * 24 * 30,
        })
        const sessionCookie = lucia.createSessionCookie(session.id)

        console.log("create session", session)
        console.log("session cookie", sessionCookie)
    
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
    
        cookies().set("state", "", {
          expires: new Date(0),
        })
        cookies().set("codeVerifier", "", {
          expires: new Date(0),
        })
    
        return NextResponse.redirect(
          new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
          {
            status: 302,
          }
        )
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message },
          {
            status: 500,
          }
        )
      }
  }