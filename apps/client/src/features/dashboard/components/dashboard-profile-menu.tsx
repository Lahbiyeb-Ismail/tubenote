import { Search } from "lucide-react";
import { Fragment } from "react";

import { UserProfileMenu } from "@/components";
import { Input } from "@/components/ui";

export function DashboardProfileMenu() {
  return (
    <Fragment>
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Search videos, notes..." className="pl-10 w-64" />
      </div>
      <UserProfileMenu />
    </Fragment>
  );
}
