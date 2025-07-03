import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardContent className="flex flex-col md:flex-row items-center p-6 gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-3 flex-1 w-full">
          <Skeleton className="h-8 w-3/4 md:w-1/2" />
          <Skeleton className="h-4 w-1/2 md:w-1/3" />
          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
