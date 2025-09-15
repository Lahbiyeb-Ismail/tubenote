import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function UserCTA() {
  return (
    <div
      className="text-center bg-gradient-primary rounded-2xl p-12 text-white"
    >
      <h3 className="text-3xl font-bold mb-4">Ready to End the Frustration?</h3>
      <p className="text-xl mb-8 opacity-90">
        Join thousands of learners who've transformed their video learning experience
      </p>

      <Link href="/notes" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-250 flex items-center justify-center max-w-fit mx-auto">
        <ArrowRight size={24} className="mr-2" />
        Start Taking Notes
      </Link>
    </div>
  );
}
