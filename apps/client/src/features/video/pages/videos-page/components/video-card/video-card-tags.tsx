import { Badge } from "@/components/ui";

interface IProps {
  videoTags: string[];
}

export function VideoCardTags({ videoTags }: IProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {videoTags.slice(0, 4).map(tag => (
        <Badge
          key={tag}
          variant="outline"
          className="text-xs hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer truncate"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
