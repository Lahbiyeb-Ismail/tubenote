"use client";

import LoggedInButtons from "./LoggedInButtons";
import LoggedOutButtons from "./LoggedOutButtons";
import { useAuth } from "@/context/useAuth";

function NavbarButtons() {
	const { state } = useAuth();

	return (
		<>{state.isAuthenticated ? <LoggedInButtons /> : <LoggedOutButtons />}</>
	);
}

export default NavbarButtons;
