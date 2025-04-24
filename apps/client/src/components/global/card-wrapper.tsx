import { useLayout } from "@/context";

import { Card } from "@/components/ui";

export function CardWrapper({ children }: { children: React.ReactNode }) {
  const { isGridLayout } = useLayout();

  return (
    <Card
      className={`overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg ${
        isGridLayout ? "hover:scale-105" : ""
      }`}
    >
      <div className={`${isGridLayout ? "" : "flex"}`}>{children}</div>
    </Card>
  );
}
