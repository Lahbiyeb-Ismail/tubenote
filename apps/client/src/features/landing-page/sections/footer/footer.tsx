import { FooterCopyright, FooterGrid } from "./components";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <FooterGrid />

        <FooterCopyright />
      </div>
    </footer>
  );
}
