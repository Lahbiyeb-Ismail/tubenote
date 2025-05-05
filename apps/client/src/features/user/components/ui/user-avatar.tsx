import type { User } from "@tubenote/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  user: User;
};

export function UserAvatar({ user }: UserAvatarProps) {
  const src = "https://github.com/shadcn.png";

  const avatarFallback =
    user.username[0].toUpperCase() + user.username[1].toUpperCase();

  const imgSrc = user.profilePicture ?? src;

  return (
    <Avatar>
      <AvatarImage src={imgSrc} alt="user avatar" />
      <AvatarFallback>{avatarFallback}</AvatarFallback>
    </Avatar>
  );
}
