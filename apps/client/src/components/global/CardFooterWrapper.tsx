import { cn } from "@/lib/utils";

import { CardFooter } from "@/components/ui/card";

import { useLayout } from "@/context/useLayout";

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

function CardFooterWrapper({ children, className }: CardFooterProps) {
  const { isGridLayout } = useLayout();
  return (
    <CardFooter
      className={cn(
        `flex justify-between ${
          isGridLayout ? "flex-row p-4 pt-4" : "flex-col p-4 space-y-1"
        }`,
        className
      )}
    >
      {children}
    </CardFooter>
  );
}

export default CardFooterWrapper;
