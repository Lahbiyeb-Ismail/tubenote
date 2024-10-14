"use client";

import { useAuth } from "@/context/useAuth";

import LoggedInButtons from "./LoggedInButtons";
import LoggedOutButtons from "./LoggedOutButtons";

function NavbarButtons() {
	const {
		state: { accessToken },
	} = useAuth();

	return <>{accessToken ? <LoggedInButtons /> : <LoggedOutButtons />}</>;
}

export default NavbarButtons;
