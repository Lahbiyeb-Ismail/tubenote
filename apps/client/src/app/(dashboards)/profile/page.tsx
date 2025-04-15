"use client";

import { EmailConfirmationAlert } from "@/features/auth/components";
import { AccountActions, UserInfo } from "@/features/user/components";

import useGetCurrentUser from "@/hooks/user/useGetCurrentUser";

export default function ProfilePage() {
  const { data } = useGetCurrentUser();

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <EmailConfirmationAlert
        emailVerified={data.user.emailVerified}
        email={data.user.email}
      />

      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <UserInfo
        username={data.user.username}
        email={data.user.email}
        emailVerified={data.user.emailVerified}
        createdAt={data.user.createAt}
      />

      <AccountActions />
    </div>
  );
}
