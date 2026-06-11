import * as React from "react";

import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "h-6 w-6 shrink-0 cursor-pointer rounded-lg border border-slate-300 bg-white accent-accent shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 md:h-7 md:w-7",
      className
    )}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";
