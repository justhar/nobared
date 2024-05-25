"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Profile from "./profile";
import { useSession } from "@/lib/providers/Sessions.provider";
import { useRouter } from "next/navigation";

function Navbar() {
  const route = useRouter();
  const { user } = useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Link href="/">nobared</Link>
          </div>
          <div className="flex items-center justify-end gap-5">
            {/* desktop nav */}
            <div className="hidden items-center sm:flex space-x-7">
              <Link
                href="/explore"
                className="transition-colors text-foreground/60 hover:text-foreground/95"
              >
                explore
              </Link>
            </div>
            {user ? (
              <div className="flex items-center space-x-7">
                <Profile user={user} />
              </div>
            ) : (
              <div className="flex items-center space-x-7">
                <Button onClick={() => route.push("/signin")}>
                  <p>join us!</p>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
