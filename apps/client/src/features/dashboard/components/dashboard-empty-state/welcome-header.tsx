import { Youtube } from "lucide-react";

export function WelcomeHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
        <Youtube className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-foreground">Welcome to TubeNote!</h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Take synchronized notes while watching YouTube videos. Your notes are automatically linked to specific moments in the video,
        making it easy to review and reference key information.
      </p>
    </div>
  );
}
