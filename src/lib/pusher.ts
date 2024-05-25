import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1793700",
  key: "c3ef0c2720fe4489bb8c",
  secret: "a2f8842d782d7b5b2185",
  cluster: "ap1"!,
  useTLS: true,
});

export const pusherClient = new PusherClient("c3ef0c2720fe4489bb8c", {
  cluster: "ap1"!,
});
