import { Download, Plus } from "lucide-react";

import { Button } from "../ui";

interface IProps {
  title: string;
  description: string;
}

export function DashboardHeader({ title, description }: IProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
}
