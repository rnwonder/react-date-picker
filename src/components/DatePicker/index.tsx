import {
  RnClassName,
  CustomDaysClassName,
  DateArray,
  DateObjectUnits,
  HoverRangeValue,
  RnColor,
  PickerAloneValue,
  DatePickerOnChange,
  DatePickerType,
  MonthDaysObject,
  IMonthSelectorType,
  IMonthYearSelectorFlexDirection,
  PickerRenderJSX,
  YearRange,
  Locale,
  LocaleOptions,
  MakeOptionalRequired,
  WeekDaysType,
  SelectorType,
} from "../../interface/general";
import { CalendarArea } from "../CalendarArea";
import { DatePickerTop } from "../DatePickerTop";
import { cn } from "../../utils";
import SelectorTwo from "../SelectorTwo";
import { SelectorProps } from "../Selector";
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  compareObjectDate,
  currentYear,
  getDatePickerRefactoredMonth,
  getDatePickerRefactoredYear,
  getOnChangeSingleData,
  handleDateRange,
} from "@rnwonder/simple-datejs/datePicker";
import {
  convertDateObjectToDate,
  convertDateToDateObject,
} from "@rnwonder/simple-datejs/utils";
import useDatePickerRenderJSX, {
  UseDatePickerRenderData,
} from "../../hooks/useDatePickerRenderJSX.tsx";
import Show from "../Helpers/Show.tsx";

export interface DatePickerProps
  extends RnColor,
    Omit<RnClassName, "inputClass" | "inputWrapperClass"> {
  type: DatePickerType;
  close?: () => void;
  handleOnChange: (data: DatePickerOnChange) => void;
  onDisabledDayError?: (data: DateObjectUnits) => void;

  minDate?: MakeOptionalRequired<DateObjectUnits>;
  maxDate?: MakeOptionalRequired<DateObjectUnits>;

  onChange?: (data: DatePickerOnChange) => void;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onValueChange?: (value: DatePickerOnChange) => void;

  value?: PickerAloneValue;
  setAllowedComponents?: React.Dispatch<SetStateAction<HTMLElement[]>>;

  month?: number;
  setMonth?: React.Dispatch<SetStateAction<number>>;
  year?: number;
  setYear?: React.Dispatch<SetStateAction<number>>;

  monthSelectorJSX?: PickerRenderJSX;
  yearSelectorJSX?: PickerRenderJSX;
  calendarAboveTopAreaJSX?: PickerRenderJSX;
  calendarTopAreaJSX?: PickerRenderJSX;
  calendarBottomAreaJSX?: PickerRenderJSX;
  calendarLeftAreaJSX?: PickerRenderJSX;
  calendarRightAreaJSX?: PickerRenderJSX;
  calendarJSX?: PickerRenderJSX;
  afterNextButtonAreaJSX?: PickerRenderJSX;
  beforePrevButtonAreaJSX?: PickerRenderJSX;
  weekDaysJSX?: PickerRenderJSX;

  monthSelectorFormat?: IMonthSelectorType;
  monthSelectorTopLabel?: string;
  yearSelectorCount: number;
  monthYearSelectorFlexDirection?: IMonthYearSelectorFlexDirection;
  yearRange?: YearRange;
  locale?: Locale;
  localeOptions?: LocaleOptions;
  nextIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;

  hideTopArea?: boolean;
  removeNavButtons?: boolean;
  shouldCloseOnSelect?: boolean;
  shouldHighlightWeekends?: boolean;
  disallowSameDayRange?: boolean;
  hideCalendar?: boolean;
  hideOutSideDays?: boolean;
  twoMonthsDisplay?: boolean;
  showEndOfRange?: boolean;
  disableRangeHoverEffect?: boolean;

  zIndex?: number;
  startingMonth?: number;
  startingYear?: number;
  weekStartDay?: number;

  disabledDays?: DateArray[];
  enabledDays?: DateArray[];
  customDaysClassName?: CustomDaysClassName[];
  weekDaysType?: WeekDaysType;

  yearSelectorType?: SelectorType;
  monthSelectorType?: SelectorType;

  showSelectorTwo?: boolean;
  setShowSelectorTwo?: React.Dispatch<SetStateAction<boolean>>;
  setSelectorTwoProps?: React.Dispatch<SetStateAction<SelectorProps>>;
  selectorTwoProps?: SelectorProps;

  noButtonAnimation?: boolean;
}

