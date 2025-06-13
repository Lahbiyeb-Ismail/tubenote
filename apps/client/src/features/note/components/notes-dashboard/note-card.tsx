import type { Note } from "@tubenote/db";

import {
  Archive,
  Clock,
  Edit,
  Eye,
  Heart,
  MoreVertical,
  Pin,
  Star,
  Tag,
  Trash2,
  Video,
  Youtube,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IProps {
  note: Note;
}

export function NoteCard({ note }: IProps) {
  const getRandomBorderColor = () => {
    const colors = [
      "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
      "border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20",
      "border-l-green-500 bg-green-50/50 dark:bg-green-950/20",
      "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
      "border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
      "border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20",
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${getRandomBorderColor()}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* <Checkbox
              checked={selectedNotes.includes(note.id)}
              onCheckedChange={() => handleSelectNote(note.id)}
              className="mt-1"
            /> */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {note.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
                {note.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                {note.isArchived && <Archive className="h-4 w-4 text-slate-500" />}
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {note.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                {note.category
                  ? (
                      <Badge variant="outline" className="text-xs">
                        {note.category}
                      </Badge>
                    )
                  : null}
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {note.timestamp.start}
                  {" "}
                  -
                  {" "}
                  {note.timestamp.end}
                </div>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="mr-2 h-4 w-4" />
                {note.isPinned ? "Unpin" : "Pin"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                {note.isArchived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {note.content}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Youtube className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium truncate">{note.videoTitle}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {note.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="mr-1 h-2 w-2" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Created:
              {" "}
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Video className="mr-1 h-3 w-3" />
                Jump to
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
