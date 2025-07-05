import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserRecentActivitySkeleton() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array.from({ length: 3 })].map((_, index) => (
            <div key={`activity-skeleton-${index}`} className="flex items-start gap-4 pb-4 border-b last:border-0">
              <Skeleton className="h-10 w-10 rounded-full mt-1" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
