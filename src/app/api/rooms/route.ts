import { getRooms } from "@/lib/actions/room.actions";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const roomData = await getRooms();
  return new Response(JSON.stringify(roomData), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
