"use client";

import dynamic from "next/dynamic";
import useGetCurrentUser from "@/hooks/user/useGetCurrentUser";

const LoggedInButtons = dynamic(() => import("./LoggedInButtons"), {
	ssr: false,
});
const LoggedOutButtons = dynamic(() => import("./LoggedOutButtons"), {
	ssr: false,
});

function NavbarButtons() {
	const { data: currentUser, isLoading } = useGetCurrentUser();

	return (
		<>
			{currentUser && !isLoading ? (
				<LoggedInButtons />
			) : (
				<LoggedOutButtons />
			)}
		</>
	);
}

export default NavbarButtons;
