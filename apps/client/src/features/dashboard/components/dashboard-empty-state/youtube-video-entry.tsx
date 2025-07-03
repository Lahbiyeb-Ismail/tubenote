import { YoutubeUrlForm } from "@/components";
import { Card, CardContent } from "@/components/ui/card";

export function YouTubeVideoEntry() {
  return (
    <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 max-w-2xl mx-auto">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">Start with a YouTube Video</h2>
          <p className="text-muted-foreground">
            Paste any YouTube video URL below to begin taking synchronized notes
          </p>
        </div>

        <YoutubeUrlForm />
      </CardContent>
    </Card>

  );
}
