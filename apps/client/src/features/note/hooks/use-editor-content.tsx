"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";

export function useEditorContent() {
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const getContent = () => {
    return editorRef.current?.getMarkdown() || "";
  };

  return {
    editorRef,
    getContent,
  };
}
