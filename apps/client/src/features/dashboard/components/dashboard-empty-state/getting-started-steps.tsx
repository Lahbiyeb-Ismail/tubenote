import { Clock, FileText, Youtube } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const gettingStartedSteps = [
  {
    title: "Add Your Video",
    description: "Paste any YouTube URL and the video will load in our integrated player.",
    icon: Youtube,
    color: "bg-blue-100",
    textColor: "text-blue-600",
    stepNumber: 1,
  },
  {
    title: "Take Synchronized Notes",
    description: "Write notes in our rich editor while watching. Each note is automatically timestamped.",
    icon: FileText,
    color: "bg-green-100",
    textColor: "text-green-600",
    stepNumber: 2,
  },
  {
    title: "Review & Navigate",
    description: "Click on any note to jump to that moment in the video instantly",
    icon: Clock,
    color: "bg-purple-100",
    textColor: "text-purple-600",
    stepNumber: 3,
  },
];

export function GettingStartedSteps() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {gettingStartedSteps.map(step => (
        <Card key={step.stepNumber} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-12 h-12 ${step.color} rounded-full`}>
              <step.icon className={`h-6 w-6 ${step.textColor}`} />
            </div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">
              {step.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
