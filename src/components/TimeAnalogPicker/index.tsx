import { IPopOverPositionX, IPopOverPositionY, Popover } from "../Popover";
import { ITimeAnalogGroupProps, TimeAnalogGroup } from "../TimeAnalogGroup";
import {
  TimeInputJSX,
  TimeMeridiem,
  ITimePickerFormat,
  TimeValue,
} from "../../interface/general";
import { convert12HourTo24Hour } from "@rnwonder/simple-datejs/utils";
import {
  formatHourWithLeadingZero,
  formatMinuteSecondWithLeadingZero,
} from "@rnwonder/simple-datejs/datePicker";
import { cn } from "../../utils";
import React, { SetStateAction, useCallback, useState } from "react";
import Show from "../Helpers/Show.tsx";

interface ITimeAnalogPickerProps
  extends Omit<
    ITimeAnalogGroupProps,
    "handleTimeChange" | "value" | "close" | "setIsShown"
  > {
  value?: TimeValue;
  setValue?: React.Dispatch<SetStateAction<TimeValue>>;
  onClose?: () => void;
  onOpen?: () => void;

  inputLabel?: string;
  placeholder?: string;
  inputClass?: string;
  inputWrapperClass?: string;

  renderInput?: TimeInputJSX;
  pickerPositionX?: IPopOverPositionX;
  pickerPositionY?: IPopOverPositionY;

  inputProps?: React.ComponentProps<"input">;
  inputWrapperWidth?: React.CSSProperties["width"];
  zIndex?: number;
}
const TimeAnalogPicker = (props: ITimeAnalogPickerProps) => {
  const [isShown, setIsShown] = useState(false);
  const [value, setValue] = useState<TimeValue>({
    value: {},
    label: "",
  });

  const handleTimeChange = useCallback(
    (time: ITimePickerFormat, meridiem: TimeMeridiem) => {
      const setPickerValue = props.setValue || setValue;
      let label = "";
      let suffix = "";

      if (!props.allowedView) {
        label = `${formatHourWithLeadingZero(time.hour)}:${formatMinuteSecondWithLeadingZero(time.minute)}`;
        suffix = meridiem;
      }
      if (props.allowedView?.includes("hour")) {
        label = `${formatHourWithLeadingZero(time.hour)}`;
        suffix = meridiem;

        if (
          (props.allowedView?.includes("minute") &&
            (time.minute || time.minute !== undefined)) ||
          (props.allowedView?.includes("second") &&
            (time.second || time.second !== undefined))
        ) {
          label += `:`;
        }
      } else {
        if (
          props.allowedView?.includes("minute") &&
          !props.allowedView?.includes("second")
        ) {
          suffix = time.minute === 1 ? "min" : "mins";
        }

        if (
          props.allowedView?.includes("second") &&
          !props.allowedView?.includes("minute")
        ) {
          suffix = time.second === 1 ? "sec" : "secs";
        }

        if (
          props.allowedView?.includes("second") &&
          props.allowedView?.includes("minute")
        ) {
          suffix = time.second === 1 ? "sec" : "secs";
        }
      }

      if (props.allowedView?.includes("minute")) {
        label += `${formatMinuteSecondWithLeadingZero(time.minute)}`;
        if (
          props.allowedView?.includes("second") &&
          (time.second || time.second !== undefined)
        ) {
          label += `:`;
        }
      }

      if (props.allowedView?.includes("second")) {
        label += `${formatMinuteSecondWithLeadingZero(time.second)}`;
      }
      label += ` ${suffix}`;

      setPickerValue({
        value: {
          ...time,
          hour:
            time.hour !== undefined
              ? convert12HourTo24Hour(time.hour, meridiem)
              : undefined,
        },
        label,
      });
    },
    [props.allowedView, props.setValue],
  );

  const handleChildrenClick = useCallback(() => {
    setIsShown(true);
  }, []);

  const renderCustomJSX = (renderJSX?: TimeInputJSX) => {
    if (!renderJSX) return undefined;
    if (typeof renderJSX === "function") {
      const content = renderJSX({
        value: props.value || value,
        showTime: handleChildrenClick,
      });
      return <>{content}</>;
    }
    return <>{renderJSX}</>;
  };

  const inputJSX = renderCustomJSX(props.renderInput);
  return (
    <Popover
      isShown={isShown}
      setIsShown={setIsShown}
      handleChildrenClick={inputJSX ? () => {} : undefined}
      onClose={() => {
        props.onClose?.();
      }}
      onOpen={() => {
        props.onOpen?.();
      }}
      content={({ close }) => (
        <TimeAnalogGroup
          {...props}
          value={props.value?.value || value.value}
          handleTimeChange={handleTimeChange}
          close={close}
          setIsShown={setIsShown}
        />
      )}
      positionX={props.pickerPositionX}
      positionY={props.pickerPositionY}
      zIndex={props.zIndex}
      width={props.inputWrapperWidth}
      className={cn(props.inputWrapperClass, "time-picker-input-wrapper")}
    >
      <div
        className={"time-picker-input-area"}
        data-time-picker-input-area={true}
        data-scope="time-picker"
        data-part="control"
      >
        <Show when={!!inputJSX}>{inputJSX}</Show>

        <Show when={!inputJSX}>
          <input
            readOnly
            data-scope="time-picker"
            data-type={"time-picker-input"}
            data-part="input"
            aria-label={"time picker input"}
            placeholder={props.placeholder}
            type="text"
            value={props.inputLabel || props.value?.label || value.label}
            {...{ ...props.inputProps, className: undefined }}
            className={cn(
              `time-picker-input rn-w-full rn-px-1`,
              props.inputProps?.className,
              props.inputClass,
            )}
          />
        </Show>
      </div>
    </Popover>
  );
};

export default TimeAnalogPicker;
