import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarProps = {
  imgSrc: string | null;
  username?: string;
};

function UserAvatar({ imgSrc, username = "us" }: AvatarProps) {
  const src = imgSrc || "https://github.com/shadcn.png";
  const avatarFallback = username[0].toUpperCase() + username[1].toUpperCase();

  return (
    <Avatar>
      <AvatarImage src={src} alt="user avatar" />
      <AvatarFallback>{avatarFallback}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
