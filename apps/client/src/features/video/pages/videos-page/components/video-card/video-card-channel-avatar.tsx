import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

interface IProps {
  channelAvatar: string;
  channelName: string;
}

export function VideoCardChannelAvatar({
  channelAvatar,
  channelName,
}: IProps) {
  return (
    <Avatar className="h-8 w-8 shrink-0">
      <AvatarImage src={channelAvatar} />
      <AvatarFallback>{channelName[0]}</AvatarFallback>
    </Avatar>
  );
}
