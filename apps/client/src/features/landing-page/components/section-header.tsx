import { Badge } from "@/components/ui";
import { cn } from "@/lib";

interface IProps {
  badgeText: string;
  badgeClassName: string;
  title: {
    text: string;
    highlight: string;
    highlightClassName: string;
  };
  description: string;
}

export function SectionHeader({ badgeText, badgeClassName, title, description }: IProps) {
  return (
    <div className="text-center mb-16">
      <Badge className={cn("mb-4 px-3 py-1 rounded-full", badgeClassName)}>
        {badgeText}
      </Badge>
      <h2 className="text-4xl lg:text-5xl font-bold mb-6">
        {title.text}
        {" "}
        <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", title.highlightClassName)}>{title.highlight}</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}
