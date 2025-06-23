import { FeatureHighlights } from "./feature-hightlights";
import { GettingStartedSteps } from "./getting-started-steps";
import { WelcomeHeader } from "./welcome-header";
import { YouTubeVideoEntry } from "./youtube-video-entry";

export function DashboardEmptyState() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-screen p-6">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* YouTube URL Input Section */}
      <YouTubeVideoEntry />

      {/* Getting Started Steps */}
      <GettingStartedSteps />

      {/* Feature Highlights */}
      <FeatureHighlights />
    </div>
  );
}
