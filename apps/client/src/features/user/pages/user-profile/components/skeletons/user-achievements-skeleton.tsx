import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserAchievementsSkeleton() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-full" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array.from({ length: 3 })].map((_, index) => (
          <div key={`achievement-skeleton-${index}`} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
