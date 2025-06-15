"use client";

import { Hash, Save, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDialogStore } from "@/stores";

const categories = [
  "Education",
  "Technology",
  "Science",
  "Business",
  "Entertainment",
  "Health",
  "Travel",
  "Cooking",
  "Music",
  "Sports",
  "Art",
  "Other",
];

interface IProps {
  onSaveNote: (title: string, category: string, tags: string[]) => void;
  isSaving: boolean;
  noteTitle?: string;
  noteTags?: string[];
  noteCategory?: string;
}

export function SaveNoteDialog({ onSaveNote, isSaving, noteTitle, noteTags, noteCategory }: IProps) {
  const { type, isOpen, closeDialog } = useDialogStore();

  const [title, setTitle] = useState(noteTitle || "");
  const [category, setCategory] = useState(noteCategory || "");
  const [tags, setTags] = useState<string[]>(noteTags || []);
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const addTagOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }
    onSaveNote(title, category, tags);
    closeDialog();
  };

  const open = isOpen && type === "save-note";

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <span>Save Note</span>
          </DialogTitle>
          <DialogDescription>
            Add details to organize and save your note with video timestamps.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={addTagOnEnter}
                  placeholder="Add tags..."
                  className="w-full"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!currentTag.trim()}
              >
                <Hash className="h-4 w-4" />
              </Button>
            </div>

            {/* Display Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
