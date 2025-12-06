
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item.link}
          key={item.link + idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-black border border-neutral-200 dark:border-white/[0.2] group-hover:border-primary dark:group-hover:border-slate-700 relative z-20 transition-colors flex flex-col justify-between shadow-sm dark:shadow-none">
            <div className="relative z-50">
              <div className="p-4">
                <div className="mb-4 text-primary">{item.icon}</div>
                <h4 className="text-neutral-900 dark:text-zinc-100 font-bold tracking-wide mt-4">
                  {item.title}
                </h4>
                <p className="mt-8 text-neutral-600 dark:text-zinc-400 tracking-wide leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="p-4 pt-0 mt-auto relative z-50">
               <span className="text-sm font-bold text-neutral-900 dark:text-zinc-100 flex items-center mt-2 border border-neutral-300 dark:border-zinc-700 w-fit px-4 py-2 rounded-full group-hover:bg-neutral-100 dark:group-hover:bg-zinc-800 transition-colors">
                 Learn more <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
               </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
