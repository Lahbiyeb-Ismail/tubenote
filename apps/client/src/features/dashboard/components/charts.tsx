import { ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button, Card, CardContent, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";

// Sample data for charts
const weeklyActivityData = [
  { day: "Mon", notes: 12, videos: 3, time: 45 },
  { day: "Tue", notes: 8, videos: 2, time: 30 },
  { day: "Wed", notes: 15, videos: 4, time: 60 },
  { day: "Thu", notes: 10, videos: 2, time: 35 },
  { day: "Fri", notes: 18, videos: 5, time: 75 },
  { day: "Sat", notes: 22, videos: 6, time: 90 },
  { day: "Sun", notes: 14, videos: 3, time: 50 },
];

const categoryData = [
  { name: "Web Development", value: 35, color: "#3B82F6" },
  { name: "Data Science", value: 25, color: "#10B981" },
  { name: "Design", value: 20, color: "#F59E0B" },
  { name: "Marketing", value: 12, color: "#EF4444" },
  { name: "Others", value: 8, color: "#8B5CF6" },
];

export function Charts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Weekly Activity Chart */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  This Week
                  {" "}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>This Week</DropdownMenuItem>
                <DropdownMenuItem>Last Week</DropdownMenuItem>
                <DropdownMenuItem>This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="notes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="videos" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Learning Categories */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Learning Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map(entry => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {categoryData.map(category => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {category.value}
                  %
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
