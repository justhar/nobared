"use client";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "@/lib/providers/Sessions.provider";
import { createRoom, getRoomId } from "@/lib/actions/room.actions";
import { z } from "zod";
import { redirect, useRouter } from "next/navigation";

const FormSchema = z.object({
  roomname: z
    .string()
    .min(2, {
      message: "room name must be at least 2 chars",
    })
    .max(13, {
      message: "room name cannot be more than 13 chars",
    }),
  desc: z.string(),
});

function RoomForm() {
  const { user } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomname: "",
      desc: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    await createRoom(
      user?.id,
      data.roomname,
      data.desc,
      user?.picture,
      user?.username
    );

    if (await getRoomId(user?.id)) {
      router.push("/room?id=" + user?.id, { shallow: true } as any);
      // router.push('/about', undefined, { shallow: true })
    }
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:w-2/3 space-y-6 focus-visible:ring-0"
      >
        <FormField
          control={form.control}
          name="roomname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room name *</FormLabel>
              <FormControl>
                <Input
                  className="focus-visible:ring-0"
                  placeholder="Enter room name"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your public room name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  className="focus-visible:ring-0 resize-none"
                  placeholder="Tell everyone about your room"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create room"}
        </Button>
      </form>
    </Form>
  );
}

export default RoomForm;
