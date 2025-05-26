import { useUIStore } from "@/stores";

import { Card } from "@/components/ui";

export function CardWrapper({ children }: { children: React.ReactNode }) {
  const { layout } = useUIStore();

  return (
    <Card
      className={`overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-lg ${
        layout.isGridLayout ? "hover:scale-105" : ""
      }`}
    >
      <div className={`${layout.isGridLayout ? "" : "flex"}`}>{children}</div>
    </Card>
  );
}
