"use client";

import { ReactNode } from "react";

interface IconProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Icon({ children, onClick, className }: IconProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-center transition rounded-full p-[1px] hover:bg-gray-200 ${className}`}
    >
      {children}
    </span>
  );
}
