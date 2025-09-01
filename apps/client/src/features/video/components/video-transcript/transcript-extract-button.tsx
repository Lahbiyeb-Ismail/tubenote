"use client";

import { AlertCircle, Download, FileText } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface TranscriptExtractButtonProps {
  onExtract: () => void;
  isExtracting: boolean;
  error: string | undefined;
}

export function TranscriptExtractButton({
  onExtract,
  isExtracting,
  error,
}: TranscriptExtractButtonProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>

        <h3 className="text-lg font-medium mb-2">Extract Video Transcript</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Get the full transcript of this video to make it easier to search, study, and reference the content.
        </p>

        <Button
          onClick={onExtract}
          disabled={isExtracting}
          size="lg"
          className="min-w-[160px]"
        >
          {isExtracting
            ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Extracting...
                </>
              )
            : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Extract Transcript
                </>
              )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
