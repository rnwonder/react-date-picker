"use client";
import { YearSelector, YearSelectorProps } from "./YearSelector";
import { Popover } from "./Popover";
import { SelectorProps } from "./Selector";
import SelectorTwo, { defaultSelectorProps } from "./SelectorTwo";
import { cn } from "../utils";
import { currentYear } from "@rnwonder/simple-datejs/datePicker";
import { useState } from "react";

export interface YearSelectorExportProps
  extends Omit<
    YearSelectorProps,
    | "type"
    | "setShowSelectorTwo"
    | "setSelectorTwoProps"
    | "showSelectorTwo"
    | "yearSelectorCount"
  > {
  yearSelectorCount?: number;
}

const YearSelectorExport = (props: YearSelectorExportProps) => {
  const [showSelectorTwo, setShowSelectorTwo] = useState(false);
  const [selectorTwoProps, setSelectorTwoProps] =
    useState<SelectorProps>(defaultSelectorProps);
  const [year, setYear] = useState<number>(currentYear);

  return (
    <>
      {props.yearSelectorType === "compact-dropdown" ? (
        <YearSelector
          {...props}
          setSelectorTwoProps={setSelectorTwoProps}
          setShowSelectorTwo={setShowSelectorTwo}
          showSelectorTwo={showSelectorTwo}
          yearSelectorCount={props.yearSelectorCount || 20}
        />
      ) : (
        <Popover
          content={({ close }) => (
            <div
              className={cn(`
                rn-w-[17.5rem]
              `)}
            >
              <SelectorTwo
                {...selectorTwoProps}
                setShowSelectorTwo={setShowSelectorTwo}
                setSelectorTwoProps={setSelectorTwoProps}
                close={close}
                year={props.year || year}
                setOption={props.setYear || setYear}
                option={props.year || year}
              />
            </div>
          )}
          width={"fit-content"}
          onClose={() => {
            setShowSelectorTwo(false);
            setSelectorTwoProps(defaultSelectorProps);
          }}
        >
          <YearSelector
            {...props}
            setSelectorTwoProps={setSelectorTwoProps}
            setShowSelectorTwo={setShowSelectorTwo}
            showSelectorTwo={showSelectorTwo}
            yearSelectorType={"full-size"}
            yearSelectorCount={props.yearSelectorCount || 20}
          />
        </Popover>
      )}
    </>
  );
};

export default YearSelectorExport;
