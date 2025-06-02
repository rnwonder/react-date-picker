import { DatePicker, DatePickerProps } from "./DatePicker";
import { DatePickerType } from "../interface/general";
import { SelectorProps } from "./Selector";
import { defaultSelectorProps } from "./SelectorTwo";
import React, { useState } from "react";

export interface DatePickerStandAloneProps
  extends Omit<
    DatePickerProps,
    "handleOnChange" | "type" | "yearSelectorCount"
  > {
  type?: DatePickerType;
  yearSelectorCount?: number;
}

const CalendarExport = (props: DatePickerStandAloneProps) => {
  const [showSelectorTwo, setShowSelectorTwo] = useState(false);
  const [selectorTwoProps, setSelectorTwoProps] =
    useState<SelectorProps>(defaultSelectorProps);

  return (
    <DatePicker
      {...props}
      type={props.type || "single"}
      handleOnChange={() => {}}
      setShowSelectorTwo={setShowSelectorTwo}
      showSelectorTwo={showSelectorTwo}
      setSelectorTwoProps={setSelectorTwoProps}
      selectorTwoProps={selectorTwoProps}
      yearSelectorCount={props.yearSelectorCount || 20}
    />
  );
};
export default CalendarExport;
