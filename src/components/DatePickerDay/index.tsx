import { Button } from "../Button";
import {
  ApplyDateRange,
  DateArray,
  DateObjectUnits,
  DatePickerDayClassNamesAndColors,
  HoverRangeValue,
} from "../../interface/general";
import { cn } from "../../utils";
import React, { useEffect, useRef, useState } from "react";
import Show from "../Helpers/Show.tsx";

interface DatePickerDayProps
  extends DatePickerDayClassNamesAndColors,
    Partial<ApplyDateRange> {
  header?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;

  disabledDays?: DateArray[];
  shouldHighlightWeekends?: boolean;
  onDisabledDayError?: (data: DateObjectUnits) => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  hoverRangeValue?: HoverRangeValue;
  wrapperProps?: DatePickerDayWrapperPropsProps;
  headerValue?: string;
  noButtonAnimation?: boolean;
  month?: number;
  year?: number;
  day?: number;
}

interface DatePickerDayWrapperPropsProps extends React.ComponentProps<"div"> {
  "data-scope": string;
  "data-type": string;
  "aria-label": string;
}

export const DatePickerDay: React.FC<DatePickerDayProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isNotSelected, setIsNotSelected] = useState(true);

  useEffect(() => {
    if (props.dayRangeStart || props.dayRangeEnd || props.isMultipleSelected) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }

    if (
      !props.dayRangeStart &&
      !props.dayRangeEnd &&
      !props.isMultipleSelected
    ) {
      setIsNotSelected(true);
    } else {
      setIsNotSelected(false);
    }
  }, [props.dayRangeEnd, props.dayRangeStart, props.isMultipleSelected]);

  useEffect(() => {
    if (!ref.current) return;

    if (props.secondaryColor) {
      document.documentElement.style.setProperty(
        "--date-picker-before-bg",
        props.secondaryColor,
      );
    }

    if (props.secondaryTextColor) {
      document.documentElement.style.setProperty(
        "--date-picker-before-color",
        props.secondaryTextColor,
      );
    }
  }, [props.secondaryColor, props.secondaryTextColor]);

  return (
    <div
      ref={ref}
      className={cn(
        `
        ${
          props.header
            ? `
            date-picker-weekday-name
            rn-block
            rn-text-[0.75rem]`
            : `
              date-picker-day-number-area
              rn-flex
              rn-items-center
              rn-justify-center
              rn-text-[0.9375rem]
            `
        }
        rn-relative
        
        rn-text-center
        rn-font-bold
        rn-uppercase
        rn-tracking-[0.02em]
        rn-text-[#909090]
        dark:rn-text-white
        ${props.hidden && "day-number-area-outside-days rn-pointer-events-none"}
        ${
          props.dayRangeBetween && !props.hidden
            ? `rn-bg-primary-focus rn-bg-opacity-50 dark:rn-bg-black-tie`
            : ""
        }
        before:rn-absolute
        before:rn-top-0
        before:rn-h-full
        before:rn-bg-opacity-50
        
        before:rn-content-[""] 
        ${
          (props.dayRangeStart && props.dayRangeStartEnd && !props.hidden) ||
          (props.dayRangeEnd && props.dayRangeStartEnd && !props.hidden)
            ? ""
            : "before:rn-hidden"
        }
        ${
          props.dayRangeStart &&
          props.dayRangeStartEnd &&
          "before:rn-left-[15%] before:rn-block before:rn-w-[86%] before:rn-rounded-l-full"
        }
        ${
          props.dayRangeEnd &&
          props.dayRangeStartEnd &&
          "before:rn-right-[15%] before:rn-block before:rn-w-[85%] before:rn-rounded-r-full"
        }
        ${isSelected && "date-picker-day-number-area-selected"}
        `,
        props.weekNamesClass,
        props.daysWrapperClass,
        {
          [props.daysActiveRangeStartWrapperClass || ""]: props.dayRangeStart,
          [props.daysActiveRangeEndWrapperClass || ""]: props.dayRangeEnd,
          [props.daysActivePrimaryWrapperClass || ""]: isSelected,
          [props.daysActiveRangeBetweenWrapperClass || ""]:
            props.dayRangeBetween,
        },
      )}
      aria-selected={isSelected}
      data-value={props.header ? props.headerValue : props.dateValue}
      data-day-number-area={!props.header}
      data-day-number-area-range-start-or-end={
        props.dayRangeStart || props.dayRangeEnd
      }
      data-day-number-area-range-between={props.dayRangeBetween}
      data-day-number-area-range-start={props.dayRangeStart}
      data-day-number-area-range-end={props.dayRangeEnd}
      data-day-number-area-current-day={props.daysCurrent}
      data-day-number-area-not-current-month={props.daysNotCurrentMonth}
      data-day-number-area-range-tip={
        (props.dayRangeStart && props.dayRangeStartEnd) ||
        (props.dayRangeEnd && props.dayRangeStartEnd)
      }
      data-day-number-area-range-tip-start={
        props.dayRangeStart && props.dayRangeStartEnd
      }
      data-day-number-area-range-tip-end={
        props.dayRangeEnd && props.dayRangeStartEnd
      }
      data-day-name={props.header}
      style={{
        ...(props.dayRangeBetween
          ? {
              "backgroundColor": props.secondaryColor,
            }
          : {}),
        ...(props.weekDaysNameColor && props.header
          ? {
              color: props.weekDaysNameColor,
            }
          : {}),
      }}
      onMouseEnter={props.onHover}
      onMouseLeave={props.onHoverEnd}
      {...props.wrapperProps}
    >
      <Show when={props.header && !props.hidden}>{props.children}</Show>

      <Show when={!props.header && !props.hidden}>
        <Button
          setHeight
          tabIndex={isSelected ? 0 : -1}
          className={cn(
            `
          date-picker-day-number
          rn-relative          
          rn-z-10
          rn-h-8
          
          rn-w-8
          rn-p-0
          rn-text-center
          rn-text-[0.9375rem]
          rn-transition-none
          
          ${
            props.daysNotCurrentMonth
              ? !props.dayRangeStart && !props.dayRangeEnd
                ? "day-number-not-current-month rn-opacity-50 dark:rn-text-white"
                : "rn-opacity-95"
              : "day-number-current-month rn-opacity-100"
          }

          ${props.dayRangeBetween && "hover:rn-bg-transparent dark:hover:rn-bg-black-tie"}
          ${
            props.shouldHighlightWeekends && props.isWeekend && isNotSelected
              ? "rn-text-red-500 dark:rn-text-red-500"
              : ""
          }
        ${
          isSelected
            ? "rn-bg-primary hover:rn-bg-primary dark:rn-bg-white dark:rn-text-black dark:hover:rn-bg-white"
            : props.daysCurrent
              ? "day-number-current-day rn-border rn-border-dashed rn-border-black hover:rn-border hover:rn-border-dashed hover:rn-border-black dark:rn-border-white"
              : ""
        }
        ${
          props.dayRangeStart || props.dayRangeEnd
            ? "day-number-range-start-or-end rn-text-white dark:rn-text-black"
            : props.isMultipleSelected
              ? "day-number-multiple-select rn-text-white dark:rn-text-black"
              : props.dayRangeBetween
                ? "day-range-between rn-text-black"
                : "rn-text-black"
        }
          rn-cursor-pointer
          rn-rounded-full
          disabled:rn-text-black
          disabled:rn-opacity-30
          `,
            {
              "dark:rn-text-white": isNotSelected,
            },
            props.daysBtnClass,
            props.customDayClass,
            {
              [props.daysActivePrimaryBtnClass || ""]: isSelected,
              [props.daysActiveRangeBetweenBtnClass || ""]:
                props.dayRangeBetween,
              [props.currentDayBtnClass || ""]: props.daysCurrent,
              [props.weekEndDaysBtnClass || ""]: props.isWeekend,
              [props.sundaysBtnClass || ""]: props.isSunday,
              [props.saturdaysBtnClass || ""]: props.isSaturday,
              [props.daysNotInCurrentMonthBtnClass || ""]:
                props.daysNotCurrentMonth,
              [props.daysActiveRangeStartBtnClass || ""]: props.dayRangeStart,
              [props.daysActiveRangeEndBtnClass || ""]: props.dayRangeEnd,
            },
          )}
          data-day-number={true}
          data-day-number-selected={isSelected}
          data-day-number-range-end-hover={props.dayRangeEndHover}
          data-day-number-range-end-selected={
            !props.dayRangeEndHover && isSelected
          }
          data-day-number-range-start-or-end={
            props.dayRangeStart || props.dayRangeEnd
          }
          data-day-number-range-between={props.dayRangeBetween}
          data-day-number-range-start={props.dayRangeStart}
          data-day-number-range-end={props.dayRangeEnd}
          data-day-number-current-day={props.daysCurrent}
          data-day-number-not-current-month={props.daysNotCurrentMonth}
          data-day-number-is-weekend={props.isWeekend}
          data-day-number-is-sunday={props.isSunday}
          data-day-number-is-saturday={props.isSaturday}
          data-day-number-is-multiple-selected={props.isMultipleSelected}
          data-scope={"date-picker"}
          data-highlight-weekend={props.shouldHighlightWeekends}
          data-part={"cell-trigger"}
          role={"button"}
          aria-label={"Choose " + props.date}
          data-value={props.dateValue}
          data-type={"day"}
          onClick={props.onClick}
          disabled={props.disabled}
          selected={isSelected}
          style={{
            ...(isSelected && (props.primaryColor || props.primaryTextColor)
              ? {
                  "backgroundColor": props.primaryColor,
                  color: props.primaryTextColor,
                }
              : {}),
            ...(props.dayRangeBetween
              ? { color: props.secondaryTextColor }
              : {}),
            ...((props.weekEndDayTextColor || props.weekEndDayBgColor) &&
            isNotSelected &&
            props.isWeekend
              ? {
                  color: props.weekEndDayTextColor,
                  "backgroundColor": props.weekEndDayBgColor,
                }
              : {}),
            ...(props.textColor && isNotSelected
              ? props.shouldHighlightWeekends && props.isWeekend
                ? {}
                : { color: props.textColor }
              : {}),
          }}
          noButtonAnimation={props.noButtonAnimation}
        >
          {props.children}
        </Button>

        <Show when={props.disabled}>
          <div
            onClick={() =>
              props.onDisabledDayError?.({
                day: props.day,
                month: props.month,
                year: props.year,
              })
            }
            className="rn-absolute rn-left-0 rn-top-0 rn-h-full rn-w-full rn-rounded-full"
          />
        </Show>
      </Show>
    </div>
  );
};
