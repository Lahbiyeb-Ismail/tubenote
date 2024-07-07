import type { LucideIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

type StepCardProps = {
  step: {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
  };
};

function StepCard({ step }: StepCardProps) {
  return (
    <div
      key={step.title}
      className="block rounded-xl border border-gray-200 bg-white p-8 text-center shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
    >
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-white shadow">
        <step.icon className={cn("size-12", step.color)} />
      </div>
      <h3 className="mt-8 text-lg font-medium text-gray-900">{step.title}</h3>
      <p className="mt-2 text-base text-gray-500">{step.description}</p>
    </div>
  );
}

export default StepCard;
