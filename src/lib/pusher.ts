import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: "1782321",
  key: "daf1c6be948cb33df561",
  secret: "a6a7b4f65e55beae1d29",
  cluster: "ap1",
  useTLS: true,
});

export const pusherClient = new PusherClient("daf1c6be948cb33df561", {
    cluster: "ap1"
})

// export const pusherServer = new PusherServer({
//   appId: "1718686",
//   key: "56236ec0fa30b0d11a08",
//   secret: "83a5edf50b88fe9c9772",
//   cluster: "sa1"!,
//   useTLS: true,
// });

// export const pusherClient = new PusherClient(
//   "56236ec0fa30b0d11a08",
//   {
//     cluster: "sa1"!,
//   }
// );