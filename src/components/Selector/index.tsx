import { Popover } from "../Popover";
import {
  DateObjectUnits,
  DateArray,
  MakeOptionalRequired,
  DatePickerOnChange,
  DatePickerType,
  SelectorColorsAndClassNames,
  YearRange,
  Locale,
} from "../../interface/general";
import { cn } from "../../utils";
import { SelectorOptionButton } from "../SelectorOptionButton";
import { SelectorTriggerButton } from "../SelectorTriggerButton";
import React, { SetStateAction, useState } from "react";
import { handleSelectorOptionClick } from "@rnwonder/simple-datejs/datePicker";

export interface SelectorProps extends SelectorColorsAndClassNames {
  option: number;
  setOption: React.Dispatch<SetStateAction<number>>;
  optionsArray?: string[];
  useValueAsName?: boolean;
  gridTemplateColumnsNo?: string;
  attributes?: Record<string, string>;
  className?: string;
  zIndex?: number;
  year?: number;

  minDate?: MakeOptionalRequired<DateObjectUnits>;
  maxDate?: MakeOptionalRequired<DateObjectUnits>;
  enabledDays?: DateArray[];
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onChange?: (data: DatePickerOnChange) => void;
  type?: DatePickerType;
  startDay?: DateObjectUnits;
  twoMonthsDisplay?: boolean;

  yearRange?: YearRange;
  yearArray?: string[][];
  handleNext?: () => void;
  handlePrev?: () => void;
  range?: string;
  startYear?: number | undefined;
  endYear?: number | undefined;
  count?: number;

  noButtonAnimation?: boolean;
  locale?: Locale;
}

export const Selector = React.forwardRef((props: SelectorProps, ref) => {
  const [open, setOpen] = useState(false);

  const handleSelected = (
    index: number,
    value: string,
    callback?: () => void,
  ) => {
    handleSelectorOptionClick(index, value, props, callback);
  };

  return (
    <Popover
      zIndex={props.zIndex}
      className={cn(
        "date-selector-trigger-wrapper rn-w-fit",
        props.monthYearTriggerBtnWrapperClass,
      )}
      onOpen={() => {
        setOpen(true);
        const selectedOption = document.querySelector(
          "[date-selector-option-selected=true]",
        );
        selectedOption?.scrollIntoView({
          block: "center",
          inline: "center",
        });
      }}
      onClose={() => setOpen(false)}
      content={({ close }) => (
        <div
          className={cn(
            `
            date-selector-wrapper
            rn-grid
            rn-max-h-[10.625rem]
            rn-max-w-[25rem]
            rn-gap-2
            rn-overflow-y-auto
            rn-rounded-lg
            rn-bg-white
            rn-p-2
            rn-drop-shadow-lg
            dark:rn-bg-eerie-black
          `,
            {
              "rn-grid-cols-3":
                props.gridTemplateColumnsNo === "3" &&
                props.gridTemplateColumnsNo,
              "rn-grid-cols-4":
                !props.gridTemplateColumnsNo ||
                (props.gridTemplateColumnsNo &&
                  props.gridTemplateColumnsNo !== "3"),
            },
            props.monthYearSelectorWrapperClass,
          )}
          ref={ref as never}
          data-part={"grid"}
          data-scope={"date-picker"}
          aria-roledescription={
            props.useValueAsName ? "calendar year" : "calendar month"
          }
          role={"grid"}
          aria-multiselectable={false}
          aria-readonly={false}
          aria-disabled={false}
          data-type={"date-selector-wrapper"}
          style={{
            ...(props.backgroundColor && {
              backgroundColor: props.backgroundColor,
            }),
          }}
        >
          {props.optionsArray?.map((value, index) => (
            <SelectorOptionButton
              {...props}
              handleOptionClick={handleSelected}
              value={value}
              index={index}
              callback={close}
              className={cn(
                `
                  date-selector-option
                  rn-px-[5px] 
                  rn-text-sm 
                  rn-text-black
                  disabled:rn-opacity-40
                  smallMobile:rn-text-[12px]
                `,
                props.className,
              )}
            />
          ))}
        </div>
      )}
    >
      <SelectorTriggerButton
        option={props.option}
        optionsArray={props.optionsArray}
        useValueAsName={props.useValueAsName}
        type={"compact-dropdown"}
        isOpen={open}
        twoMonthsDisplay={props.twoMonthsDisplay}
        noButtonAnimation={props.noButtonAnimation}
      />
    </Popover>
  );
});
