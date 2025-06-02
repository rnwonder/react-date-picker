
import { ITimePickerAnalog, TimeAnalog } from "../TimeAnalog";
import {
  TimeMeridiem,
  ITimePickerFormat,
  TimeView,
} from "../../interface/general";
import { TimeAnalogGroupTop } from "../TimeAnalogGroupTop";
import { TimeAnalogBottom } from "../TimeAnalogBottom";
import { cn } from "../../utils";
import { convert12HourTo24Hour } from "@rnwonder/simple-datejs/utils";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import Show from "../Helpers/Show";

interface IRenderTimeJSXProps {
  view: TimeView;
  setView: React.Dispatch<SetStateAction<TimeView>>;
  meridiem: TimeMeridiem;
  setMeridiem: React.Dispatch<SetStateAction<TimeMeridiem>>;
  handleNext: () => void;
  handlePrev: () => void;
  time: ITimePickerFormat | undefined;
}

export type IRenderTimeJSX =
  | React.ReactNode
  | ((props: IRenderTimeJSXProps) => React.ReactNode);

export interface ITimeAnalogGroupProps
  extends Omit<
    ITimePickerAnalog,
    | "view"
    | "handleNext"
    | "setView"
    | "allowedView"
    | "meridiem"
    | "setTime"
    | "time"
    | "setMeridiem"
    | "selectedMinute"
    | "selectedSeconds"
    | "selectedHour"
    | "setSelectedMinute"
    | "setSelectedHour"
    | "setSelectedSeconds"
  > {
  allowedView?: TimeView[];
  arrowsColor?: string;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  setIsShown: React.Dispatch<SetStateAction<boolean>>;
  shouldCloseOnSelect?: boolean;
  hideTopArea?: boolean;
  hideBottomArea?: boolean;
  setAllowedComponents?: React.Dispatch<SetStateAction<HTMLElement[]>>;
  topAreaJSX?: IRenderTimeJSX;
  bottomAreaJSX?: IRenderTimeJSX;
  leftAreaJSX?: IRenderTimeJSX;
  rightAreaJSX?: IRenderTimeJSX;
  noButtonAnimation?: boolean;
}

export const TimeAnalogGroup = (props: ITimeAnalogGroupProps) => {
  const [view, setView] = useState<TimeView>("hour");
  const [allowedView, setAllowedView] = useState<TimeView[]>([
    "hour",
    "minute",
  ]);
  const [meridiem, setMeridiem] = useState<TimeMeridiem>("AM");
  const [selectedHour, setSelectedHour] = useState<number>();
  const [selectedMinute, setSelectedMinute] = useState<number>();
  const [selectedSeconds, setSelectedSeconds] = useState<number>();
  const [time, setTime] = useState<ITimePickerFormat>();

  useEffect(() => {
    if (props.allowedView) {
      setAllowedView(props.allowedView);
    }

    if (
      !props.allowedView?.includes("hour") &&
      props.allowedView?.includes("minute")
    ) {
      setView("minute");
    }

    if (
      !props.allowedView?.includes("hour") &&
      !props.allowedView?.includes("minute") &&
      props.allowedView?.includes("second")
    ) {
      setView("second");
    }
  }, []);

  useEffect(() => {
    setTime({
      hour:
        selectedHour !== undefined
          ? convert12HourTo24Hour(selectedHour!, meridiem)
          : undefined,
      minute: selectedMinute,
      second: selectedSeconds,
    });
  }, [meridiem, selectedHour, selectedMinute, selectedSeconds]);

  const handleNext = useCallback(() => {
    if (view === "hour" && allowedView.includes("minute")) {
      setView("minute");
      return;
    }
    if (view === "minute" && allowedView.includes("second")) {
      setView("second");
      return;
    }

    if (props.shouldCloseOnSelect) {
      props.setIsShown?.(false);
    }
  }, [allowedView, props.setIsShown, props.shouldCloseOnSelect, view]);

  const handlePrev = useCallback(() => {
    if (view === "second" && allowedView.includes("minute")) {
      setView("minute");
      return;
    }
    if (view === "minute" && allowedView.includes("hour")) {
      setView("hour");
    }
  }, [allowedView, view]);

  const renderCustomJSX = (renderJSX?: IRenderTimeJSX) => {
    if (!renderJSX) return undefined;
    if (typeof renderJSX === "function") {
      const content = renderJSX({
        handleNext,
        handlePrev,
        setView,
        view,
        meridiem,
        setMeridiem,
        time,
      });
      return <div data-type="custom-jsx">{content}</div>;
    }
    return <div data-type="custom-jsx">{renderJSX}</div>;
  };

  const topAreaJSX = renderCustomJSX(props.topAreaJSX);
  const bottomAreaJSX = renderCustomJSX(props.bottomAreaJSX);
  const leftAreaJSX = renderCustomJSX(props.leftAreaJSX);
  const rightAreaJSX = renderCustomJSX(props.rightAreaJSX);

  return (
    <div
      className={cn(
        ` 
          time-picker-wrapper 
          rn-rounded-md 
          rn-border-t 
          rn-border-solid 
          rn-border-gray-300
          rn-bg-white
          rn-px-[1rem]
          rn-pb-[0.5rem] 
          rn-pt-[0.625rem] 
          rn-shadow-lg 
          dark:rn-border-gray-700
          dark:rn-bg-dreamless-sleep
          `,
        props.timePickerWrapperClass,
      )}
    >
      <Show when={!!topAreaJSX}>{topAreaJSX}</Show>
      <div className={"rn-flex rn-flex-row"}>
        <Show when={!!leftAreaJSX}>{leftAreaJSX}</Show>
        <div>
          <Show when={!props.hideTopArea}>
            <TimeAnalogGroupTop
              {...props}
              view={view}
              allowedView={allowedView}
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          </Show>

          <TimeAnalog
            {...props}
            allowedView={allowedView}
            view={view}
            setView={setView}
            handleNext={handleNext}
            meridiem={meridiem}
            handleTimeChange={props.handleTimeChange}
            setMeridiem={setMeridiem}
            selectedHour={selectedHour}
            selectedMinute={selectedMinute}
            selectedSeconds={selectedSeconds}
            setSelectedHour={setSelectedHour}
            setSelectedMinute={setSelectedMinute}
            setSelectedSeconds={setSelectedSeconds}
          />

          <Show when={allowedView.includes("hour") && !props.hideBottomArea}>
            <TimeAnalogBottom
              {...props}
              meridiem={meridiem}
              setMeridiem={setMeridiem}
            />
          </Show>
        </div>
        <Show when={!!rightAreaJSX}>{rightAreaJSX}</Show>
      </div>

      <Show when={!!bottomAreaJSX}>{bottomAreaJSX}</Show>
    </div>
  );
};
