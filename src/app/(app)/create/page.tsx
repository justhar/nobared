"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  roomname: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  desc: z.string(),
});

export default function Create() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomname: "",
      desc: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="flex justify-center min-h-[calc(100vh-5rem)]">
      <div className="max-w-[77rem] md:mt-3 w-full flex flex-col gap-3 p-3 text-textPrimary">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create a new room
        </h1>
        <p className="leading-7 ">
          Create a new room to watch a youtube video together and share it with
          your friends.
        </p>
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
                  <FormDescription>
                    This is your public room name.
                  </FormDescription>
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
            <Button type="submit">Create room</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
