import { LinkButton } from "../global/LinkButton";

function LoggedOutButtons() {
	return (
		<LinkButton href="/api/auth/login" size="md">
			Get Started
		</LinkButton>
	);
}

export default LoggedOutButtons;
