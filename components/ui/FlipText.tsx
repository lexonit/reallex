
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const FlipText = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words.length]);

  return (
    <div className="inline-flex justify-center items-center relative gap-2 [perspective:1000px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={words[index]}
          initial={{
            opacity: 0,
            rotateX: -90,
            y: 20,
          }}
          animate={{
            opacity: 1,
            rotateX: 0,
            y: 0,
          }}
          exit={{
            opacity: 0,
            rotateX: 90,
            y: -20,
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className={cn("origin-center whitespace-nowrap", className)}
        >
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
