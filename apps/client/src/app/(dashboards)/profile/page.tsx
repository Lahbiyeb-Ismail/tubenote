"use client";

import { EmailConfirmationAlert } from "@/features/auth/components";
import { AccountActions, UserInfo } from "@/features/user/components";
import { useUserStore } from "@/features/user/store";

export default function ProfilePage() {
  const { currentUser } = useUserStore();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <EmailConfirmationAlert
        emailVerified={currentUser.isEmailVerified}
        email={currentUser.email}
      />

      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <UserInfo
        username={currentUser.username}
        email={currentUser.email}
        isEmailVerified={currentUser.isEmailVerified}
        createdAt={currentUser.createdAt}
      />

      <AccountActions />
    </div>
  );
}
