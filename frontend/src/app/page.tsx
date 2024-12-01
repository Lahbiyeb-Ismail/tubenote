import Navbar from "@/components/Navbar/Navbar";

import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import HowItWorks from "@/sections/HowItWorks";

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
