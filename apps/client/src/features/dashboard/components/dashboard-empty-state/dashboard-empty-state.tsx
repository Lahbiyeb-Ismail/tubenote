import { CallToAction } from "./call-to-action";
import { FeatureHighlights } from "./feature-hightlights";
import { GettingStartedSteps } from "./getting-started-steps";
import { WelcomeHeader } from "./welcome-header";
import { YoutubeUrlInput } from "./youtube-url-input";

export function DashboardEmptyState() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* YouTube URL Input Section */}
      <YoutubeUrlInput />

      {/* Getting Started Steps */}
      <GettingStartedSteps />

      {/* Call to Action */}
      <CallToAction />

      {/* Feature Highlights */}
      <FeatureHighlights />
    </div>
  );
}
