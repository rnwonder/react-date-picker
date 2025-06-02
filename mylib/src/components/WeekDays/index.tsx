import {
  RnClassName,
  RnColor,
  Locale,
  WeekDaysType,
} from "../../interface/general";
import { DatePickerDay } from "../DatePickerDay";
import { DatePickerWeek } from "../DatePickerWeek";
import React, { useEffect, useState } from "react";

interface IProps extends RnColor, RnClassName {
  locale?: Locale;
  weekDaysType?: WeekDaysType;
  weekStartDay?: number;
}

export const WeekDays: React.FC<IProps> = (props) => {
  const [weekDaysArray, setWeekDaysArray] = useState<Array<string>>([]);
  const [weekDaysLong, setWeekDaysLong] = useState<Array<string>>([]);

  useEffect(() => {
    const dayNames = Array.from({ length: 7 }, (_, i) => {
      const name = new Date(
        0,
        0,
        i - (1 - (props.weekStartDay || 0)) + 1,
      ).toLocaleDateString(props.locale || "en", {
        weekday: props.weekDaysType === "single" ? "narrow" : "short",
      });

      if (props.weekDaysType === "double") {
        return name.slice(0, 2);
      }
      return name;
    });
    const dayLongNames = Array.from({ length: 7 }, (_, i) => {
      return new Date(
        0,
        0,
        i - (1 - (props.weekStartDay || 0)) + 1,
      ).toLocaleDateString(props.locale || "en", {
        weekday: "long",
      });
    });
    setWeekDaysLong(dayLongNames);
    setWeekDaysArray(dayNames);
  }, [props.locale, props.weekDaysType, props.weekStartDay]);

  return (
    <DatePickerWeek weekNamesRowClass={props.weekNamesRowClass}>
      {weekDaysArray.map((day, index) => (
        <DatePickerDay
          weekDaysNameColor={props.weekDaysNameColor}
          weekNamesClass={props.weekNamesClass}
          wrapperProps={{
            "data-scope": "date-picker",
            "data-type": "column-header",
            "aria-label": weekDaysLong[index],
            role: "columnheader",
          }}
          header
          key={index}
          headerValue={weekDaysLong[index]}
        >
          {day}
        </DatePickerDay>
      ))}
    </DatePickerWeek>
  );
};
