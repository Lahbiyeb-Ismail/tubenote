"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface EditorPositionStore {
  editorPosition: "left" | "right";
  toggleEditorPosition: () => void;
}

export const useEditorPositionStore = create<EditorPositionStore>()(
  immer(set => ({
    editorPosition: "left",
    toggleEditorPosition: () => {
      set(state => ({
        editorPosition: state.editorPosition === "left" ? "right" : "left",
      }));
    },
  })),
);
