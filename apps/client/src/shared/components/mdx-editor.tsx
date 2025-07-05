"use client";

import type { DirectiveNode, EditorInFocus, MDXEditorMethods } from "@mdxeditor/editor";
import type { MutableRefObject } from "react";

import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,

  directivesPlugin,

  headingsPlugin,
  InsertAdmonition,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,

  quotePlugin,
  Separator,
  ShowSandpackInfo,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== "directive") {
    return false;
  }

  return ["note", "tip", "danger", "info", "caution"].includes(
    (node as DirectiveNode).getMdastNode().name,
  );
}

function MyToolbar() {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: editor => editor?.editorType === "codeblock",
            contents: () => <ChangeCodeMirrorLanguage />,
          },
          {
            when: editor => editor?.editorType === "sandpack",
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
                      when: editorInFocus => !whenInAdmonition(editorInFocus),
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
}

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

interface AppMDXEditorProps {
  editorRef: MutableRefObject<MDXEditorMethods | null>;
  noteContent?: string;
}

export function AppMDXEditor({
  editorRef,
  noteContent = "",
}: AppMDXEditorProps) {
  return (
    <div className="h-full">
      <MDXEditor
        ref={editorRef}
        markdown={noteContent}
        plugins={myPlugins}
        className="mdxeditor"
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
        <div className="flex items-center space-x-4">
          <span>
            {noteContent.length}
            {" "}
            characters
          </span>
          <span>
            {noteContent.split(/\s+/).filter(word => word.length > 0).length}
            {" "}
            words
          </span>
        </div>
        <div className="text-xs">
          💡 Use
          {" "}
          <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Z</kbd>
          {" "}
          to undo
        </div>
      </div>
    </div>
  );
}
