import { DatePickerTopProps } from "../DatePickerTop";
import { MonthSelector } from "../MonthSelector";
import { YearSelector } from "../YearSelector";
import { cn } from "../../utils";
import React, { useEffect, useRef } from "react";
import Show from "../Helpers/Show.tsx";

interface DatePickerMonthAndYearSelectorProps
  extends Omit<DatePickerTopProps, "handlePrevMonth" | "handleNextMonth"> {}

export const DatePickerMonthAndYearSelector: React.FC<
  DatePickerMonthAndYearSelectorProps
> = (props) => {
  const monthSelectorRef = useRef<HTMLDivElement>(null);
  const yearSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!monthSelectorRef.current) return;
    props.setAllowedComponents?.((prev) => {
      return [...prev, monthSelectorRef.current!];
    });
  }, [monthSelectorRef, props.setAllowedComponents]);

  useEffect(() => {
    if (!yearSelectorRef.current) return;
    props.setAllowedComponents?.((prev) => [...prev, yearSelectorRef.current!]);
  }, [props.setAllowedComponents, yearSelectorRef]);

  return (
    <div
      className={cn(
        `date-month-year-selector-area rn-flex rn-items-center rn-justify-center ${
          props.monthYearSelectorFlexDirection === "column" ? "rn-flex-col" : ""
        }`,
        props.datePickerTopMonthYearAreaClass,
      )}
      data-type={"date-month-year-selector-area"}
    >
      <Show when={props.render}>
        <Show when={!!props.monthSelectorJSX}>{props.monthSelectorJSX}</Show>
        <Show when={!props.monthSelectorJSX}>
          <MonthSelector
            {...props}
            ref={monthSelectorRef}
            month={props.month}
            setMonth={props.setMonth}
            monthSelectorFormat={props.monthSelectorFormat}
            zIndex={props.zIndex}
            locale={props.locale}
            primaryColor={props.primaryColor}
            primaryTextColor={props.primaryTextColor}
            minDate={props.minDate}
            maxDate={props.maxDate}
            twoMonthsDisplay={props.twoMonthsDisplay}
          />
        </Show>
        <Show when={!!props.yearSelectorJSX}>{props.yearSelectorJSX}</Show>
        <Show when={!props.yearSelectorJSX}>
          <YearSelector
            {...props}
            ref={yearSelectorRef}
            year={props.year}
            setYear={props.setYear}
            zIndex={props.zIndex}
            yearRange={props.yearRange}
            primaryColor={props.primaryColor}
            primaryTextColor={props.primaryTextColor}
            minDate={props.minDate}
            maxDate={props.maxDate}
          />
        </Show>
      </Show>
    </div>
  );
};
