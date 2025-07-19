"use client";

import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

const Sidebar = () => {
  return (
    <div className="w-[5.5rem] h-full relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#fefefe] to-[#e8eaf9]" />
      <div className="relative h-full flex flex-col items-center justify-end text-black p-4 font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto rounded-full">
              <div className="relative w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer">
                <span className="text-white">AIC</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
