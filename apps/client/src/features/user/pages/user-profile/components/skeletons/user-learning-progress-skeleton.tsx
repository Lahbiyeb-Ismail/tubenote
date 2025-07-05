import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserLearningProgressSkeleton() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[...Array.from({ length: 3 })].map((_, index) => (
              <div key={`progress-skeleton-${index}`}>
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
