import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="h-full bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
          <step.icon className={cn("size-8 mr-3", step.color)} />
          {step.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{step.description}</p>
      </CardContent>
    </Card>
  );
}

export default StepCard;
