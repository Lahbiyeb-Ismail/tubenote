"use client";

import { useVideo } from "@/context/useVideo";

import EditorPage from "@/components/editor/EditorPage";

function Editor() {
  const {
    state: { video },
  } = useVideo();

  return <EditorPage videoId={video?.youtubeId as string} />;
}

export default Editor;
