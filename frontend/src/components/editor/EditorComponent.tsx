"use client";

import { useRef } from "react";
import { SaveIcon } from "lucide-react";
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
import "@mdxeditor/editor/style.css";

import { Button } from "../ui/button";

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
	const node = editorInFocus?.rootNode;
	if (!node || node.getType() !== "directive") {
		return false;
	}

	return ["note", "tip", "danger", "info", "caution"].includes(
		(node as DirectiveNode).getMdastNode().name,
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

const AppMDXEditor = () => {
	const ref = useRef<MDXEditorMethods | null>(null);

	return (
		<>
			<MDXEditor
				ref={ref}
				markdown=""
				plugins={myPlugins}
				className="mdxeditor"
			/>
			<Button
				size="icon"
				className="absolute bottom-3 right-9 bg-slate-900 hover:bg-slate-100 hover:text-slate-900 border-2 border-slate-100 hover:border-slate-900 hover:shadow-lg"
			>
				<SaveIcon />
			</Button>
		</>
	);
};

export default AppMDXEditor;
