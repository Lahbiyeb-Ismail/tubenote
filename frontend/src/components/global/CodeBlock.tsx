"use client";

import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
	children: string;
	language?: string;
	metadata?: string;
	className?: string;
}

function CodeBlock({
	children,
	language = "typescript",
	metadata = "",
	className,
}: CodeBlockProps) {
	return (
		<div className="relative rounded-lg bg-zinc-950 text-zinc-50">
			{metadata && (
				<div className="px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800">
					{metadata}
				</div>
			)}
			<div className="relative group">
				<pre className={cn("p-4 overflow-x-auto text-sm", className)}>
					<code className="text-zinc-50">
						{children.split("\n").map((line, i) => (
							<span key={line} className="block">
								{line.split(/(<[^>]+>|{[^}]+}|\s+)/).map((part, j) => {
									// Highlight XML/JSX tags
									if (part.startsWith("<") && part.endsWith(">")) {
										return (
											<span key={part}>
												<span className="text-blue-400">&lt;</span>
												<span className="text-purple-400">
													{part.slice(1, -1)}
												</span>
												<span className="text-blue-400">&gt;</span>
											</span>
										);
									}
									// Highlight attributes and JSX expressions
									if (
										part.includes("=") ||
										(part.startsWith("{") && part.endsWith("}"))
									) {
										return (
											<span key={part} className="text-sky-300">
												{part}
											</span>
										);
									}
									return <span key={part}>{part}</span>;
								})}
							</span>
						))}
					</code>
				</pre>
			</div>
		</div>
	);
}

export default CodeBlock;
