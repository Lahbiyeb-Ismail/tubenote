import LoggedInButtons from "./LoggedInButtons";
import LoggedOutButtons from "./LoggedOutButtons";

function NavbarButtons() {
	// for testing purposes
	const isAuthenticated = false;

	return <>{isAuthenticated ? <LoggedInButtons /> : <LoggedOutButtons />}</>;
}

export default NavbarButtons;
