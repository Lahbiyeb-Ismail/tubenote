"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractVideoId } from "@/helpers";

import { Form } from "./ui";

const youtubeUrlSchema = z.object({
  youtubeUrl: z.string()
    .url("Please enter a valid URL")
    .refine(
      url => /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]{11}/.test(url),
      { message: "Please enter a valid YouTube URL" },
    ),
});

export function YoutubeUrlForm() {
  const form = useForm({
    resolver: zodResolver(youtubeUrlSchema),
    defaultValues: {
      youtubeUrl: "",
    },
  });

  const router = useRouter();

  const handleSubmit = (formData: { youtubeUrl: string }) => {
    const ytVideoId = extractVideoId(formData.youtubeUrl);

    router.push(`/notes/create/${ytVideoId}`);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="youtube-url" className="text-sm font-medium">
            YouTube Video URL
          </Label>
          <Input
            id="youtube-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            {...form.register("youtubeUrl")}
            className="text-base py-3"
          />
          {form.formState.errors.youtubeUrl && (
            <div className="flex items-center space-x-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{form.formState.errors.youtubeUrl.message}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 text-lg font-medium"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Taking Notes
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </form>
    </Form>
  );
}
