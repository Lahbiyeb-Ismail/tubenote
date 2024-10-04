import React from "react";

import UserAvatar from "../global/UserAvatar";
import { Button } from "../ui/button";
import { LinkButton } from "../global/LinkButton";

function LoggedInButtons() {
	const handleLogout = () => {
		console.log("logout");
	};

	return (
		<div className="flex gap-4">
			<LinkButton href="/dashboard" size="md">
				Dashboard
			</LinkButton>
			<Button size="default" variant="secondary" onClick={handleLogout}>
				Logout
			</Button>
			<UserAvatar username="Ismail" />
		</div>
	);
}

export default LoggedInButtons;
