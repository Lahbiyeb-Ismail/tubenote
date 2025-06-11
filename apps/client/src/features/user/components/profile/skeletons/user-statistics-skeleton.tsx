import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserStatisticsSkeleton() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-full" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array.from({ length: 4 })].map((_, index) => (
          <div key={`stat-skeleton-${index}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-6" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
