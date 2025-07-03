import { Plus, Video, Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDialogStore } from "@/stores";

export function NoVideosFound() {
  const { openDialog } = useDialogStore();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Main illustration */}
        <div className="relative">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
            <Video className="h-16 w-16 text-red-500" />
          </div>
        </div>

        {/* Main message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Your Video Library Awaits</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Start building your collection of YouTube videos. Organize, manage, and access your favorite educational content all in one place.
          </p>
        </div>

        {/* Call to action */}
        <Button
          onClick={() => { openDialog("add-video"); }}
          size="lg"
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Your First Video
        </Button>

        {/* Feature preview cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Youtube className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">YouTube Integration</h3>
              <p className="text-sm text-muted-foreground">
                Simply paste any YouTube URL to add videos to your library
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Video className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Video Library</h3>
              <p className="text-sm text-muted-foreground">
                Organize and manage all your educational videos in one place
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Easy Access</h3>
              <p className="text-sm text-muted-foreground">
                Quick access to your videos for note-taking and learning
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
