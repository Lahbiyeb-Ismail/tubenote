import UserAvatar from "../global/UserAvatar";
import NavbarLinks from "./NavbarLinks";

function LoggedInButtons() {
	const handleLogout = () => {
		console.log("logout");
	};

	return (
		<div className="flex-grow flex justify-between gap-4">
			<NavbarLinks />
			<UserAvatar username="Ismail" />
		</div>
	);
}

export default LoggedInButtons;
