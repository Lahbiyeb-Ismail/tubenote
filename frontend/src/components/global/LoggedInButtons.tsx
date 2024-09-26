import React from "react";

import { Button } from "./Button";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/context/useAuth";

function LoggedInButtons() {
	const { state } = useAuth();

	return (
		<div className="flex gap-4">
			<Button href="/dashboard" size="md">
				Dashboard
			</Button>
			<Button
				href="/api/auth/logout"
				size="md"
				variant="secondary"
				onClick={() => sessionStorage.clear()}
			>
				Logout
			</Button>
			<UserAvatar username={state.user?.username} />
		</div>
	);
}

export default LoggedInButtons;
