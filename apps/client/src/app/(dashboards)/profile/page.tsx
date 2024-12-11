"use client";

import AccountActions from "@/components/profile/AccountActions";
import EmailConfirmationAlert from "@/components/profile/EmailConfirmationAlert";
import UserInfo from "@/components/profile/UserInfo";
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
        createdAt={data.user.createdAt}
      />

      <AccountActions />
    </div>
  );
}
