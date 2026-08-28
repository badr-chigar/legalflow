import * as React from "react";

import { cn } from "@/lib/utils";

/** Label au-dessus du champ (§5). */
export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-xs font-medium text-ink",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";
