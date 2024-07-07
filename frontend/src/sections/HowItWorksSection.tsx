import { howItWorksSteps } from "@/utils/constants";
import Link from "next/link";
import React from "react";

import StepsList from "@/components/global/StepsList";

function HowItWorksSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Take notes on YouTube videos in four simple steps
          </p>
        </div>

        <StepsList steps={howItWorksSteps} />

        <div className="mt-20 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
