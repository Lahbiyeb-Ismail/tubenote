import { Button } from "@/components/ui/button";
import { PrinterIcon, ShareIcon } from "lucide-react";

function NotePageFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <a href="/notes">← Back to Notes</a>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <span className="sr-only">Share note</span>
              <ShareIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <span className="sr-only">Print note</span>
              <PrinterIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default NotePageFooter;
