import { Card, CardContent } from "@/components/ui";

import type { HowItWorksStep } from "../data";

interface IProps {
  step: HowItWorksStep;
  index: number;
}

export function HowItWorksCard({ step, index }: IProps) {
  return (
    <Card className="relative group cursor-pointer hover:scale-105 transition-transform duration-300">
      <div className="absolute z-[100] -top-4 left-6 h-8 w-8 rounded-full bg-gradient-to-r from-red-600 to-purple-600 flex items-center justify-center text-white font-medium">
        {index + 1}
      </div>
      <CardContent className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:bg-white/80">
        <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
          <step.icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h3>
        <p className="text-gray-600 leading-relaxed">{step.description}</p>
      </CardContent>
    </Card>
  );
}
