import { Card, CardContent } from "@/components/ui";

import type { Feature } from "../data";

interface IProps {
  feature: Feature;
}

export function FeatureCard({ feature }: IProps) {
  return (
    <Card className="group cursor-pointer hover:scale-105 transition-transform duration-300">
      <CardContent className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:bg-white/80">
        <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
          <feature.icon className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
      </CardContent>
    </Card>
  );
}
