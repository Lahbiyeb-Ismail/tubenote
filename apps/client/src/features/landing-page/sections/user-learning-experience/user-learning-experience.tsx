"use client";

import { SectionContainer, SectionHeader } from "../../components";
import { UserCTA, UserExperienceViewContainer, UserLearningScenarios, UserPainPointsGrid } from "./components";

export function UserLearningExperience() {
  return (
    <SectionContainer sectionId="#learning-experience" backgroundColorClass="bg-white/50" containerClass="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <SectionHeader
        title={{ text: "The Video", highlight: "Learning Problem", highlightClassName: "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400" }}
        description="Millions of learners struggle with the same frustrating experience: valuable information gets lost in the endless stream of video content."
        badgeText="User Learning Experience"
        badgeClassName="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
      />

      {/* Split-Screen Comparison */}
      <UserExperienceViewContainer />

      {/* Pain Points Grid */}
      <UserPainPointsGrid />

      {/* Scenario Stories */}
      <UserLearningScenarios />

      {/* Call to Action */}
      <UserCTA />
    </SectionContainer>
  );
}
