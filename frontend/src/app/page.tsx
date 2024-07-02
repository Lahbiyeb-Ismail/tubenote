import Footer from "@/sections/Footer";
import HeroSection from "@/sections/HeroSection";
import HowItWorksSection from "@/sections/HowItWorksSection";

export default function Home() {
  return (
    <>
      <main className="grid place-content-center">
        <HeroSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
