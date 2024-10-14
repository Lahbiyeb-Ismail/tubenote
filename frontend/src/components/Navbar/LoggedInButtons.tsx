import NavbarLinks from "./NavbarLinks";
import DropDownNavbar from "./DropDownNavbar";

function LoggedInButtons() {
	return (
		<div className="flex-grow flex justify-between gap-4">
			<NavbarLinks />
			<DropDownNavbar />
		</div>
	);
}

export default LoggedInButtons;
