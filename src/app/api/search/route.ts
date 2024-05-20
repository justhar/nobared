import { searchVid } from "@/lib/actions/room.actions";

export async function POST(req: Request) {
  const requestBody = await req.json();
  const search = await searchVid(requestBody.query);
  return new Response(JSON.stringify(search), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
