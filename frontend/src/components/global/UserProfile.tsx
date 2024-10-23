import useGetCurrentUser from "@/hooks/user/useGetCurrentUser";
import UserAvatar from "../global/UserAvatar";

type UserProfileProps = {
	isOpen: boolean;
};

function UserProfile({ isOpen }: UserProfileProps) {
	const { data } = useGetCurrentUser();

	const currentUser = data?.user;

	return (
		<div className="mt-auto border-t p-4">
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

export default UserProfile;
