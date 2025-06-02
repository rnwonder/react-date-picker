import { Locale, MonthDaysObject } from "../interface/general";
import React, { SetStateAction, useEffect } from "react";
import {
  breakArrayIntoSubArrays,
  getMonthDaysArray,
} from "@rnwonder/simple-datejs/datePicker";

export const useDaysArray = ({
  setDayRowsArray,
  year,
  weekStartDay,
  month,
  locale,
  dayRowsArray,
}: {
  month: number;
  year: number;
  weekStartDay?: number;
  setDayRowsArray: React.Dispatch<
    SetStateAction<Array<Array<MonthDaysObject>>>
  >;
  dayRowsArray: Array<Array<MonthDaysObject>>;
  locale: Locale;
}) => {
  useEffect(() => {
    const days = getMonthDaysArray(month, year, {
      weekStartDay: weekStartDay,
      locale,
    });
    const data = breakArrayIntoSubArrays(days, 7);
    setDayRowsArray(data);
  }, [locale, month, setDayRowsArray, weekStartDay, year]);

  return dayRowsArray;
};
