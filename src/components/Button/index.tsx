import { cn } from "../../utils";
import React from "react";

interface ButtonProps extends React.ComponentProps<"button"> {
  setHeight?: boolean;
  disabled?: boolean;
  selected?: boolean;
  noButtonAnimation?: boolean;
  tabIndex?: number;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  setHeight,
  selected,
  noButtonAnimation,
  children,
  className,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        `
        date-picker-main-btn 
        rn-btn 
        rn-btn-ghost 
        rn-min-h-0 
        rn-p-0
        motion-reduce:rn-no-animation
        motion-reduce:rn-transition-none
        `,
        {
          "rn-no-animation": noButtonAnimation,
          "rn-h-full": !setHeight,
          "dark:hover:rn-bg-black-tie": !selected,
        },
        className,
      )}
      data-type={"date-picker-main-btn"}
      type={"button"}
    >
      {children}
    </button>
  );
});
