import { Plus } from "lucide-react";

import { PrimaryButton } from "../primary-btn";

interface IProps {
  title: string;
  description: string;
  buttonProps: {
    onClick: () => void;
    label: string;
  };
}

export function DashboardHeader({ title, description, buttonProps }: IProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>

        <PrimaryButton label={buttonProps.label} onClick={buttonProps.onClick} icon={Plus} />
      </div>
    </div>
  );
}
