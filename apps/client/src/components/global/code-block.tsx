"use client";

import { Copy } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

import { cn } from "@/lib";

import { Button } from "@/components/ui";

export function CodeBlock({
  className,
  children,
}: { className?: string; children: string }) {
  const language = "javascript";
  const highlightedCode = language
    ? Prism.highlight(children, Prism.languages[language], language)
    : children;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative group">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-3 top-3 h-6 w-6 text-zinc-100"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <pre
        className={cn(`language-${language} code-font code-padding`, className)}
      >
        <code
          className="whitespace-pre"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}
