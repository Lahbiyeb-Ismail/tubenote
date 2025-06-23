import { Clock, FileText, Plus, Sparkles, Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDialogStore } from "@/stores";

export function NoNotesFound() {
  const { openDialog } = useDialogStore();

  return (
    <div className="min-h-screen flex-1 bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Welcome Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Start Your Note-Taking Journey</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Create your first note and begin organizing your thoughts, ideas, and video insights all in one place.
            </p>
          </div>

          {/* Create Note Action */}
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Create Your First Note</h2>
                <p className="text-muted-foreground">
                  Start with a simple text note or add a YouTube video to take synchronized notes
                </p>
              </div>

              <Button
                onClick={() => openDialog("create-note")}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Note
              </Button>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">What you can do with notes</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium">Rich Text Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    Format your notes with markdown, lists, and styling
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <Youtube className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium">Video Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Sync notes with YouTube videos for better learning
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Auto Timestamps</h4>
                  <p className="text-sm text-muted-foreground">
                    Notes automatically linked to video moments
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tips */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 mt-1">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground mb-2">Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    You can create notes while watching videos, and each note will be automatically timestamped
                    to the current video position for easy reference later.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
