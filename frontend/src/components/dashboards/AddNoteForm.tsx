"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

import { useVideo } from "@/context/useVideo";
import { videoFormSchema } from "@/lib/schemas";
import type { VideoUrl } from "@/types/note.types";

function AddNoteForm() {
	const form = useForm<VideoUrl>({
		resolver: zodResolver(videoFormSchema),
		defaultValues: {
			videoUrl: "",
		},
	});

	const { isLoading, saveVideo } = useVideo();

	const handleAddNote = async (formData: VideoUrl) =>
		saveVideo(formData.videoUrl);

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
						disabled={isLoading}
					>
						{isLoading ? "Saving Video" : "Take Note"}
					</button>
				</div>
			</form>
		</Form>
	);
}

export default AddNoteForm;
