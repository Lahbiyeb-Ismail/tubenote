import { ArrowRight, FileText, Play, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Rich Text Editor",
    description: "Format your notes with markdown support",
    icon: FileText,
    color: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    title: "Video Sync",
    description: "Notes synced with video timestamps",
    icon: Play,
    color: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    title: "AI-Powered",
    description: "Smart suggestions and organization",
    icon: Sparkles,
    color: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    title: "Easy Export",
    description: "Share and export your notes",
    icon: ArrowRight,
    color: "bg-orange-100",
    textColor: "text-orange-600",
  },
];

export function FeatureHighlights() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {features.map(feature => (
            <div key={feature.title} className="space-y-2">
              <div className={`inline-flex items-center justify-center w-10 h-10 ${feature.color} rounded-full`}>
                <feature.icon className={`h-5 w-5 ${feature.textColor}`} />
              </div>
              <h4 className="font-medium text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
