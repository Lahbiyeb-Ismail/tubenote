import { HowItWorksGrid, HowItWorksHeader } from "./components";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto">
        <HowItWorksHeader />

        <HowItWorksGrid />
      </div>
    </section>
  );
}
