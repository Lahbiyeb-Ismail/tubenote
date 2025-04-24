"use client";

import { LayoutGrid, List, Search } from "lucide-react";

import { useLayout } from "@/context";

import { Button } from "@/components/ui";

export function Header({ title }: { title: string }) {
  const { toggleLayout, isGridLayout } = useLayout();

  return (
    <header className="bg-white px-4 py-6 shadow sm:px-6 lg:px-8 flex flex-row items-center justify-between gap-4">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <form className="flex w-full max-w-sm items-center space-x-2">
        <Search className="text-gray-400 mr-2" />
        <input
          type="search"
          placeholder="Search"
          className="flex-grow outline-none"
        />
      </form>
      {!isGridLayout ? (
        <Button
          aria-label="Switch to row layout"
          className="bg-blue-500 text-white px-3 py-1 rounded-l-md"
          onClick={toggleLayout}
        >
          <LayoutGrid size={18} />
        </Button>
      ) : (
        <Button
          aria-label="Switch to column layout"
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded-r-md"
          onClick={toggleLayout}
        >
          <List size={18} />
        </Button>
      )}
    </header>
  );
}
