import { Check } from "lucide-react";

import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with video note-taking",
      features: [
        "Up to 10 video notes per month",
        "Basic timestamping",
        "Text notes only",
        "Personal use only",
        "Standard support",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "month",
      description: "Ideal for students and professionals",
      features: [
        "Unlimited video notes",
        "Advanced timestamping",
        "Rich text formatting",
        "Note sharing & collaboration",
        "Video annotations",
        "Export to PDF/Word",
        "Priority support",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Team",
      price: "$29.99",
      period: "month",
      description: "Best for teams and organizations",
      features: [
        "Everything in Pro",
        "Team workspaces",
        "Admin dashboard",
        "User management",
        "Advanced analytics",
        "Custom integrations",
        "24/7 premium support",
        "Custom branding",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-full">
            Plans & Pricing
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Choose Your
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map(plan => (
            <Card
              key={plan.name}
              className={`relative bg-white/80 backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105 ${
                plan.popular
                  ? "border-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1 mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">
                    /
                    {plan.period}
                  </span>
                </div>
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.buttonVariant === "default"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                  } transition-all duration-300`}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Need a custom solution?
            {" "}
            <a href="#" className="text-blue-600 hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
}
