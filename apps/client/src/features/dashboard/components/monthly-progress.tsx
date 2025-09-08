import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

import { useDashboardMonthlyProgressQuery } from "../queries";

export function MonthlyProgress() {
  const {
    data: monthlyProgressData,
    isLoading,
    error,
  } = useDashboardMonthlyProgressQuery();

  return (
    <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading
          ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 w-full h-full rounded" />
              </div>
            )
          : error
            ? (
                <div className="flex items-center justify-center h-[200px] text-slate-600 dark:text-slate-400">
                  Failed to load monthly progress data
                </div>
              )
            : !monthlyProgressData || monthlyProgressData.length === 0
                ? (
                    <div className="flex items-center justify-center h-[200px] text-slate-600 dark:text-slate-400">
                      No monthly progress data available
                    </div>
                  )
                : (
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
                  )}
      </CardContent>
    </Card>
  );
}
