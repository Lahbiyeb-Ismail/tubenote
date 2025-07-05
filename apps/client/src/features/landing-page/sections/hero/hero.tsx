import { HeroGrid } from "./components";

export function Hero() {
  return (
    <section className="pb-16 px-4 min-h-screen flex items-center">
      <div className="container mx-auto">
        <HeroGrid />
      </div>
    </section>
  );
}
