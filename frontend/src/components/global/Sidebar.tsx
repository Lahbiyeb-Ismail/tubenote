"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarOptions } from "@/utils/constants";
import clsx from "clsx";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Sidebar() {
  const pathName = usePathname();

  return (
    <nav className="flex h-screen w-[10%] flex-col justify-between gap-10 border-r border-gray-300 px-8 py-6 dark:bg-black">
      <div className="flex flex-col justify-center gap-8">
        <Link className="flex flex-row font-bold" href="/">
          TubeNote
        </Link>

        <TooltipProvider>
          {sidebarOptions.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        "group flex size-8 scale-150 cursor-pointer items-center  justify-center rounded-lg p-[3px]",
                        {
                          "dark:bg-[#2F006B] bg-[#EEE0FF] ":
                            pathName === menuItem.href,
                        }
                      )}
                    >
                      <menuItem.Component
                      // selected={pathName === menuItem.href}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>

                <TooltipContent
                  side="right"
                  className="bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
      </div>
    </nav>
  );
}

export default Sidebar;
