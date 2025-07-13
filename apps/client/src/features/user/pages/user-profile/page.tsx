"use client";

import { Fragment, useState } from "react";

import { useSession } from "@/features/auth/hooks";

import {
  EditProfileContainer,
  UserAchievementsOverview,
  UserLearningProgress,
  UserProfileHeader,
  UserProfileSkeleton,
  UserRecentActivity,
  UserStatisticsOverview,
} from "./components";

export function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const { user, isLoading } = useSession();

  if (isLoading || !user)
    return <UserProfileSkeleton />;

  return (
    <Fragment>
      {/* Profile Header Card */}
      <UserProfileHeader user={user} isEditing={isEditing} setIsEditing={setIsEditing} />

      {/* Edit Form or Profile Details */}
      {isEditing
        ? (
            <EditProfileContainer setIsEditing={setIsEditing} />
          )
        : (
            <Fragment>
              <div className="grid gap-6 md:grid-cols-2">
                {/* User Statistics */}
                <UserStatisticsOverview />

                {/* User Achievements */}
                <UserAchievementsOverview />
              </div>

              {/* Learning Progress Card */}
              <UserLearningProgress />

              {/* Recent Activity Card */}
              <UserRecentActivity />
            </Fragment>
          )}
    </Fragment>
  );
}
