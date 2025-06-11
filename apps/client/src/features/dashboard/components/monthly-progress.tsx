import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

// Sample data for charts
const monthlyProgressData = [
  { month: "Jan", notes: 45, videos: 12 },
  { month: "Feb", notes: 52, videos: 15 },
  { month: "Mar", notes: 48, videos: 13 },
  { month: "Apr", notes: 61, videos: 18 },
  { month: "May", notes: 55, videos: 16 },
  { month: "Jun", notes: 67, videos: 20 },
];

export function MonthlyProgress() {
  return (
    <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyProgressData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="notes" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            <Area
              type="monotone"
              dataKey="videos"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
