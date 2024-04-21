"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Image } from "next/dist/client/image-component";
import { toast } from "@/components/ui/use-toast";
import { createGoogleAuthorizationURL } from "@/lib/actions/user.actions";
import { useSession } from "@/lib/providers/Sessions.provider";
import { redirect } from "next/navigation";

function Signin() {
  const { user } = useSession();
  if (user) {
    redirect("/explore");
  }
  const handleClick = async () => {
    const res = await createGoogleAuthorizationURL();
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      window.location.href = res.data.toString();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <Button variant="outline" className="h-auto" onClick={handleClick}>
        <Image
          src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
          width={20}
          height={20}
          alt="ok"
          className="mr-2"
        />
        Sign in with Google
      </Button>
    </div>
  );
}

export default Signin;
