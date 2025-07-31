"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  RnClassName,
  DatePickerOnChange,
  DatePickerType,
  PickerInputJSX,
  PickerValue,
} from "../../interface/general";
import {
  convertDateObjectToDate,
  labelFormat,
  convertDateToDateObject,
} from "@rnwonder/simple-datejs/utils";
import { DatePicker, DatePickerProps } from "../DatePicker";
import { cn } from "../../utils";
import { SelectorProps } from "../Selector";
import { defaultSelectorProps } from "../SelectorTwo";
import { Popover, IPopOverPositionX, IPopOverPositionY } from "../Popover";

export interface DatePickerInputSJProps
  extends Omit<
      DatePickerProps,
      | "type"
      | "value"
      | "setAllowedComponents"
      | "close"
      | "handleOnChange"
      | "showSelectorTwo"
      | "setShowSelectorTwo"
      | "setSelectorTwoProps"
      | "selectorTwoProps"
      | "yearSelectorCount"
    >,
    Pick<RnClassName, "inputWrapperClass" | "inputClass"> {
  type?: DatePickerType;
  value?: PickerValue;
  setValue?: React.Dispatch<React.SetStateAction<PickerValue>>;
  onChange?: (data: DatePickerOnChange) => void;
  componentsToAllowOutsideClick?: Array<HTMLElement>;
  renderInput?: PickerInputJSX;
  pickerPositionX?: IPopOverPositionX;
  pickerPositionY?: IPopOverPositionY;
  placeholder?: string;
  onClose?: () => void;
  onOpen?: () => void;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  inputLabel?: string;
  inputWrapperWidth?: React.CSSProperties["width"];
  multipleDatesSeparator?: string;
  rangeDatesSeparator?: string;

  alwaysShowRangeStartYear?: boolean;
  formatInputLabel?: string;
  formatInputLabelRangeStart?: string;
  formatInputLabelRangeEnd?: string;
  yearSelectorCount?: number;

  portalRef?: HTMLElement | undefined;
  setPortalRef?: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;

  portalContainer?: HTMLElement;
  disableOpenAnimation?: boolean;
}

