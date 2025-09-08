import { ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button, Card, CardContent, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";

import { useDashboardCategoryDistributionQuery, useDashboardWeeklyActivityQuery } from "../queries";

export function Charts() {
  const {
    data: weeklyActivityData,
    isLoading: isWeeklyLoading,
    error: weeklyError,
  } = useDashboardWeeklyActivityQuery();

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useDashboardCategoryDistributionQuery();

  // Colors for category distribution
  const categoryColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316"];

  // Transform category data to include colors
  const transformedCategoryData = categoryData?.map((item, index) => ({
    ...item,
    color: categoryColors[index % categoryColors.length],
  })) || [];

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
          {isWeeklyLoading
            ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="animate-pulse bg-slate-200 dark:bg-slate-700 w-full h-full rounded" />
                </div>
              )
            : weeklyError
              ? (
                  <div className="flex items-center justify-center h-[300px] text-slate-600 dark:text-slate-400">
                    Failed to load weekly activity data
                  </div>
                )
              : !weeklyActivityData || weeklyActivityData.length === 0
                  ? (
                      <div className="flex items-center justify-center h-[300px] text-slate-600 dark:text-slate-400">
                        No weekly activity data available
                      </div>
                    )
                  : (
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
                    )}
        </CardContent>
      </Card>

      {/* Learning Categories */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Learning Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isCategoryLoading
            ? (
                <div className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-700 w-full h-[200px] rounded mb-4" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                        <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            : categoryError
              ? (
                  <div className="flex items-center justify-center h-[300px] text-slate-600 dark:text-slate-400">
                    Failed to load category distribution data
                  </div>
                )
              : !transformedCategoryData || transformedCategoryData.length === 0
                  ? (
                      <div className="flex items-center justify-center h-[300px] text-slate-600 dark:text-slate-400">
                        No category data available
                      </div>
                    )
                  : (
                      <>
                        <div className="flex items-center justify-center mb-4">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={transformedCategoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {transformedCategoryData.map(entry => (
                                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-2">
                          {transformedCategoryData.map(category => (
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
                      </>
                    )}
        </CardContent>
      </Card>
    </div>
  );
}
