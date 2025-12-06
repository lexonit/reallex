import { cn } from "../../lib/utils";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // auto-rows-auto for mobile so content dictates height, fixed 18rem for desktop grid alignment
        "grid auto-rows-auto md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none bg-white dark:bg-black border border-neutral-200 dark:border-white/[0.1] flex flex-col space-y-4",
        // If no title/desc is provided, remove padding to allow header to fill container
        (!title && !description) ? "p-0 border-none bg-transparent" : "p-4 justify-between",
        className
      )}
    >
      <div className={cn(
        "flex-1 w-full h-full rounded-xl overflow-hidden relative",
        // Add border if it's a standard bento item, remove if it's a custom widget (assumes widget has its own border)
        (title || description) && "border border-neutral-100 dark:border-white/[0.1]"
      )}>
          {header}
      </div>
      
      {(title || description) && (
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          <div className="flex items-center gap-2">
              {icon}
              <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200">
              {title}
              </div>
          </div>
          <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300 mt-2">
            {description}
          </div>
        </div>
      )}
    </div>
  );
};