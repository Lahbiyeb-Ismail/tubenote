import type { User } from "@/types/auth.types";
import UserAvatar from "../global/UserAvatar";
import { useAuth } from "@/context/useAuth";

function UserProfile() {
	const { state } = useAuth();

	const { user } = state;

	return (
		<div className="mt-auto border-t p-4">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				{user ? (
					<>
						<UserAvatar />
						<div>
							<h3 className="font-semibold text-gray-700">{user.username}</h3>
							<p className="text-sm text-gray-500">{user.email}</p>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}

export default UserProfile;
