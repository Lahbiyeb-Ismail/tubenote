"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

import { useNote } from "@/context/useNote";
import { useVideo } from "@/context/useVideo";
import extractVideoId from "@/helpers/extractVideoId";
import { videoFormSchema } from "@/lib/schemas";
import type { VideoUrl } from "@/types/note.types";
import { useRouter } from "next/navigation";

function AddNoteForm() {
  const router = useRouter();

  const form = useForm<VideoUrl>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  // const { isLoading, saveVideo } = useVideo();
  // const { clearNoteState } = useNote();

  const handleAddNote = async (formData: VideoUrl) => {
    const videoId = extractVideoId(formData.videoUrl);

    router.push(`/notes/add/${videoId}`);
  };

  return (
    <Form {...form}>
      <form
        className="w-full max-w-md"
        onSubmit={form.handleSubmit(handleAddNote)}
      >
        <div
          className={`flex items-center justify-between border-b border-[#171215] py-2 ${
            form.formState.errors.videoUrl
              ? "border-red-500"
              : "border-[#171215]"
          }`}
        >
          <FormField
            name="videoUrl"
            render={({ field }) => (
              <FormItem className="flex-grow mr-2">
                <FormControl>
                  <Input
                    {...field}
                    id="videoUrl"
                    type="text"
                    placeholder="Enter YouTube video URL"
                    className={`w-full appearance-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none ${
                      form.formState.errors.videoUrl
                        ? "border-red-500 focus:border-red-500"
                        : "border-transparent"
                    }`}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <button
            className="flex-shrink-0 rounded border-4 border-[#171215] bg-[#171215] px-2 py-1 text-sm text-white hover:border-[#2c2326] hover:bg-[#2c2326]"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Add New Note
          </button>
        </div>
      </form>
    </Form>
  );
}

export default AddNoteForm;
