"use client";

import { Copy, Download, FileText } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetVideoTranscriptQuery } from "../../queries";
import { TranscriptDisplay } from "./transcript-display";
import { TranscriptExtractButton } from "./transcript-extract-button";

interface VideoTranscriptProps {
  videoId: string;
}

export function VideoTranscript({ videoId }: VideoTranscriptProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const { data, isLoading, error } = useGetVideoTranscriptQuery({ ytVideoId: videoId, language: "en", format: "text", timestamps: true }, isExtracting);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          Extracting transcript...
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  const transcript = data?.transcript;

  const handleCopyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      // TODO: Add toast notification for successful copy
    }
    catch (err) {
      console.error("Failed to copy transcript:", err);
    }
  };

  const handleDownloadTranscript = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-transcript-${videoId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Video Transcript</CardTitle>
            {transcript && (
              <Badge variant="secondary" className="ml-2">
                Extracted
              </Badge>
            )}
          </div>

          {transcript && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTranscript}
                className="h-8"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTranscript}
                className="h-8"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!transcript && !isExtracting && (
          <TranscriptExtractButton
            onExtract={() => setIsExtracting(true)}
            isExtracting={isExtracting}
            error={error?.message}
          />
        )}

        {transcript && (
          <TranscriptDisplay transcript={transcript} />
        )}

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
