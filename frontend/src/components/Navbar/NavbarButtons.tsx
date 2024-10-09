"use client";

import { useAuth } from "@/context/useAuth";

import LoggedInButtons from "./LoggedInButtons";
import LoggedOutButtons from "./LoggedOutButtons";

function NavbarButtons() {
	const { state } = useAuth();

	return (
		<>{state.isAuthenticated ? <LoggedInButtons /> : <LoggedOutButtons />}</>
	);
}

export default NavbarButtons;
