"use client";

import { ArrowRight, Play } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function YoutubeUrlInput() {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleStartWithVideo = () => {
    if (youtubeUrl.trim()) {
      // In a real app, this would navigate to the note editor with the video URL
      console.log("Starting with YouTube URL:", youtubeUrl);
      // For now, navigate to notes page
      window.location.href = "/notes";
    }
  };

  return (
    <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 max-w-2xl mx-auto">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">Start with a YouTube Video</h2>
          <p className="text-muted-foreground">
            Paste any YouTube video URL below to begin taking synchronized notes
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-url" className="text-sm font-medium">
              YouTube Video URL
            </Label>
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              className="text-base py-3"
            />
          </div>

          <Button
            onClick={handleStartWithVideo}
            disabled={!youtubeUrl.trim()}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 text-lg font-medium"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Taking Notes
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>

  );
}
