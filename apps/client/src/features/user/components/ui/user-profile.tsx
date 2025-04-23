import { useGetCurrentUser } from "../../hooks";
import { UserAvatar } from "./";

type UserProfileProps = {
  isOpen: boolean;
};

export function UserProfile({ isOpen }: UserProfileProps) {
  const { data: response } = useGetCurrentUser();

  const currentUser = response?.payload.data ?? null;

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        {currentUser ? (
          <>
            <UserAvatar />
            {isOpen && (
              <div className="hidden md:block">
                <h3 className="font-semibold text-gray-700">
                  {currentUser.username}
                </h3>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
