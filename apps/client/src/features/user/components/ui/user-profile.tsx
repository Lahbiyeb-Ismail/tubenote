import { useAuth } from "@/features/auth/contexts";
import { UserAvatar } from "./";

type UserProfileProps = {
  isOpen: boolean;
};

export function UserProfile({ isOpen }: UserProfileProps) {
  const { currentUserQueryResult } = useAuth();

  const { data: user } = currentUserQueryResult;

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        {user ? (
          <>
            <UserAvatar user={user} />
            {isOpen && (
              <div className="hidden md:block">
                <h3 className="font-semibold text-gray-700">{user.username}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
