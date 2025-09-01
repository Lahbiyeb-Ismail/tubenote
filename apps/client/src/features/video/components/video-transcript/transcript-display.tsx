"use client";

import { Search, Type } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptDisplayProps {
  transcript: string;
}

export function TranscriptDisplay({ transcript }: TranscriptDisplayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [fontSize, setFontSize] = useState("text-sm");

  const fontSizeOptions = [
    { label: "Small", value: "text-xs" },
    { label: "Medium", value: "text-sm" },
    { label: "Large", value: "text-base" },
    { label: "Extra Large", value: "text-lg" },
  ];

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim())
      return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part) => {
      if (regex.test(part)) {
        return (
          <mark
            key={`highlight-${part}-${Math.random()}`}
            className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded"
          >
            {part}
          </mark>
        );
      }
      return <span key={`text-${part}-${Math.random()}`}>{part}</span>;
    });
  };

  const searchMatches = searchTerm.trim()
    ? (transcript.match(new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length
    : 0;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in transcript..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchMatches > 0 && (
            <Badge variant="secondary" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
              {searchMatches}
              {" "}
              {searchMatches === 1 ? "match" : "matches"}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {fontSizeOptions.map(option => (
              <Button
                key={option.value}
                variant={fontSize === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFontSize(option.value)}
                className="h-7 text-xs px-2"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript Content */}
      <div className="border rounded-lg">
        <ScrollArea className="h-[400px] p-4">
          <div className={`${fontSize} leading-relaxed space-y-4 text-muted-foreground`}>
            {transcript.split("\n\n").map(paragraph => (
              <p key={paragraph.slice(0, 50)}>
                {highlightSearchTerm(paragraph, searchTerm)}
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Statistics */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          Words:
          {" "}
          {transcript.split(/\s+/).length.toLocaleString()}
        </span>
        <span>•</span>
        <span>
          Characters:
          {" "}
          {transcript.length.toLocaleString()}
        </span>
        <span>•</span>
        <span>
          Estimated reading time:
          {" "}
          {Math.ceil(transcript.split(/\s+/).length / 200)}
          {" "}
          min
        </span>
      </div>
    </div>
  );
}
