import React from "react";

import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
import { Button as ButtonLink } from "./Button";

import { useAuth } from "@/context/useAuth";

function LoggedInButtons() {
	const { state, logout } = useAuth();

	return (
		<div className="flex gap-4">
			<ButtonLink href="/dashboard" size="md">
				Dashboard
			</ButtonLink>
			<Button size="default" variant="secondary" onClick={logout}>
				Logout
			</Button>
			<UserAvatar username={state.user?.username} />
		</div>
	);
}

export default LoggedInButtons;
