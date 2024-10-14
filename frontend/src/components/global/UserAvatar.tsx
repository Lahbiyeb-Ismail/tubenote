import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/useAuth";

function UserAvatar() {
	const { state } = useAuth();

	const { user } = state;

	const src = "https://github.com/shadcn.png";
	const avatarFallback =
		(user?.username?.[0]?.toUpperCase() ?? "") +
		(user?.username?.[1]?.toUpperCase() ?? "");

	return (
		<Avatar>
			<AvatarImage src={src} alt="user avatar" />
			<AvatarFallback>{avatarFallback}</AvatarFallback>
		</Avatar>
	);
}

export default UserAvatar;
