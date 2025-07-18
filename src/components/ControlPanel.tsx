"use client";

import { useState, useRef } from "react";
import { PanelRight } from "lucide-react";
import Icon from "./ui/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import type { Variants } from "framer-motion";
import Avatar from "./Avatar";

const variants: Variants = {
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
  closed: {
    x: "100%",
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
};

const ControlPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const firstRender = useRef(true);

  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            initial={firstRender.current ? false : "closed"}
            animate="open"
            exit="closed"
            variants={variants}
            className={cn("fixed top-0 right-0 bottom-0 w-[300px] z-10", "overflow-hidden")}
            onAnimationComplete={() => {
              if (firstRender.current) firstRender.current = false;
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#fefefe] to-[#e8eaf9] z-0" />
            <div className="relative z-10 h-full flex flex-col items-center justify-between text-black p-4 font-medium">
              <div className="flex items-center justify-center gap-2 w-full relative">
                <h2 className="text-sm text-heading-gray font-bold">AI Companion v1.0</h2>
                <Icon>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-0 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <PanelRight className="-scale-x-100" />
                  </motion.div>
                </Icon>
              </div>
              <Avatar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          key="icon"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          onClick={() => setIsOpen(true)}
          className="absolute top-2 right-2 z-10 text-black bg-white shadow-lg rounded-full p-2 cursor-pointer hover:bg-gray-200 transition"
        >
          <PanelRight />
        </motion.div>
      )}
    </>
  );
};

export default ControlPanel;
