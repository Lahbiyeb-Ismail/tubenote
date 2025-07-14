import { useSession } from "@/features/auth/hooks";

import { UserAvatar } from "./";

interface UserProfileProps {
  isOpen: boolean;
}

export function UserProfile({ isOpen }: UserProfileProps) {
  const { user, isLoading } = useSession();

  if (isLoading || !user)
    return null;

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        {user
          ? (
              <>
                <UserAvatar user={user} />
                {isOpen && (
                  <div className="hidden md:block">
                    <h3 className="font-semibold text-gray-700">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                )}
              </>
            )
          : null}
      </div>
    </div>
  );
}
