import {
  TimeMeridiem,
  ITimePickerFormat,
  TimeView,
  TimeClassName,
} from "../../interface/general";
import { TimeNumber } from "../TimeNumber";
import {
  convert12HourTo24Hour,
  convert24HourTo12Hour,
  getAmPm,
  getCurrentTime,
} from "@rnwonder/simple-datejs/utils";
import { cn } from "../../utils";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import Show from "../Helpers/Show.tsx";

export interface ITimePickerAnalog extends TimeClassName {
  close: () => void;
  view: TimeView;
  setView: React.Dispatch<SetStateAction<TimeView>>;
  allowedView: TimeView[];
  value: ITimePickerFormat;
  handleNext: () => void;
  onChange?: (time: ITimePickerFormat) => void;
  meridiem: TimeMeridiem;
  setMeridiem: React.Dispatch<SetStateAction<TimeMeridiem>>;
  setCurrentTimeOnOpen?: boolean;
  handleTimeChange: (time: ITimePickerFormat, meridiem: TimeMeridiem) => void;
  selectedHour: number | undefined;
  selectedMinute: number | undefined;
  selectedSeconds: number | undefined;
  setSelectedHour: React.Dispatch<SetStateAction<number | undefined>>;
  setSelectedMinute: React.Dispatch<SetStateAction<number | undefined>>;
  setSelectedSeconds: React.Dispatch<SetStateAction<number | undefined>>;
}
export const TimeAnalog = (props: ITimePickerAnalog) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [onTouch, setOnTouch] = useState(false);
  const [linePosition, setLinePosition] = useState("rotateZ(0deg)");
  const [showHand, setShowHand] = useState(false);

  useEffect(() => {
    let currentTime: any = {};

    if (props.setCurrentTimeOnOpen) {
      currentTime = getCurrentTime();
    }

    if (props.allowedView.includes("hour")) {
      if (props.value.hour === undefined) {
        if (!props.setCurrentTimeOnOpen) return;
        props.setSelectedHour(currentTime.hour);
        props.setMeridiem(currentTime.meridiem);
      } else {
        props.setMeridiem(getAmPm(props.value.hour));
        props.setSelectedHour(convert24HourTo12Hour(props.value.hour));
      }
    }

    if (props.allowedView.includes("minute")) {
      if (props.value.minute === undefined) {
        if (!props.setCurrentTimeOnOpen) return;
        props.setSelectedMinute(currentTime.minute);
      } else {
        props.setSelectedMinute(props.value.minute);
      }
    }

    if (props.allowedView.includes("second")) {
      if (props.value.second === undefined) {
        if (!props.setCurrentTimeOnOpen) return;
        props.setSelectedSeconds(currentTime.second);
      } else {
        props.setSelectedSeconds(props.value.second);
      }
    }

    if (props.allowedView.includes("hour")) return;
    if (props.allowedView.includes("minute")) {
      props.setView("minute");
      return;
    }
    if (props.allowedView.includes("second")) {
      props.setView("second");
    }
  }, []);

  useEffect(() => {
    if (!showHand) return;
    props.onChange?.({
      hour:
        props.selectedHour !== undefined
          ? convert12HourTo24Hour(props.selectedHour!, props.meridiem)
          : undefined,
      minute: props.selectedMinute,
      second: props.selectedSeconds,
    });

    props.handleTimeChange(
      {
        hour: props.selectedHour,
        minute: props.selectedMinute,
        second: props.selectedSeconds,
      },
      props.meridiem,
    );
  }, [
    props.meridiem,
    props.selectedSeconds,
    props.selectedMinute,
    props.selectedHour,
    props.handleTimeChange,
    props.onChange,
    showHand,
  ]);

  useEffect(() => {
    if (props.view === "hour") {
      setLinePosition(`rotateZ(${(props.selectedHour || 0) * 30}deg)`);
    }
    if (props.view === "minute") {
      setLinePosition(`rotateZ(${(props.selectedMinute || 0) * 6}deg)`);
    }
    if (props.view === "second") {
      setLinePosition(`rotateZ(${(props.selectedSeconds || 0) * 6}deg)`);
    }
  }, [
    props.selectedHour,
    props.selectedMinute,
    props.selectedSeconds,
    props.view,
  ]);

  useEffect(() => {
    if (!isPicking) return;
    if (mouseDown) return;
    if (onTouch) {
      setOnTouch(false);
      setIsPicking(false);
      return;
    }
    props.handleNext();
    setIsPicking(false);
  }, [isPicking, mouseDown, onTouch, props.handleNext]);

  useEffect(() => {
    if (props.view === "hour" && props.selectedHour !== undefined) {
      setShowHand(true);
      return;
    }

    if (props.view === "minute" && props.selectedMinute !== undefined) {
      setShowHand(true);
      return;
    }
    if (props.view === "second" && props.selectedSeconds !== undefined) {
      setShowHand(true);
      return;
    }
  }, [
    props.selectedHour,
    props.selectedMinute,
    props.selectedSeconds,
    props.view,
  ]);

  const handlePointerEnter = useCallback(
    (
      e: React.PointerEvent<HTMLButtonElement>,
      type: TimeView,
      value?: number,
    ) => {
      if (value === undefined) return;

      const handleMouseDown = () => {
        if (!mouseDown) {
          setMouseDown(true);
        }
        if (!isPicking) {
          setIsPicking(true);
        }
      };

      if (e.pressure > 0 && type === "hour") {
        props.setSelectedHour(value);
        handleMouseDown();
      }
      if (e.pressure > 0 && type === "minute") {
        props.setSelectedMinute(value);
        handleMouseDown();
      }
      if (e.pressure > 0 && type === "second") {
        props.setSelectedSeconds(value);
        handleMouseDown();
      }
    },
    [isPicking, mouseDown, props.setSelectedHour],
  );

  const handleClick = useCallback(
    (type: TimeView, value?: number) => {
      if (value === undefined) return;
      if (type === "hour") {
        props.setSelectedHour(value);
        props.handleNext();
        return;
      }
      if (type === "minute") {
        if (!props.allowedView.includes("second")) {
          setShowHand(true);
        }
        props.setSelectedMinute(value);
        props.handleNext();
        return;
      }

      if (type === "second") {
        props.setSelectedSeconds(value);
        setShowHand(true);
      }
      props.handleNext();
    },
    [props.setSelectedHour, props.handleNext],
  );

  const handleTouchEnd = useCallback(
    (
      _: TouchEvent & { currentTarget: HTMLButtonElement; target: Element },
      type: TimeView,
      value?: number,
    ) => {
      if (value === undefined) return;
      handleClick(type, value);
    },
    [handleClick],
  );

  return (
    <div
      className={cn(
        `
        time-analog-wrapper
        rn-relative 
        rn-flex 
        rn-h-[237px] 
        rn-w-[237px] 
        rn-items-center 
        rn-justify-center 
        rn-rounded-full 
        rn-bg-slate-100
        dark:rn-bg-eerie-black
        `,
        props.timeAnalogWrapperClass,
      )}
      data-time-analog-wrapper={true}
      aria-label={`Select minutes. Selected time is 11:01AM`}
      role={"listbox"}
      tabIndex={0}
      onMouseUp={() => setMouseDown(false)}
    >
      <div
        className={cn(
          `
          time-analog-center-hand
          rn-left-[calc(50% 
          -
          1px)]
          rn-absolute rn-bottom-1/2 rn-h-[39%]
          rn-w-[2px]
          rn-origin-center-bottom
          rn-bg-dark-time
          dark:rn-bg-[#8f8f8f]
          `,
          {
            "rn-hidden": !showHand,
            "rn-block": showHand,
          },
          props.timeAnalogClockHandClass,
        )}
        style={{ transform: linePosition }}
        data-time-analog-center-hand={true}
      />
      <div
        className={cn(
          `
          time-analog-center-dot
          rn-absolute
          rn-left-1/2 
          rn-top-1/2 
          rn-h-[5px] 
          rn-w-[5px] rn--translate-x-1/2 
          rn--translate-y-1/2 rn-transform rn-rounded-full
          rn-bg-dark-time
          dark:rn-bg-dark-time
          `,
          props.timeAnalogClockCenterDotClass,
        )}
        data-time-analog-center-dot={true}
      />

      <div
        className={cn(`
          rn-relative
          rn-h-[50px]
          rn-w-[50px]
          rn-bg-transparent
      `)}
      >
        <Show when={props.view === "hour"}>
          {Array.from(Array(12).keys(), (v) => v + 1).map((_, index) => {
            return (
              <TimeNumber
                {...props}
                type={props.view}
                key={index}
                selectedValue={props.selectedHour}
                onClick={handleClick}
                onMouseUp={() => setMouseDown(false)}
                onPointerEnter={handlePointerEnter}
                onTouchStart={() => setOnTouch(true)}
                onTouchEnd={handleTouchEnd}
                onPointerUp={() => setMouseDown(false)}
                onPointerCancel={() => setMouseDown(false)}
                index={index}
                className={props.timeAnalogNumberClass}
              />
            );
          })}
        </Show>

        <Show when={props.view === "minute"}>
          {Array.from(Array(60).keys(), (v) => v + 1).map((_, index) => {
            return (
              <TimeNumber
                {...props}
                type={props.view}
                key={index}
                selectedValue={props.selectedMinute}
                onClick={handleClick}
                onMouseUp={() => setMouseDown(false)}
                onPointerEnter={handlePointerEnter}
                onTouchStart={() => setOnTouch(true)}
                onTouchEnd={handleTouchEnd}
                onPointerUp={() => setMouseDown(false)}
                onPointerCancel={() => setMouseDown(false)}
                index={index}
                className={props.timeAnalogNumberClass}
              />
            );
          })}
        </Show>

        <Show when={props.view === "second"}>
          {Array.from(Array(60).keys(), (v) => v + 1).map((_, index) => {
            return (
              <TimeNumber
                {...props}
                type={props.view}
                key={index}
                selectedValue={props.selectedSeconds}
                onClick={handleClick}
                onMouseUp={() => setMouseDown(false)}
                onPointerEnter={handlePointerEnter}
                onTouchStart={() => setOnTouch(true)}
                onTouchEnd={handleTouchEnd}
                onPointerUp={() => setMouseDown(false)}
                onPointerCancel={() => setMouseDown(false)}
                index={index}
                className={props.timeAnalogNumberClass}
              />
            );
          })}
        </Show>
      </div>
    </div>
  );
};
