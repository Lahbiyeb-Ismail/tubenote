"use client";

import { useAuth } from "@/features/auth/contexts";

import { EmailConfirmationAlert } from "@/features/auth/components";
import { AccountActions, UserInfo } from "@/features/user/components";

export default function ProfilePage() {
  const { currentUserQueryResult } = useAuth();

  const { data: user } = currentUserQueryResult;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <EmailConfirmationAlert
        emailVerified={user.isEmailVerified}
        email={user.email}
      />

      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <UserInfo
        username={user.username}
        email={user.email}
        isEmailVerified={user.isEmailVerified}
        createdAt={user.createdAt}
      />

      <AccountActions />
    </div>
  );
}
