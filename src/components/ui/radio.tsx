import * as React from "react";
import { cn } from "../lib/utils";

const Radio = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={cn(
          "h-4 w-4 rounded-full border border-input bg-transparent text-primary focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Radio.displayName = "Radio";

export { Radio };
