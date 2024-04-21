"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Profile from "./profile";

function Navbar() {
  const session: boolean = true;
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
            {session ? (
              <div className="flex items-center space-x-7">
                <Profile session={session} />
              </div>
            ) : (
              <div className="flex items-center space-x-7">
                <Button>
                  <Link href="/signin">join us!</Link>
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