"use client";

import { useState } from "react";
import Icon from "./Icon";
import { cn } from "@/lib/utils";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSend?: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export default function Input({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
  iconBefore,
  iconAfter,
  ref,
  ...props
}: TextInputProps) {
  const [value, setValue] = useState("");

  const baseInputStyles = cn(
    "w-full px-4 py-2.5 text-sm bg-primary/50 rounded-xl text-secondary outline-none shadow-sm focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition",
    props.className,
  );

  const paddingStyles = cn({
    "pl-[3.2rem]": iconBefore,
    "pr-[3.2rem]": iconAfter,
    "pl-4": !iconBefore,
    "pr-4": !iconAfter,
  });

  const handleSubmit = () => {
    if (onSend && value.trim() && !disabled) {
      onSend(value.trim());
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
      {iconBefore && (
        <Icon className="absolute text-icon left-0 top-1/2 transform -translate-y-1/2">
          {iconBefore}
        </Icon>
      )}
      {iconAfter && (
        <Icon
          className="absolute text-icon right-0 top-1/2 transform -translate-y-1/2"
          onClick={handleSubmit}
        >
          {iconAfter}
        </Icon>
      )}
      <input
        {...props}
        type="text"
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(baseInputStyles, paddingStyles)}
      />
    </div>
  );
}