export const DatePicker = React.forwardRef((props: DatePickerProps, ref) => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState<number>();
  const [startDay, setStartDay] = useState<DateObjectUnits | undefined>();
  const [endDay, setEndDay] = useState<DateObjectUnits | undefined>(undefined);
  const [multipleObject, setMultipleObject] = useState<DateObjectUnits[]>([]);
  const [render, setRender] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hoverRangeValue, setHoverRangeValue] = useState<HoverRangeValue>({});
  const [dayRowsArray, setDayRowsArray] = useState<
    Array<Array<MonthDaysObject>>
  >([]);

  useEffect(() => {
    setYear(currentYear);
    if (
      !props.value?.selected &&
      !props.value?.start &&
      !props.value?.end &&
      !props.value?.selectedDateObject &&
      !props.value?.startDateObject &&
      !props.value?.endDateObject &&
      !props.value?.multiple &&
      !props.value?.multipleDateObject?.length
    ) {
      if (!props.month) props.setMonth?.(new Date().getMonth());
      if (!props.year) props.setYear?.(currentYear);
      startingDate();
      return;
    }
    startingDate();
    setMounted(true);

    if (props.value.selected || props.value.selectedDateObject) {
      const selectedDate = props.value.selected
        ? new Date(props.value.selected)
        : convertDateObjectToDate(props.value.selectedDateObject!);
      setMonth(selectedDate.getMonth());
      props.setMonth?.(selectedDate.getMonth());
      setYear(selectedDate.getFullYear());
      props.setYear?.(selectedDate.getFullYear());
      setStartDay({
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth(),
        day: selectedDate.getDate(),
      });
    }
    if (
      props.value.start ||
      props.value.end ||
      props.value.startDateObject ||
      props.value.endDateObject
    ) {
      const startDate = props.value.start
        ? new Date(props.value.start)
        : props.value.startDateObject?.day
          ? convertDateObjectToDate(props.value.startDateObject)
          : undefined;
      const endDate = props.value.end
        ? new Date(props.value.end)
        : props.value.endDateObject?.day
          ? convertDateObjectToDate(props.value.endDateObject)
          : undefined;

      if (!startDate && !endDate) return;
      if (!startDate && endDate) {
        setMonth(endDate.getMonth());
        props.setMonth?.(endDate.getMonth());

        setYear(endDate.getFullYear());
        props.setYear?.(endDate.getFullYear());

        const startObj = {
          year: endDate.getFullYear(),
          month: endDate.getMonth(),
          day: endDate.getDate(),
        };

        setStartDay(startObj);
        setHoverRangeValue({
          start: startObj,
        });
        return;
      }

      setMonth(startDate!.getMonth());
      props.setMonth?.(startDate!.getMonth());

      setYear(startDate!.getFullYear());
      props.setYear?.(startDate!.getFullYear());

      const startObj = {
        year: startDate!.getFullYear(),
        month: startDate!.getMonth(),
        day: startDate!.getDate(),
      };
      setStartDay(startObj);
      setHoverRangeValue({
        start: startObj,
      });

      if (!endDate) return;
      setEndDay({
        year: endDate.getFullYear(),
        month: endDate.getMonth(),
        day: endDate.getDate(),
      });
      setHoverRangeValue({
        start: undefined,
      });

      if (props.showEndOfRange) {
        setMonth(endDate.getMonth());
        props.setMonth?.(endDate.getMonth());

        setYear(endDate.getFullYear());
        props.setYear?.(endDate.getFullYear());
      }
    }

    if (props.value.multipleDateObject?.length || props.value.multiple) {
      const multipleDateObject = props.value.multipleDateObject?.length
        ? props.value.multipleDateObject
        : props.value.multiple
          ? props.value.multiple.map((date) =>
              convertDateToDateObject(new Date(date)),
            )
          : undefined;

      if (!multipleDateObject) return;
      setMultipleObject(multipleDateObject);
      const lastDate = multipleDateObject?.at(-1);
      if (lastDate?.month) {
        setMonth(lastDate.month);
        props.setMonth?.(lastDate.month);
      }
      if (lastDate?.year) {
        setYear(lastDate.year);
        props.setYear?.(lastDate.year);
      }
    }
  }, []);

  const onChange = useCallback(
    (data: DatePickerOnChange) => {
      props.handleOnChange(data);
      props?.onChange?.(data);
      props.onValueChange?.(data);
    },
    [props],
  );

  const startingDate = useCallback(() => {
    props.startingMonth && setMonth(props.startingMonth);
    props.startingMonth && props.setMonth?.(props.startingMonth);
    props.startingYear && setYear(props.startingYear);
    props.startingYear && props.setYear?.(props.startingYear);
  }, [props]);

  useEffect(() => {
    if (render) return;
    setRender(true);
  }, [render]);

  const handleDayClick = useCallback(
    (
      day: MonthDaysObject<number>,
      month: number,
      year: number,
      nextMonth: boolean = false,
    ) => {
      if (!mounted) {
        setMounted(true);
      }
      const initialMonth = Number(month);
      const newMonth = getDatePickerRefactoredMonth(initialMonth, day.month);
      const newYear = getDatePickerRefactoredYear(year, month, day.month);

      if (props.type === "range") {
        const { end, start, initial } = handleDateRange({
          day,
          month,
          year,
          endDay: endDay,
          startDay: startDay,
          disabledDays: props.disabledDays,
          enabledDays: props.enabledDays,
          disallowSameDayRange: props.disallowSameDayRange,
        });
        setStartDay(start);
        setEndDay(end);
        if (initial && !props.disableRangeHoverEffect) {
          setHoverRangeValue({
            start: start,
            end: undefined,
          });
        }
        if (end && start) {
          setHoverRangeValue({});
          props.shouldCloseOnSelect && props.close?.();
        }
        onChange({
          startDate: start,
          endDate: end,
          type: "range",
        });
      }

      if (props.type === "single") {
        const selectedDay = new Date(
          newYear,
          getDatePickerRefactoredMonth(initialMonth, day.month),
          day.value,
        );
        selectedDay.setFullYear(newYear);
        const selectedDate = convertDateToDateObject(selectedDay);
        setStartDay(selectedDate);
        onChange({
          selectedDate,
          type: "single",
        });
        props.shouldCloseOnSelect && props.close?.();
      }

      if (props.type === "multiple") {
        const selectedDay: DateObjectUnits = {
          year: newYear,
          month: getDatePickerRefactoredMonth(initialMonth, day.month),
          day: day.value,
        };
        const findDate = multipleObject.find((date) =>
          compareObjectDate(date, selectedDay),
        );
        if (findDate) {
          const newMultipleObject = multipleObject.filter(
            (date) => !compareObjectDate(date, findDate),
          );
          setMultipleObject(newMultipleObject);
          onChange({
            multipleDates: newMultipleObject,
            type: "multiple",
          });
          return;
        }
        setMultipleObject((prev) => [...prev, selectedDay]);
        onChange({
          multipleDates: multipleObject,
          type: "multiple",
        });
        props.shouldCloseOnSelect && props.close?.();
      }

      if (!nextMonth) {
        setMonth(newMonth);
        props.setMonth?.(newMonth);

        setYear(newYear);
        props.setYear?.(newYear);
      }
    },
    [endDay, mounted, multipleObject, onChange, props, startDay],
  );

  const setMonthAndYear = useCallback(
    (newMonth: number, newYear?: number) => {
      setMonth(newMonth);
      props.setMonth?.(newMonth);
      props.onMonthChange?.(newMonth);

      if (newYear) {
        setYear(newYear);
        props.setYear?.(newYear);
        props.onYearChange?.(newYear);
      }

      const changeData = getOnChangeSingleData({
        startDay: startDay,
        month: newMonth,
        year: newYear,
        type: props.type,
      });
      changeData ? props.onValueChange?.(changeData) : null;
    },
    [props, startDay],
  );

  const handleNextMonth = useCallback(() => {
    if ((props.month || month) === 11) {
      const newMonth = 0;
      const newYear = year! + 1;
      setMonthAndYear(newMonth, newYear);
      return;
    }
    const newMonth = (props.month || month) + 1;
    setMonthAndYear(newMonth);
    // setRender(false);
  }, [month, props.month, setMonthAndYear, year]);

  const handlePrevMonth = useCallback(() => {
    if ((props.month || month) === 0) {
      const newMonth = 11;
      const newYear = year! - 1;
      setMonthAndYear(newMonth, newYear);
      return;
    }
    const newMonth = (props.month || month) - 1;
    setMonthAndYear(newMonth);
    // setRender(false);
  }, [month, props.month, setMonthAndYear, year]);

  const onHoverDay = useCallback(
    (day: MonthDaysObject<number>, month: number, year: number) => {
      if (props.disableRangeHoverEffect) return;
      if (props.type !== "range") return;
      if (!hoverRangeValue?.start) return;
      const { end, start } = handleDateRange({
        day,
        month,
        year,
        endDay: hoverRangeValue?.end,
        startDay,
        disabledDays: props.disabledDays,
        hover: true,
        enabledDays: props.enabledDays,
      });

      setHoverRangeValue({
        start,
        end,
      });
    },
    [
      hoverRangeValue?.end,
      hoverRangeValue?.start,
      props.disableRangeHoverEffect,
      props.disabledDays,
      props.enabledDays,
      props.type,
      startDay,
    ],
  );

  const onHoverDayEnd = useCallback(() => {
    if (props.disableRangeHoverEffect) return;
    if (props.type !== "range") return;
    if (!hoverRangeValue?.start) return;
    if (startDay && endDay) return;
    setHoverRangeValue({
      start: startDay,
      end: undefined,
    });
  }, [
    endDay,
    hoverRangeValue?.start,
    props.disableRangeHoverEffect,
    props.type,
    startDay,
  ]);

  const jsxData: UseDatePickerRenderData = useMemo(() => {
    return {
      month,
      setMonth,
      endDay,
      year: year || currentYear,
      setYear: setYear as any,
      startDay,
      handleDayClick,
      multipleObject,
      handleNextMonth,
      handlePrevMonth,
      close: props.close,
    };
  }, [
    endDay,
    handleDayClick,
    handleNextMonth,
    handlePrevMonth,
    month,
    multipleObject,
    props.close,
    startDay,
    year,
  ]);

  // Render Custom JSX
  const monthSelectorJSX = useDatePickerRenderJSX(
    jsxData,
    props.monthSelectorJSX,
    props.setAllowedComponents,
  );
  const yearSelectorJSX = useDatePickerRenderJSX(
    jsxData,
    props.yearSelectorJSX,
    props.setAllowedComponents,
  );

  const calendarTopAreaJSX = useDatePickerRenderJSX(
    jsxData,
    props.calendarTopAreaJSX,
    props.setAllowedComponents,
  );

  const calendarLeftAreaJSX = useDatePickerRenderJSX(
    jsxData,
    props.calendarLeftAreaJSX,
    props.setAllowedComponents,
  );

  const calendarRightAreaJSX = useDatePickerRenderJSX(
    jsxData,
    props.calendarRightAreaJSX,
    props.setAllowedComponents,
  );

  const calendarBottomAreaJSX = useDatePickerRenderJSX(
    jsxData,
    props.calendarBottomAreaJSX,
    props.setAllowedComponents,
  );

  const calendarJSX = useDatePickerRenderJSX(
    jsxData,
    props.calendarJSX,
    props.setAllowedComponents,
  );

  const nextButtonAreaJSX = useDatePickerRenderJSX(
    jsxData,
    props.afterNextButtonAreaJSX,
    props.setAllowedComponents,
  );

  const prevButtonAreaJSX = useDatePickerRenderJSX(
    jsxData,
    props.beforePrevButtonAreaJSX,
    props.setAllowedComponents,
  );

  const weekDaysJSX = useDatePickerRenderJSX(
    jsxData,
    props.weekDaysJSX,
    props.setAllowedComponents,
  );

  const calendarAboveTopAreaJSX = useDatePickerRenderJSX(
    jsxData,
    props.calendarAboveTopAreaJSX,
    props.setAllowedComponents,
  );

  return (
    <div
      className={cn(
        `date-picker-wrapper 
          rn-relative 
          rn-rounded-md 
          rn-border-t 
          rn-border-solid
          rn-border-gray-300
          rn-bg-white
          rn-pb-[0.5rem] 
          rn-pt-[0.625rem] 
          dark:rn-border-gray-700
          dark:rn-bg-dreamless-sleep
          `,
        {
          "rn-w-max": !calendarLeftAreaJSX && !calendarRightAreaJSX,
          "rn-shadow-lg": !props.showSelectorTwo,
        },
        props.datePickerWrapperClass,
      )}
      data-type={"date-picker-wrapper"}
      ref={ref as any}
      style={{
        ...(props.backgroundColor && {
          backgroundColor: props.backgroundColor,
        }),
      }}
      data-scope={"date-picker"}
      data-part={"content"}
      role={"application"}
      aria-label={"calendar"}
      aria-roledescription={"date-picker"}
    >
      <Show when={props.showSelectorTwo}>
        <SelectorTwo
          {...props.selectorTwoProps}
          setAllowedComponents={props.setAllowedComponents}
          setShowSelectorTwo={props.setShowSelectorTwo}
          setSelectorTwoProps={props.setSelectorTwoProps}
          monthSelectorTopLabel={props.monthSelectorTopLabel}
        />
      </Show>

      <Show when={!props.hideTopArea}>
        {calendarAboveTopAreaJSX}
        {calendarTopAreaJSX || (
          <DatePickerTop
            yearSelectorCount={props.yearSelectorCount}
            setYear={props.setYear || (setYear as any)}
            setMonth={props.setMonth || setMonth}
            month={props.month || month}
            year={props.year || (year as any)}
            render={render}
            handleNextMonth={handleNextMonth}
            handlePrevMonth={handlePrevMonth}
            monthSelectorJSX={monthSelectorJSX}
            yearSelectorJSX={yearSelectorJSX}
            zIndex={props.zIndex}
            type={props.type}
            setAllowedComponents={props.setAllowedComponents}
            monthSelectorFormat={props.monthSelectorFormat}
            monthYearSelectorFlexDirection={
              props.monthYearSelectorFlexDirection
            }
            onChange={props.onValueChange}
            onMonthChange={props.onMonthChange}
            twoMonthsDisplay={props.twoMonthsDisplay}
            startDay={startDay}
            setStartDay={setStartDay}
            yearRange={props.yearRange}
            locale={props.locale}
            nextIcon={props.nextIcon}
            prevIcon={props.prevIcon}
            removeNavButtons={props.removeNavButtons}
            nextButtonAreaJSX={nextButtonAreaJSX}
            prevButtonAreaJSX={prevButtonAreaJSX}
            primaryColor={props.primaryColor}
            minDate={props.minDate}
            maxDate={props.maxDate}
            enabledDays={props.enabledDays}
            primaryTextColor={props.primaryTextColor}
            secondaryColor={props.secondaryColor}
            secondaryTextColor={props.secondaryTextColor}
            setShowSelectorTwo={props.setShowSelectorTwo}
            setSelectorTwoProps={props.setSelectorTwoProps}
            showSelectorTwo={props.showSelectorTwo}
          />
        )}
      </Show>

      <div
        className={cn(
          "date-picker-body rn-flex rn-justify-center",
          props.datePickerBodyAreaClass,
        )}
      >
        <Show when={calendarLeftAreaJSX && !props.showSelectorTwo}>
          {calendarLeftAreaJSX}
        </Show>

        <Show when={!props.hideCalendar}>
          {calendarJSX || (
            <CalendarArea
              {...props}
              year={props.year || (year as any)}
              month={props.month || month}
              endDay={endDay}
              startDay={startDay}
              handleDayClick={handleDayClick}
              multipleObject={multipleObject}
              weekDaysJSX={weekDaysJSX}
              onHoverDay={onHoverDay}
              hoverRangeValue={hoverRangeValue}
              onHoverDayEnd={onHoverDayEnd}
              showSelectorTwo={props.showSelectorTwo}
              setDayRowsArray={setDayRowsArray}
              dayRowsArray={dayRowsArray}
            />
          )}
        </Show>

        <Show when={calendarRightAreaJSX && !props.showSelectorTwo}>
          {calendarRightAreaJSX}
        </Show>
      </div>
      <Show when={calendarBottomAreaJSX && !props.showSelectorTwo}>
        {calendarBottomAreaJSX}
      </Show>
    </div>
  );
});
