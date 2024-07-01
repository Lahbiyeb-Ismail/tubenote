import React from "react";
import type { LucideIcon } from "lucide-react";

import StepCard from "./StepCard";

type StepsListProps = {
  steps: {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
  }[];
};

function StepsList({ steps }: StepsListProps) {
  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <StepCard key={step.title} step={step} />
        ))}
      </div>
    </div>
  );
}

export default StepsList;
