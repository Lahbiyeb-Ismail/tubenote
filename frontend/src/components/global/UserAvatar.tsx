import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarProps = {
	username?: string;
};

function UserAvatar({ username = "us" }: AvatarProps) {
	const src = "https://github.com/shadcn.png";
	const avatarFallback = username[0].toUpperCase() + username[1].toUpperCase();

	return (
		<Avatar>
			<AvatarImage src={src} alt="user avatar" />
			<AvatarFallback>{avatarFallback}</AvatarFallback>
		</Avatar>
	);
}

export default UserAvatar;
