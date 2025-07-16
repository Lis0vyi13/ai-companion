"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import Icon from "../Icon";

export interface TextInputProps {
  onSubmit?: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export default function Input({
  onSubmit,
  disabled = false,
  placeholder = "Type your message...",
  prefix,
  suffix,
}: TextInputProps) {
  const [value, setValue] = useState("");

  const baseInputStyles =
    "w-full px-4 py-2.5 text-sm rounded-xl bg-primary text-secondary outline-none shadow-sm focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition";

  const paddingStyles = cn({
    "pl-12": prefix,
    "pr-12": suffix,
    "pl-4": !prefix,
    "pr-4": !suffix,
  });

  const handleSubmit = () => {
    if (onSubmit && value.trim() && !disabled) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full">
      {prefix && (
        <Icon className="absolute text-icon left-3 top-1/2 transform -translate-y-1/2">
          {prefix}
        </Icon>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(baseInputStyles, paddingStyles)}
      />
      {suffix && (
        <Icon
          className="absolute text-icon -right-1 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={handleSubmit}
        >
          {suffix}
        </Icon>
      )}
    </div>
  );
}
