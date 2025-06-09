import { DatePickerDay } from "../DatePickerDay";
import { DatePickerWeek } from "../DatePickerWeek";
import {
  DateObjectUnits,
  DateArray,
  MakeOptionalRequired,
  CustomDaysClassName,
  HandleDayClick,
  HoverRangeValue,
  CalendarDaysClassNamesAndColors,
  MonthDaysObject,
  Locale,
} from "../../interface/general";
import { cn, convertFormattedNumberBackToNumber } from "../../utils";
import { useDaysArray } from "../../hooks/useDaysArray.ts";
import React from "react";
import { applyDateRangeProps } from "@rnwonder/simple-datejs/datePicker";

export interface CalendarDaysProps extends CalendarDaysClassNamesAndColors {
  month: number;
  year: number;
  handleDayClick: HandleDayClick;
  startDay: DateObjectUnits | undefined;
  endDay: DateObjectUnits | undefined;

  minDate?: MakeOptionalRequired<DateObjectUnits>;
  maxDate?: MakeOptionalRequired<DateObjectUnits>;
  disabledDays?: DateArray[];
  enabledDays?: DateArray[];
  customDaysClassName?: CustomDaysClassName[];
  multipleObject: DateObjectUnits[];
  shouldHighlightWeekends?: boolean;
  onDisabledDayError?: (data: DateObjectUnits) => void;
  hideOutSideDays?: boolean;

  nextMonth?: boolean;
  twoMonthsDisplay?: boolean;
  onHoverDay: HandleDayClick;
  onHoverDayEnd: HandleDayClick;
  hoverRangeValue: HoverRangeValue;

  weekStartDay?: number;

  showSelectorTwo?: boolean;

  dayRowsArray: Array<Array<MonthDaysObject>>;
  setDayRowsArray: React.Dispatch<
    React.SetStateAction<Array<Array<MonthDaysObject>>>
  >;
  locale?: Locale;
}
export const CalendarDays: React.FC<CalendarDaysProps> = (props) => {
  useDaysArray({
    month: props.month,
    year: props.year,
    weekStartDay: props.weekStartDay,
    locale: props.locale || "en-US",
    setDayRowsArray: props.setDayRowsArray,
    dayRowsArray: props.dayRowsArray,
  });

  return (
    <div
      data-type={"calendar-days-area"}
      data-scope={"date-picker"}
      className={cn(
        "date-picker-calendar-days-area",
        props.datePickerCalendarDaysArea,
      )}
    >
      {props.dayRowsArray.map((daysRow, index) => (
        <DatePickerWeek
          key={index}
          daysRowClass={cn(
            {
              "rn-hidden": props.showSelectorTwo && index > 0,
            },
            props.daysRowClass,
          )}
        >
          {daysRow.map((day, i) => {
            const correctedDay = convertFormattedNumberBackToNumber(
              props.locale || "en-US",
              day,
            );
            return (
              <DatePickerDay
                {...{ ...props, calendarWeekDaysNameClass: undefined }}
                {...applyDateRangeProps({
                  year: props.year,
                  day: correctedDay,
                  month: props.month,
                  startDay: props.startDay,
                  endDay: props.endDay,
                  customDaysClassName: props.customDaysClassName,
                  multipleObject: props.multipleObject,
                  hideOutSideDays: props.hideOutSideDays,
                  hoverRangeValue: props.hoverRangeValue,
                  enabledDays: props.enabledDays,
                  minDate: props.minDate,
                  maxDate: props.maxDate,
                  disabledDays: props.disabledDays,
                })}
                key={i}
                year={props.year}
                month={props.month}
                day={correctedDay.value}
                onClick={() =>
                  props.handleDayClick(
                    correctedDay,
                    props.month,
                    props.year,
                    props.nextMonth || false,
                  )
                }
                onHover={() =>
                  props.onHoverDay(
                    correctedDay,
                    props.month,
                    props.year,
                    props.nextMonth || false,
                  )
                }
                onHoverEnd={() =>
                  props.onHoverDayEnd(
                    correctedDay,
                    props.month,
                    props.year,
                    props.nextMonth || false,
                  )
                }
                primaryColor={props.primaryColor}
                primaryTextColor={props.primaryTextColor}
                secondaryColor={props.secondaryColor}
                secondaryTextColor={props.secondaryTextColor}
                disabledDays={props.disabledDays}
                shouldHighlightWeekends={props.shouldHighlightWeekends}
                onDisabledDayError={props.onDisabledDayError}
                hoverRangeValue={props.hoverRangeValue}
              >
                {day.value}
              </DatePickerDay>
            );
          })}
        </DatePickerWeek>
      ))}
    </div>
  );
};
