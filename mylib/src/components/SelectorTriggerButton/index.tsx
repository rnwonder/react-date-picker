import { Button } from "../Button";
import { cn } from "../../utils";
import { SelectorProps } from "../Selector";
import { SelectorType } from "../../interface/general";
import React from "react";

interface Props
  extends Pick<
      SelectorProps,
      | "monthYearTriggerBtnClass"
      | "useValueAsName"
      | "textColor"
      | "option"
      | "twoMonthsDisplay"
      | "optionsArray"
    >,
    Omit<React.ComponentProps<"button">, "type"> {
  isOpen: boolean;
  type: SelectorType;
  noButtonAnimation?: boolean;
}

export const SelectorTriggerButton = ({
  noButtonAnimation,
  monthYearTriggerBtnClass,
  twoMonthsDisplay,
  type,
  isOpen,
  option,
  optionsArray,
  useValueAsName,
  textColor,
  children,
  ...props
}: Props) => {
  return (
    <Button
      {...props}
      className={cn(
        `
        date-selector-trigger
        rn-animate-none
        rn-p-[5px]
        rn-text-[15px]
        rn-font-bold
        
        rn-text-black
        dark:rn-text-white
        
        breakTwoCalendar:rn-text-sm`,
        monthYearTriggerBtnClass,
      )}
      aria-haspopup={type === "compact-dropdown"}
      aria-label={useValueAsName ? "Select a year" : "Select a month"}
      data-scope={"button"}
      data-part={"root"}
      aria-expanded={isOpen}
      data-type={"date-selector-trigger"}
      style={{
        ...(textColor && { color: textColor }),
      }}
      noButtonAnimation={noButtonAnimation}
    >
      {children ||
        (useValueAsName
          ? option
          : twoMonthsDisplay
            ? `${optionsArray?.[option]} - ${
                option === 11 ? optionsArray?.[0] : optionsArray?.[option + 1]
              }`
            : optionsArray?.[option])}
    </Button>
  );
};
