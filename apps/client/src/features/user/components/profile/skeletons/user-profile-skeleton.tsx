import { Fragment } from "react";

import { ProfileHeaderSkeleton } from "./profile-header-skeleton";
import { UserAchievementsSkeleton } from "./user-achievements-skeleton";
import { UserLearningProgressSkeleton } from "./user-learning-progress-skeleton";
import { UserRecentActivitySkeleton } from "./user-recent-activity-skeleton";
import { UserStatisticsSkeleton } from "./user-statistics-skeleton";

export function UserProfileSkeleton() {
  return (
    <Fragment>
      {/* Profile Header Card - Skeleton */}
      <ProfileHeaderSkeleton />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Statistics - Skeleton */}
        <UserStatisticsSkeleton />

        {/* User Achievements - Skeleton */}
        <UserAchievementsSkeleton />
      </div>

      {/* Learning Progress Card - Skeleton */}
      <UserLearningProgressSkeleton />

      {/* Recent Activity Card - Skeleton */}
      <UserRecentActivitySkeleton />
    </Fragment>
  );
}
