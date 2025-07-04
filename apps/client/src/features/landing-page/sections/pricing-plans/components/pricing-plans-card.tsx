import { Check } from "lucide-react";

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";

import type { PricingPlan } from "../data";

interface IProps {
  pricingPlan: PricingPlan;
}

export function PricingPlansCard({ pricingPlan }: IProps) {
  return (
    <Card
      className={`relative bg-white/80 backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 ${
        pricingPlan.popular
          ? "border-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      {pricingPlan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">{pricingPlan.name}</CardTitle>
        <div className="flex items-baseline justify-center gap-1 mt-4">
          <span className="text-4xl font-bold text-gray-900">{pricingPlan.price}</span>
          <span className="text-gray-600">
            /
            {pricingPlan.period}
          </span>
        </div>
        <CardDescription className="text-gray-600 mt-2">
          {pricingPlan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {pricingPlan.features.map(feature => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          variant={pricingPlan.buttonVariant}
          className={`w-full ${
            pricingPlan.buttonVariant === "default"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
              : "border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
          } transition-all duration-300`}
        >
          {pricingPlan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
