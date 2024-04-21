import Image from "next/image";
import React from "react";

function Bubbles() {
  return (
    <div>
      <div className={"flex items-end"}>
        <div
          className={
            "flex flex-col space-y-2 text-base max-w-xs mx-2 order-2 items-start"
          }
        >
          <span
            className={
              "px-4 py-2 rounded-lg inline-block bg-gray-200 text-gray-900 max-w-xs overflow-hidden"
            }
            style={{ wordWrap: "break-word" }}
          >
            hey guysqjsdiiiiiiiiiiiiiiiiiasdddddddddddddddasdddddddd
            ddddddddddddiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
            <span className="ml-2 text-xs text-gray-400">
              {/* {formatTimestamp(message.timestamp)} */}
              02.22
            </span>
          </span>
        </div>

        <div className={"relative w-6 h-6"}>
          <Image
            fill
            alt="Profile picture"
            referrerPolicy="no-referrer"
            src={"https://i.pravatar.cc/300"}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 96vw, 600px"
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Bubbles;
