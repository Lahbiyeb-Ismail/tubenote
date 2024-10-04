import Image from "next/image";
import Link from "next/link";

function Logo() {
	return (
		<div className="w-[150px]">
			<Link href="/">
				<Image
					src="/images/logo.png"
					alt="tubenote logo"
					width={232}
					height={72}
				/>
			</Link>
		</div>
	);
}

export default Logo;
