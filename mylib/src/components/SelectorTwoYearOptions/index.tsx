import { SelectorProps } from "../Selector";
import { cn } from "../../utils";
import { SelectorOptionButton } from "../SelectorOptionButton";
import React from "react";
interface SelectorTwoYearOptionsProps extends Partial<SelectorProps> {
  array: string[];
  handleOptionClick: (
    index: number,
    value: string,
    callback?: () => void,
  ) => void;
}

function SelectorTwoYearOptions(props: SelectorTwoYearOptionsProps) {
  return (
    <div
      className={cn(
        `
        date-year-full-size-selector-options 
        rn-grid 
        rn-grid-cols-4
        rn-gap-x-1
      `,
      )}
    >
      {props.array.map((value, index) => {
        return (
          <SelectorOptionButton
            {...props}
            value={value}
            index={index}
            key={index + value}
            className={cn(
              `
              rn-p-2 
              rn-text-[0.9375rem]
            `,
              {
                "disabled:rn-bg-transparent": !value,
              },
              props.className,
            )}
            disabled={!value}
            attributes={{
              ...(!value
                ? { "data-selector-type": "selector-option-out-of-range" }
                : {}),
            }}
          />
        );
      })}
    </div>
  );
}

export default SelectorTwoYearOptions;
