import { Logo } from "@/shared/components";

export function FooterBrand() {
  return (
    <div className="space-y-4">
      <Logo />
      <p className="text-gray-400 leading-relaxed">
        Enhancing your learning experience with smart video note-taking.
      </p>
    </div>
  );
}
