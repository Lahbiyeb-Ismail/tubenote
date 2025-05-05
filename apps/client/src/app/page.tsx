import { Navbar } from "@/components/Navbar";

import { Footer, Hero, HowItWorks } from "@/sections";

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
