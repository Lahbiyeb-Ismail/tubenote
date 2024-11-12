import Navbar from "@/components/Navbar/Navbar";

import Hero from "@/sections/Hero";
import HowItWorks from "@/sections/HowItWorks";
import Footer from "@/sections/Footer";

export default function Home() {
	return (
		<main>
			<Navbar />
			<Hero />
			<HowItWorks />
			<Footer />
		</main>
	);
}
