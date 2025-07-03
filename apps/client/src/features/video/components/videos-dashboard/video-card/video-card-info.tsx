import Link from "next/link";

interface IProps {
  videoTitle: string;
  channelTitle: string;
  ytVideoId: string;
}

export function VideoCardInfo({ videoTitle, channelTitle, ytVideoId }: IProps) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
        <Link href={`/videos/${ytVideoId}`}>
          {videoTitle}
        </Link>
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{channelTitle}</p>
    </div>
  );
}
