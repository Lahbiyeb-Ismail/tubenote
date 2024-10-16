"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/context/useAuth";

const LoggedInButtons = dynamic(() => import("./LoggedInButtons"), {
	ssr: false,
});
const LoggedOutButtons = dynamic(() => import("./LoggedOutButtons"), {
	ssr: false,
});

function NavbarButtons() {
	const {
		state: { accessToken },
	} = useAuth();

	return <>{accessToken ? <LoggedInButtons /> : <LoggedOutButtons />}</>;
}

export default NavbarButtons;
