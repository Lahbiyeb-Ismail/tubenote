import { Skeleton } from "@/components/ui";

export function PaginationControlsSkeleton() {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-md" />
        {" "}
        {/* Previous button */}
        {Array.from({ length: 3 }).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-9 w-9 rounded-md" />
        ))}
        <Skeleton className="h-9 w-9 rounded-md" />
        {" "}
        {/* Next button */}
      </div>
    </div>
  );
}
