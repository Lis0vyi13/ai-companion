"use client";

import { useState } from "react";

export interface TextInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function Input({
  onSend,
  disabled = false,
  placeholder = "Send message...",
}: TextInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex w-full max-w-3xl mt-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-grow px-4 py-2 rounded-l-md bg-zinc-800 text-white border border-zinc-700 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Надіслати
      </button>
    </div>
  );
}
