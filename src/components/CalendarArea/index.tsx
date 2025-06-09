import { CalendarDays, CalendarDaysProps } from "../CalendarDays";
import { WeekDays } from "../WeekDays";
import { RnClassName, Locale, WeekDaysType } from "../../interface/general";
import { cn } from "../../utils";
import React, { useEffect, useState } from "react";
import Show from "../Helpers/Show.tsx";

export interface CalendarAreaProps
  extends CalendarDaysProps,
    Pick<
      RnClassName,
      | "calendarWrapperClass"
      | "calendarDividerClass"
      | "calendarOneAreaClass"
      | "calendarTwoAreaClass"
    > {
  locale?: Locale;
  weekDaysJSX?: React.ReactNode;
  weekDaysType?: WeekDaysType;
}
export const CalendarArea: React.FC<CalendarAreaProps> = (props) => {
  const [nextYear, setNextYear] = useState(0);
  const [nextMonth, setNextMonth] = useState(0);

  useEffect(() => {
    if (props.month === 0) {
      /* empty */
    } else if (props.month === 11) {
      setNextYear(props.year + 1);
      setNextMonth(0);
    } else {
      setNextYear(props.year);
      setNextMonth(props.month + 1);
    }
  }, [props.month, props.year]);

  return (
    <div
      className={cn(
        "date-picker-calendar-wrapper rn-flex rn-min-w-max breakTwoCalendar:rn-flex-col",
        props.calendarWrapperClass,
      )}
    >
      <div
        className={cn(
          "date-picker-calendar-area-one",
          {
            "rn-px-4": !props.twoMonthsDisplay,
            "breakTwoCalendar:rn-px-4 aboveBreakTwoCalendar:rn-pl-4":
              props.twoMonthsDisplay,
          },
          props.calendarOneAreaClass,
        )}
        data-scope={"date-picker"}
        data-part={"grid"}
        role={"grid"}
        data-columns={7}
        aria-roledescription={"calendar month"}
        tabIndex={-1}
      >
        {props.weekDaysJSX || (
          <WeekDays
            {...props}
            weekDaysNameColor={props.weekDaysNameColor}
            weekDaysType={props.weekDaysType}
            locale={props.locale}
            weekStartDay={props.weekStartDay}
          />
        )}
        <CalendarDays {...props} />
      </div>

      <Show when={props.twoMonthsDisplay}>
        <div
          className={cn(
            "date-picker-calendar-area-divider rn-divider aboveBreakTwoCalendar:rn-divider-horizontal aboveBreakTwoCalendar:rn-mx-2 aboveBreakTwoCalendar:rn-w-fit ",
            props.calendarDividerClass,
          )}
        />
        <div
          className={cn(
            "date-picker-calendar-area-two",
            {
              "breakTwoCalendar:rn-px-4 aboveBreakTwoCalendar:rn-pr-4":
                props.twoMonthsDisplay,
            },
            props.calendarTwoAreaClass,
          )}
        >
          {props.weekDaysJSX || (
            <WeekDays
              {...props}
              weekDaysNameColor={props.weekDaysNameColor}
              weekDaysType={props.weekDaysType}
              locale={props.locale}
              weekStartDay={props.weekStartDay}
            />
          )}
          <CalendarDays
            {...props}
            month={nextMonth}
            year={nextYear}
            nextMonth
          />
        </div>
      </Show>
    </div>
  );
};
