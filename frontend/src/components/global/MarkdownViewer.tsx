import * as React from "react";
import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface MarkdownViewerProps {
	content: string;
	className?: string;
}

function MarkdownViewer({ content, className }: MarkdownViewerProps) {
	return (
		<Card className={cn("overflow-hidden", className)}>
			<Markdown
				className={cn(
					"prose dark:prose-invert max-w-none p-6",
					"prose-headings:scroll-m-20 prose-headings:tracking-tight",
					"prose-h1:text-4xl prose-h1:font-extrabold prose-h1:lg:text-5xl",
					"prose-h2:text-3xl prose-h2:font-semibold",
					"prose-h3:text-2xl prose-h3:font-semibold",
					"prose-h4:text-xl prose-h4:font-semibold",
					"prose-p:leading-7",
					"prose-list:my-6 prose-list:ml-6 prose-li:mt-2",
					"prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic",
					"prose-img:rounded-md prose-img:border prose-img:border-muted",
					"[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm",
					"prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80",
					"prose-hr:border-border",
				)}
				options={{
					overrides: {
						h1: {
							component: ({ children, ...props }) => (
								<div className="space-y-4">
									<h1 {...props}>{children}</h1>
									<Separator />
								</div>
							),
						},
						code: {
							component: CodeBlock,
						},
						pre: {
							component: ({ children, className, ...props }) => {
								// Extract language and metadata from className
								const match = className?.match(/language-(\w+)(.*)/) || [];
								const language = match[1] || "typescript";
								const metadata = match[2]?.trim() || "";

								// If children is a CodeBlock component, pass the language prop
								if (children?.type === CodeBlock) {
									return React.cloneElement(children, {
										language,
										metadata,
										className: "mt-6",
									});
								}

								// Otherwise, render as normal pre
								return (
									<pre className="mt-6" {...props}>
										{children}
									</pre>
								);
							},
						},
						// Table overrides for better styling
						table: {
							component: ({ children, ...props }) => (
								<div className="my-6 w-full overflow-y-auto">
									<table className="w-full" {...props}>
										{children}
									</table>
								</div>
							),
						},
						th: {
							component: ({ children, ...props }) => (
								<th
									className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
									{...props}
								>
									{children}
								</th>
							),
						},
						td: {
							component: ({ children, ...props }) => (
								<td
									className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
									{...props}
								>
									{children}
								</td>
							),
						},
					},
				}}
			>
				{content}
			</Markdown>
		</Card>
	);
}

export default MarkdownViewer;
