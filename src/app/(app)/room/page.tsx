"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import RoomInside from "@/components/room";

function Room() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = searchParams.get("id");
  return (
    <>{!params ? router.push("/explore") : <RoomInside roomname={params} />}</>
  );
}

export default Room;
