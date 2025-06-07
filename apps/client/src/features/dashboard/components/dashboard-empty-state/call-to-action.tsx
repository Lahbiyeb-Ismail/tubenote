import { ArrowRight, FileText, Upload } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Ready to get started?</h2>
        <p className="text-muted-foreground">
          Choose how you'd like to begin your note-taking journey.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/notes">
          <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <FileText className="h-5 w-5 mr-2" />
            Create Your First Note
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>

        <Button variant="outline" className="px-8 py-3 text-lg border-2 hover:bg-accent">
          <Upload className="h-5 w-5 mr-2" />
          Upload a Video
        </Button>
      </div>
    </div>
  );
}
