import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../utils";

const ShadPopover = PopoverPrimitive.Root;

const ShadPopoverTrigger = PopoverPrimitive.Trigger;

const ShadPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
ShadPopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { ShadPopover, ShadPopoverTrigger, ShadPopoverContent };
