import UserAvatar from "../global/UserAvatar";

function UserProfile() {
	const userData = {
		username: "John Doe",
		email: "jhon@gmail.com",
	};

	return (
		<div className="mt-auto border-t p-4">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				{userData ? (
					<>
						<UserAvatar username={userData.username} />
						<div>
							<h3 className="font-semibold text-gray-700">
								{userData.username}
							</h3>
							<p className="text-sm text-gray-500">{userData.email}</p>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}

export default UserProfile;
