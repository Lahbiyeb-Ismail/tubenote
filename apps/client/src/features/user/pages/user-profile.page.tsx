"use client";

import { Fragment, useState } from "react";

import { NavigateBackButton } from "@/components";

import {
  EditProfileContainer,
  ProfilePageContainer,
  UserAchievementsOverview,
  UserLearningProgress,
  UserProfileHeader,
  UserProfileSkeleton,
  UserRecentActivity,
  UserStatisticsOverview,
} from "../components/profile";
import { useGetCurrentUser } from "../hooks";

export function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isPending } = useGetCurrentUser();

  if (isPending || !user)
    return <UserProfileSkeleton />;

  return (
    <ProfilePageContainer>
      {/* Header */}
      <NavigateBackButton href="/dashboard" btnText="Back to Dashboard" />

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
    </ProfilePageContainer>
  );
}
