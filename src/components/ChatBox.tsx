"use client";

import { useEffect, useRef } from "react";
import Message from "./Message";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

type MessageType = {
  role: "user" | "system" | "assistant";
  content: string;
};

interface ChatBoxProps {
  messages: MessageType[];
  loading: boolean;
}

export default function ChatBox({ messages, loading }: ChatBoxProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Message role={msg.role} content={msg.content} />
          </motion.div>
        ))}
      </AnimatePresence>

      {loading && (
        <div className="text-left">
          <Loader2 className="animate-spin text-gray-400" size={20} />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
