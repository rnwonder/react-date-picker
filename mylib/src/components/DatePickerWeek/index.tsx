import { RnClassName } from "../../interface/general";
import { cn } from "../../utils";
import React from "react";

interface DatePickerWeekDaysProps
  extends Pick<RnClassName, "weekNamesRowClass" | "daysRowClass"> {
  children: React.ReactNode;
  header?: boolean;
}
export const DatePickerWeek: React.FC<DatePickerWeekDaysProps> = (props) => {
  return (
    <div
      className={cn(
        `
          rn-grid
          rn-grid-cols-7
          rn-text-sm
        `,
        {
          "date-picker-week-names-row rn-my-2": props.header,
          "date-picker-days-row rn-mb-[0.13rem]": !props.header,
        },
        props.weekNamesRowClass,
        props.daysRowClass,
      )}
      data-type={"date-picker-calendar-row"}
      data-part={props.header ? "header" : "row"}
      data-scope={"date-picker"}
      role={"row"}
    >
      {props.children}
    </div>
  );
};
