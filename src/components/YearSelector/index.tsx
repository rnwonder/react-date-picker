import { Selector, SelectorProps } from "../Selector";
import {
  YearRange,
  MakeOptionalRequired,
  DateObjectUnits,
  DatePickerType,
  SelectorColorsAndClassNames,
  SelectorType,
  Locale,
} from "../../interface/general";
import { SelectorTriggerButton } from "../SelectorTriggerButton";
import React, {
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  breakArrayIntoSubArrays,
  currentYear,
  generateYearsArray,
  getYearRange,
  numberFormatter,
} from "@rnwonder/simple-datejs/datePicker";

export interface YearSelectorProps extends SelectorColorsAndClassNames {
  year: number;
  setYear: React.Dispatch<SetStateAction<number>>;
  zIndex?: number;
  yearRange?: YearRange;
  minDate?: MakeOptionalRequired<DateObjectUnits>;
  maxDate?: MakeOptionalRequired<DateObjectUnits>;
  type?: DatePickerType;
  startDay?: DateObjectUnits;
  yearSelectorType?: SelectorType;
  setShowSelectorTwo?: React.Dispatch<SetStateAction<boolean>>;
  setSelectorTwoProps?: React.Dispatch<SetStateAction<SelectorProps>>;
  showSelectorTwo?: boolean;
  noButtonAnimation?: boolean;
  locale?: Locale;
  yearSelectorCount: number;
}

export const YearSelector = memo(
  React.forwardRef((props: YearSelectorProps, ref) => {
    const [range, setRange] = useState("");
    const [yearArray, setYearArray] = useState<string[][]>([]);
    const [startYear, setStartYear] = useState<number>();
    const [endYear, setEndYear] = useState<number>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [count, _] = useState(
      props.yearSelectorCount ? Math.abs(props.yearSelectorCount) : 20,
    );

    const handleNext = useCallback(() => {
      if (!startYear || !endYear) return;
      const end = endYear!;
      setStartYear(end + 1);
      setEndYear(end + count);
    }, [count, endYear, startYear]);

    const handlePrev = useCallback(() => {
      if (!startYear || !endYear) return;
      const start = startYear!;
      setEndYear(start - 1);
      setStartYear(start - count);
    }, [count, endYear, startYear]);

    const handleFullSizeSelector = useCallback(() => {
      props.setSelectorTwoProps?.({
        ...props,
        optionsArray: [],
        locale: props.locale || "en-US",
        yearArray,
        option: props.year,
        setOption: props.setYear,
        attributes: {
          "data-year": "true",
        },
        handleNext,
        handlePrev,
        range,
        className: "year-selector-option",
        zIndex: props.zIndex,
        primaryTextColor: props.primaryTextColor,
        primaryColor: props.primaryColor,
        useValueAsName: true,
        startYear,
        endYear,
        count,
      });
      props.setShowSelectorTwo?.(true);
    }, [
      count,
      endYear,
      handleNext,
      handlePrev,
      props,
      range,
      startYear,
      yearArray,
      props.locale,
    ]);

    useEffect(() => {
      if (props.yearSelectorType === "compact-dropdown") return;
      if (!props.year) return;

      const {
        range,
        array,
        endYear: end,
        startYear: start,
      } = getYearRange({
        startYear,
        endYear,
        count,
        year: props.year,
        yearRange: props.yearRange,
        locale: props.locale || "en-US",
      });

      if (!props.showSelectorTwo) {
        setStartYear(start);
        setEndYear(end);
      }

      const yArray = breakArrayIntoSubArrays(array, 4);

      setRange(range);
      setYearArray(yArray);

      props.setSelectorTwoProps?.((prev) => ({
        ...prev,
        yearArray: yArray,
        range,
        startYear: start,
        endYear: end,
        count,
        handleNext,
        handlePrev,
      }));
    }, [
      count,
      endYear,
      handleNext,
      handlePrev,
      props.locale,
      props.showSelectorTwo,
      props.year,
      props.yearRange,
      props.yearSelectorType,
      startYear,
    ]);

    return (
      <>
        {props.yearSelectorType === "compact-dropdown" ? (
          <Selector
            {...props}
            optionsArray={generateYearsArray(
              props.yearRange?.start || currentYear - 51,
              props.yearRange?.end || currentYear + 20,
            ).map((year) => year.toString())}
            option={props.year}
            setOption={props.setYear}
            ref={ref}
            attributes={{
              "data-year": "true",
            }}
            useValueAsName
            className={"year-selector-option"}
            zIndex={props.zIndex}
            primaryColor={props.primaryColor}
            primaryTextColor={props.primaryTextColor}
          />
        ) : (
          <SelectorTriggerButton
            option={props.year}
            optionsArray={[]}
            type={"full-size"}
            isOpen={props.showSelectorTwo || false}
            onClick={handleFullSizeSelector}
            noButtonAnimation={props.noButtonAnimation}
          >
            {numberFormatter(props.year, props.locale)}
          </SelectorTriggerButton>
        )}
      </>
    );
  }),
);
