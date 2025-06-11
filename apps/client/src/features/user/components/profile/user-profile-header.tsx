import type { User } from "@tubenote/db";

import { Card, CardContent } from "@/components/ui/card";

import { UserProfileAvatar } from "./user-profile-avatar";
import { UserProfileInfo } from "./user-profile-info";

interface IProps {
  user: User;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export function UserProfileHeader({ user, isEditing, setIsEditing }: IProps) {
  return (
    <Card className="mb-8 bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar Section */}
          <UserProfileAvatar user={user} />

          {/* User Info */}
          <UserProfileInfo user={user} isEditing={isEditing} setIsEditing={setIsEditing} />
        </div>
      </CardContent>
    </Card>
  );
}
