"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Youtube } from "lucide-react";
import Link from "next/link";

type NotePageHeaderProps = {
  noteId: string;
  noteTitle: string;
  onToggleVideo: () => void;
  isVideoVisible: boolean;
};

function NotePageHeader({
  noteId,
  noteTitle,
  onToggleVideo,
  isVideoVisible,
}: NotePageHeaderProps) {
  return (
    <header className="border-b bg-muted/40 dark:from-gray-800 dark:to-gray-900">
      <div className="container py-4 px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/notes"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Notes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/notes/${noteId}`}
                  className="font-semibold text-gray-800 dark:text-gray-200"
                >
                  {noteTitle}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-gray-500 transition-all duration-300 shadow-sm hover:shadow"
            >
              <Link href={`/editor/update/${noteId}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Note
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="video-toggle"
                checked={isVideoVisible}
                onCheckedChange={onToggleVideo}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700"
              />
              <Label
                htmlFor="video-toggle"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
              >
                {isVideoVisible ? "Hide Video" : "Show Video"}
              </Label>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NotePageHeader;