export const DatePickerGroupNew: React.FC<DatePickerInputSJProps> = (props) => {
  const [value, setValue] = useState<PickerValue>({
    label: "",
    value: {},
  });
  const [isShown, setIsShown] = useState(false);
  const [allowedComponents, setAllowedComponents] = useState<any[]>([]);
  const [showSelectorTwo, setShowSelectorTwo] = useState(false);
  const [selectorTwoProps, setSelectorTwoProps] =
    useState<SelectorProps>(defaultSelectorProps);
  const [hasMounted, setMounted] = useState(false);

  const handleOnChange = useCallback(
    (data: DatePickerOnChange) => {
      const pickerValue = props.value || value;
      const setPickerValue = props.setValue || setValue;

      if (data.type === "single") {
        const dateTime = convertDateObjectToDate(data?.selectedDate || {});
        const label = labelFormat({
          date: dateTime,
          option: props?.localeOptions || {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
          format: props.formatInputLabel,
          locale: props.locale,
        });
        setPickerValue({
          value: {
            selected: dateTime?.toISOString() || "",
            selectedDateObject: data?.selectedDate || {},
          },
          label,
        });
      }

      if (data.type === "range") {
        const startDateTime = data.startDate
          ? convertDateObjectToDate(data.startDate)
          : undefined;
        const endDateTime = data.endDate
          ? convertDateObjectToDate(data.endDate)
          : undefined;

        let label = "";
        const startOptions: Intl.DateTimeFormatOptions = {
          month: "short",
          day: "numeric",
          year: "numeric",
          ...(props?.localeOptions || {}),
          ...(props?.alwaysShowRangeStartYear ? {} : { year: undefined }),
        };
        const endOptions: Intl.DateTimeFormatOptions = props?.localeOptions || {
          month: "short",
          day: "numeric",
          year: "numeric",
        };
        let startDateFormatted = "";
        let endDateFormatted = "";

        if (startDateTime && endDateTime) {
          if (startDateTime.getFullYear() === endDateTime.getFullYear()) {
            if (props.alwaysShowRangeStartYear) return;
            startOptions.year = undefined;
          } else {
            startOptions.year = "numeric";
          }
          startDateFormatted = labelFormat({
            date: startDateTime,
            option: startOptions,
            format: props.formatInputLabelRangeStart,
            locale: props.locale,
          });
          endDateFormatted = labelFormat({
            date: endDateTime,
            option: endOptions,
            format: props.formatInputLabelRangeEnd,
            locale: props.locale,
          });
        }

        if (startDateTime && !endDateTime) {
          startDateFormatted = labelFormat({
            date: startDateTime,
            option: startOptions,
            format: props.formatInputLabelRangeStart,
            locale: props.locale,
          });
        }

        if (!startDateTime && endDateTime) {
          endDateFormatted = labelFormat({
            date: endDateTime,
            option: endOptions,
            format: props.formatInputLabelRangeEnd,
            locale: props.locale,
          });
        }
        label = `${startDateFormatted} ${
          props.rangeDatesSeparator || "-"
        } ${endDateFormatted}`;
        setPickerValue({
          value: {
            start: startDateTime?.toISOString() || "",
            startDateObject: data?.startDate || {},
            end: endDateTime?.toISOString() || "",
            endDateObject: data?.endDate || {},
          },
          label,
        });
      }

      if (data.type === "multiple") {
        const savedValue = pickerValue.value;
        const savedMultipleDateObject = savedValue.multipleDateObject || [];
        const newMultipleDateObject = data.multipleDates || [];

        if (!pickerValue.label && newMultipleDateObject.length === 0) return;
        if (
          savedMultipleDateObject.toString() ===
            newMultipleDateObject.toString() &&
          pickerValue.label
        )
          return;

        const inputLabelValue = newMultipleDateObject.map((date) => {
          const dateTime = convertDateObjectToDate(date);
          return labelFormat({
            date: dateTime,
            option: props?.localeOptions || {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
            format: props.formatInputLabel,
            locale: props.locale,
          });
        });

        const newMultipleDateISO = newMultipleDateObject.map(
          (date) => convertDateObjectToDate(date)?.toISOString() || "",
        );

        const arrangeDateISO = newMultipleDateISO.sort((a, b) => {
          return a.localeCompare(b);
        });

        const arrangeDateObject = newMultipleDateObject.sort((a, b) => {
          const isoA = convertDateObjectToDate(a)?.toISOString() || "";
          const isoB = convertDateObjectToDate(b)?.toISOString() || "";
          return isoA.localeCompare(isoB);
        });

        setPickerValue({
          value: {
            multiple: arrangeDateISO,
            multipleDateObject: arrangeDateObject,
          },
          label: inputLabelValue.join(props.multipleDatesSeparator || ", "),
        });
      }
    },
    [props, value],
  );

  const handleChildrenClick = () => {
    setIsShown(true);
  };

  const renderCustomJSX = (renderJSX?: PickerInputJSX) => {
    if (!renderJSX) return undefined;
    if (typeof renderJSX === "function") {
      const content = renderJSX({
        value: props.value || value,
        showDate: handleChildrenClick,
      });
      return <>{content}</>;
    }
    return <>{renderJSX}</>;
  };

  const inputJSX = renderCustomJSX(props.renderInput);

  // Handle initial value setting after component mounts
  useEffect(() => {
    if (hasMounted) return;
    if (!props.value && !value.value) {
      setMounted(true);
      return;
    }

    const valueData = props.value?.value || value.value;

    if (valueData.selected || valueData.selectedDateObject) {
      const selectedDate = valueData.selected
        ? convertDateToDateObject(new Date(valueData.selected))
        : valueData.selectedDateObject;

      handleOnChange({
        type: "single",
        selectedDate,
      });
    }

    if (valueData.start || valueData.startDateObject) {
      const startDate = valueData.start
        ? convertDateToDateObject(new Date(valueData.start))
        : valueData.startDateObject;

      const endDate = valueData.end
        ? convertDateToDateObject(new Date(valueData.end))
        : valueData.endDateObject;

      handleOnChange({
        type: "range",
        startDate,
        endDate,
      });
    }

    if (valueData.multiple || valueData.multipleDateObject) {
      const multipleDateObject = valueData.multipleDateObject?.length
        ? valueData.multipleDateObject
        : valueData.multiple
          ? valueData.multiple.map((date) =>
              convertDateToDateObject(new Date(date)),
            )
          : undefined;

      if (!multipleDateObject?.length) return;

      handleOnChange({
        type: "multiple",
        multipleDates: multipleDateObject,
      });
    }

    setMounted(true);
  }, [handleOnChange, hasMounted, props.value, value.value]);

  return (
    <Popover
      isShown={isShown}
      setIsShown={setIsShown}
      disableOpenAnimation={props.disableOpenAnimation}
      onClose={() => {
        if (allowedComponents.length) {
          setAllowedComponents([]);
        }
        setShowSelectorTwo(false);
        setSelectorTwoProps(defaultSelectorProps);
        props.onClose?.();
      }}
      onOpen={() => {
        props.onOpen?.();
      }}
      content={({ close }: { close: () => void }) => (
        <DatePicker
          {...props}
          type={props.type || "single"}
          value={props.value?.value || value.value}
          handleOnChange={handleOnChange}
          onChange={props.onChange}
          maxDate={props.maxDate}
          minDate={props.minDate}
          setAllowedComponents={setAllowedComponents}
          close={close}
          yearSelectorCount={props.yearSelectorCount || 20}
          setShowSelectorTwo={setShowSelectorTwo}
          showSelectorTwo={showSelectorTwo}
          setSelectorTwoProps={setSelectorTwoProps}
          selectorTwoProps={selectorTwoProps}
          locale={props.locale || "en-US"}
        />
      )}
      portalContainer={props.portalContainer}
      onClickOutside={(
        e?: Event,
        setShown?: React.Dispatch<React.SetStateAction<boolean>>,
      ) => {
        if (
          allowedComponents
            .concat(props.componentsToAllowOutsideClick || [])
            ?.some((component: any) => component?.contains?.(e?.target))
        ) {
          return;
        }
        setShown?.(false);
      }}
      positionX={props.pickerPositionX}
      positionY={props.pickerPositionY}
      zIndex={props.zIndex}
      handleChildrenClick={inputJSX ? () => {} : undefined}
      width={props.inputWrapperWidth}
      className={cn(props.inputWrapperClass, "date-picker-input-wrapper")}
    >
      <div
        className={"date-picker-input-area"}
        data-date-picker-input-area={true}
        data-scope="date-picker"
        data-part="control"
      >
        {inputJSX && inputJSX}

        {!inputJSX && (
          <input
            readOnly
            type={"text"}
            data-scope="date-picker"
            data-part="input"
            aria-label={"date picker input"}
            placeholder={props.placeholder}
            value={props.inputLabel || props.value?.label || value.label}
            data-type={"date-picker-input"}
            {...{ ...props.inputProps, className: undefined }}
            className={cn(
              `date-picker-input rn-w-full rn-px-1`,
              props.inputProps?.className,
              props.inputClass,
            )}
          />
        )}
      </div>
    </Popover>
  );
};

export { DatePickerGroupNew as default };
