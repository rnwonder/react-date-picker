import { DatePickerMonthAndYearSelector } from "../DatePickerMonthAndYearSelector";
import { Button } from "../Button";
import {
  IMonthSelectorType,
  IMonthYearSelectorFlexDirection,
  YearRange,
  Locale,
  RnColor,
  MakeOptionalRequired,
  DateObjectUnits,
  DateArray,
  RnClassName,
  DatePickerOnChange,
  DatePickerType,
} from "../../interface/general";
import { PrevIcon } from "../PrevIcon";
import { NextIcon } from "../NextIcon";

import { cn } from "../../utils";
import { SelectorProps } from "../Selector";
import React, { SetStateAction, useCallback } from "react";
import {
  getRefactoredNextDate,
  getRefactoredPrevDate,
  isNotPartOfEnabledDays,
} from "@rnwonder/simple-datejs/datePicker";
import Show from "../Helpers/Show.tsx";

export interface DatePickerTopProps extends RnColor, RnClassName {
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  setMonth: React.Dispatch<SetStateAction<number>>;
  setYear: React.Dispatch<SetStateAction<number>>;
  month: number;
  year: number;
  render: boolean;
  setShowSelectorTwo?: React.Dispatch<SetStateAction<boolean>>;
  setSelectorTwoProps?: React.Dispatch<SetStateAction<SelectorProps>>;
  showSelectorTwo?: boolean;
  monthSelectorJSX?: React.ReactNode;
  yearSelectorJSX?: React.ReactNode;
  monthYearSelectorJSX?: React.ReactNode;
  zIndex?: number;
  setAllowedComponents?: React.Dispatch<SetStateAction<HTMLElement[]>>;
  monthSelectorFormat?: IMonthSelectorType;
  monthYearSelectorFlexDirection?: IMonthYearSelectorFlexDirection;
  yearRange?: YearRange;
  locale?: Locale;
  nextIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;
  removeNavButtons?: boolean;
  nextButtonAreaJSX?: React.ReactNode;
  prevButtonAreaJSX?: React.ReactNode;
  minDate?: MakeOptionalRequired<DateObjectUnits>;
  maxDate?: MakeOptionalRequired<DateObjectUnits>;
  enabledDays?: DateArray[];
  onMonthChange?: (month: number) => void;
  onChange?: (data: DatePickerOnChange) => void;
  twoMonthsDisplay?: boolean;
  type: DatePickerType;
  startDay?: DateObjectUnits;
  setStartDay: React.Dispatch<SetStateAction<DateObjectUnits | undefined>>;
  noButtonAnimation?: boolean;
  yearSelectorCount: number;
}

export const DatePickerTop: React.FC<DatePickerTopProps> = (props) => {
  const isPrevButtonDisabled = useCallback(() => {
    if (!props.minDate && !props.enabledDays) return false;
    if (props.minDate) {
      if (props.year < props.minDate.year) return true;
      if (props.year === props.minDate.year) {
        if (props.month - 1 < props.minDate.month) return true;
      }
    }
    const { month, year } = getRefactoredPrevDate(props.year, props.month);
    return isNotPartOfEnabledDays({
      enabledDays: props.enabledDays,
      year,
      month,
      prev: true,
    });
  }, [props.minDate, props.enabledDays, props.year, props.month]);

  const isNextButtonDisabled = useCallback(() => {
    if (!props.maxDate && !props.enabledDays) return false;
    if (props.maxDate) {
      if (props.year > props.maxDate.year) return true;
      if (props.year === props.maxDate.year) {
        if (props.month + 1 > props.maxDate.month) return true;
      }
    }
    const { year, month } = getRefactoredNextDate(props.year, props.month);
    return isNotPartOfEnabledDays({
      enabledDays: props.enabledDays,
      year,
      month,
      next: true,
    });
  }, [props.enabledDays, props.maxDate, props.month, props.year]);
  return (
    <div
      className={cn(
        `
        date-picker-top 
        rn-mb-[0.3125rem] 
        rn-flex 
        rn-items-center 
        rn-justify-between 
        rn-px-2
      `,
        props.datePickerTopAreaClass,
      )}
      data-type={"date-picker-top"}
    >
      <Show when={!!props.prevButtonAreaJSX}>{props.prevButtonAreaJSX}</Show>

      <Show when={!props.removeNavButtons}>
        <Button
          className={cn(
            "date-prev-next-btn date-prev-btn rn-text-black disabled:rn-opacity-10 dark:rn-text-white",
            props.prevMonthBtnClass,
            props.prevNextMonthBtnClass,
          )}
          data-prev={true}
          data-type={"date-prev-next-btn"}
          aria-label={"Move backward to switch to the previous month"}
          data-scope={"button"}
          data-part={"root"}
          disabled={isPrevButtonDisabled()}
          onClick={props.handlePrevMonth}
          style={{
            ...(props.arrowsColor && { color: props.arrowsColor }),
          }}
          noButtonAnimation={props.noButtonAnimation}
        >
          {props.prevIcon || <PrevIcon color={props.arrowsColor} />}
        </Button>
      </Show>

      <Show when={!!props.monthYearSelectorJSX}>
        {props.monthYearSelectorJSX}
      </Show>

      <Show when={!props.monthYearSelectorJSX}>
        <DatePickerMonthAndYearSelector
          {...{ ...props, startDay: undefined }}
        />
      </Show>

      <Show when={!props.removeNavButtons}>
        <Button
          className={cn(
            "date-prev-next-btn date-next-btn rn-text-black disabled:rn-opacity-10 dark:rn-text-white",
            props.nextMonthBtnClass,
            props.prevNextMonthBtnClass,
          )}
          data-next={true}
          aria-label={"Move forward to switch to the next month."}
          data-scope={"button"}
          data-part={"root"}
          data-type={"date-prev-next-btn"}
          onClick={props.handleNextMonth}
          disabled={isNextButtonDisabled()}
          style={{
            ...(props.arrowsColor && { color: props.arrowsColor }),
          }}
          noButtonAnimation={props.noButtonAnimation}
        >
          {props.nextIcon || <NextIcon color={props.arrowsColor} />}
        </Button>
      </Show>

      <Show when={!!props.nextButtonAreaJSX}>{props.nextButtonAreaJSX}</Show>
    </div>
  );
};
