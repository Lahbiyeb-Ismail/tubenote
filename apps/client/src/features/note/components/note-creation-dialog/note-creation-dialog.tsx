"use client";

import type { Video } from "@tubenote/db";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useGetUserVideosQuery } from "@/features/video/queries";
import { extractVideoId } from "@/helpers";
import { useDialogStore } from "@/stores";
import { validateYouTubeUrl } from "@/utils";

import { NoteCreationDialogFooter } from "./note-creation-dialog-footer";
import { NoteCreationDialogHeader } from "./note-creation-dialog-header";
import { NoteCreationDialogOptions } from "./note-creation-dialog-options";
import { NoteCreationDialogUrlInput } from "./note-creation-dialog-url-input";
import { NoteCreationDialogVideoSelection } from "./note-creation-dialog-video-slelection";

export function NoteCreationDialog() {
  const [option, setOption] = useState<"new" | "existing">("new");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [urlError, setUrlError] = useState("");

  const { type, isOpen, closeDialog } = useDialogStore();

  const isCreateNoteDialogOpen = isOpen && type === "create-note";

  const router = useRouter();

  const { data: videosResponse } = useGetUserVideosQuery({
    page: 1,
    limit: 8,
    sortBy: "createdAt",
    order: "desc",
  });

  const handleUrlChange = (value: string) => {
    setYoutubeUrl(value);
    if (value && !validateYouTubeUrl(value)) {
      setUrlError("Please enter a valid YouTube URL");
    }
    else {
      setUrlError("");
    }
  };

  const handleSubmit = () => {
    if (option === "new") {
      const videoId = extractVideoId(youtubeUrl);

      if (!videoId) {
        setUrlError("Please enter a valid YouTube URL");
        return;
      }

      router.push(`/notes/create/${videoId}`);
    }
    else {
      if (!selectedVideoId) {
        return;
      }

      router.push(`/notes/create/${selectedVideoId}`);
    }

    // Reset form
    setYoutubeUrl("");
    setSelectedVideoId("");
    setUrlError("");
    setOption("new");
    closeDialog();
  };

  const handleCancel = () => {
    setYoutubeUrl("");
    setSelectedVideoId("");
    setUrlError("");
    setOption("new");
    closeDialog();
  };

  const isSubmitDisabled = () => {
    if (option === "new") {
      return !youtubeUrl || !!urlError;
    }
    return !selectedVideoId;
  };

  return (
    <Dialog open={isCreateNoteDialogOpen} onOpenChange={open => !open && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        <NoteCreationDialogHeader />

        <div className="space-y-6">
          {/* Option Selection */}
          <NoteCreationDialogOptions option={option} setOption={setOption} videos={videosResponse?.videos as Video[]} />

          {/* YouTube URL Input */}
          {option === "new" && (
            <NoteCreationDialogUrlInput
              youtubeUrl={youtubeUrl}
              handleUrlChange={handleUrlChange}
              urlError={urlError}
            />
          )}

          {/* Existing Video Selection */}
          {option === "existing" && (
            <NoteCreationDialogVideoSelection
              videos={videosResponse?.videos as Video[]}
              selectedVideoId={selectedVideoId}
              setSelectedVideoId={setSelectedVideoId}
            />
          )}
        </div>

        <NoteCreationDialogFooter handleCancel={handleCancel} handleSubmit={handleSubmit} isSubmitDisabled={isSubmitDisabled} />
      </DialogContent>
    </Dialog>
  );
}
