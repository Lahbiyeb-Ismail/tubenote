import { FileText, Plus, Search, Share } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function QuickActions() {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Add New Video
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <FileText className="h-4 w-4" />
          Create Note
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <Search className="h-4 w-4" />
          Search Library
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <Share className="h-4 w-4" />
          Share Notes
        </Button>
      </CardContent>
    </Card>
  );
}
