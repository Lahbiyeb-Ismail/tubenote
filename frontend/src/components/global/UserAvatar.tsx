import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetCurrentUser from "@/hooks/user/useGetCurrentUser";

function UserAvatar() {
	const { data } = useGetCurrentUser();

	const currentUser = data?.user;

	const src = "https://github.com/shadcn.png";
	const avatarFallback =
		(currentUser?.username?.[0]?.toUpperCase() ?? "") +
		(currentUser?.username?.[1]?.toUpperCase() ?? "");

	const imgSrc = currentUser?.profilePicture ?? src;

	return (
		<Avatar>
			<AvatarImage src={imgSrc} alt="user avatar" />
			<AvatarFallback>{avatarFallback}</AvatarFallback>
		</Avatar>
	);
}

export default UserAvatar;
