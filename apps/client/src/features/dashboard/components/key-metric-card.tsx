import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui";

interface IMetric {
  title: string;
  value: string | number;
  change: string;
  trend: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ICardProps {
  metric: IMetric;
}

export function KeyMetricCard({ metric }: ICardProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{metric.title}</p>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {metric.trend === "up" && <ArrowUp className="h-3 w-3 text-green-600" />}
              {metric.trend === "down" && <ArrowDown className="h-3 w-3 text-red-600" />}
              {metric.trend === "neutral" && <Minus className="h-3 w-3 text-slate-400" />}
              <span
                className={`text-xs font-medium ${
                  metric.trend === "up"
                    ? "text-green-600"
                    : metric.trend === "down"
                      ? "text-red-600"
                      : "text-slate-400"
                }`}
              >
                {metric.change}
                {" "}
                from last week
              </span>
            </div>
          </div>
          <div
            className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              metric.color === "blue"
                ? "bg-blue-100 dark:bg-blue-900/30"
                : metric.color === "green"
                  ? "bg-green-100 dark:bg-green-900/30"
                  : metric.color === "purple"
                    ? "bg-purple-100 dark:bg-purple-900/30"
                    : "bg-amber-100 dark:bg-amber-900/30"
            }`}
          >
            <metric.icon
              className={`h-6 w-6 ${
                metric.color === "blue"
                  ? "text-blue-600 dark:text-blue-400"
                  : metric.color === "green"
                    ? "text-green-600 dark:text-green-400"
                    : metric.color === "purple"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-amber-600 dark:text-amber-400"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
