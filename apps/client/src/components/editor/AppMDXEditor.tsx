"use client";

import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  type DirectiveNode,
  type EditorInFocus,
  InsertAdmonition,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  Separator,
  ShowSandpackInfo,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { SaveIcon } from "lucide-react";
import { useRef, useState } from "react";
import "@mdxeditor/editor/style.css";

import { useModal } from "@/context/useModal";
import { Button } from "../ui/button";

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== "directive") {
    return false;
  }

  return ["note", "tip", "danger", "info", "caution"].includes(
    (node as DirectiveNode).getMdastNode().name
  );
}

const MyToolbar = () => {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: (editor) => editor?.editorType === "codeblock",
            contents: () => <ChangeCodeMirrorLanguage />,
          },
          {
            when: (editor) => editor?.editorType === "sandpack",
            contents: () => <ShowSandpackInfo />,
          },
          {
            fallback: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />

                <ConditionalContents
                  options={[
                    {
                      when: whenInAdmonition,
                      contents: () => <ChangeAdmonitionType />,
                    },
                    { fallback: () => <BlockTypeSelect /> },
                  ]}
                />

                <Separator />

                <CreateLink />

                <Separator />

                <InsertTable />
                <InsertThematicBreak />

                <Separator />
                <InsertCodeBlock />

                <ConditionalContents
                  options={[
                    {
                      when: (editorInFocus) => !whenInAdmonition(editorInFocus),
                      contents: () => (
                        <>
                          <Separator />
                          <InsertAdmonition />
                        </>
                      ),
                    },
                  ]}
                />

                <Separator />
              </>
            ),
          },
        ]}
      />
    </DiffSourceToggleWrapper>
  );
};

const myPlugins = [
  toolbarPlugin({ toolbarContents: () => <MyToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  tablePlugin(),
  thematicBreakPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      txt: "text",
      js: "JavaScript",
      py: "Python",
      css: "CSS",
      tsx: "TypeScript",
    },
  }),
  directivesPlugin({
    directiveDescriptors: [AdmonitionDirectiveDescriptor],
  }),
  diffSourcePlugin({ viewMode: "rich-text" }),
  markdownShortcutPlugin(),
];

type AppMDXEditorProps = {
  initialNoteContent?: string;
  noteTitle?: string;
  noteId?: string;
  action: "create" | "update";
};

const AppMDXEditor = ({
  initialNoteContent,
  noteTitle,
  noteId,
  action,
}: AppMDXEditorProps) => {
  const ref = useRef<MDXEditorMethods | null>(null);

  const { openModal } = useModal();

  const handleSaveClick = () => {
    openModal({
      title: "Confirm Save Note",
      description: "Are you sure you want to save this note?",
      cancelText: "Cancel",
      confirmText: "Save",
      noteContent: ref.current?.getMarkdown() || "",
      noteTitle,
      action,
      noteId,
    });
  };

  return (
    <>
      <MDXEditor
        ref={ref}
        markdown={initialNoteContent || ""}
        plugins={myPlugins}
        className="mdxeditor"
      />
      <Button
        size="icon"
        className="absolute bottom-3 right-9 bg-slate-900 hover:bg-slate-100 hover:text-slate-900 border-2 border-slate-100 hover:border-slate-900 hover:shadow-lg"
        onClick={handleSaveClick}
      >
        <SaveIcon />
      </Button>
    </>
  );
};

export default AppMDXEditor;
