import { Button } from "../Button";
import { PrevIcon } from "../PrevIcon";
import { NextIcon } from "../NextIcon";
import { TimeView, TimeClassName } from "../../interface/general";
import { cn } from "../../utils";
import React from "react";

interface ITimeAnalogGroupTopProps extends TimeClassName {
  view: TimeView;
  handlePrev: () => void;
  handleNext: () => void;
  arrowsColor?: string;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  allowedView?: TimeView[];
  noButtonAnimation?: boolean;
}
export const TimeAnalogGroupTop = (props: ITimeAnalogGroupTopProps) => {
  return (
    <div
      className={cn(`
        rn-mb-2
        rn-flex
        rn-justify-between`)}
    >
      <div className="rn-flex rn-items-center rn-justify-center rn-font-medium dark:rn-text-white">
        {props.view === "hour" ? "HH" : props.view === "minute" ? "MM" : "SS"}
      </div>

      <div>
        <Button
          className={cn(
            `
              time-analog-prev-next-btn
              time-analog-prev-btn
              rn-h-[2rem]
              rn-w-[2rem]
              rn-rounded-full 
              rn-text-black
              disabled:rn-cursor-not-allowed
              disabled:rn-bg-transparent
              dark:rn-text-white
              `,
            props.prevTimeViewBtnClass,
            props.prevNextTimeViewBtnClass,
          )}
          data-prev={true}
          data-type={"time-analog-prev-next-btn"}
          aria-label={"Move backward to switch to the previous time view"}
          data-scope={"button"}
          data-part={"root"}
          disabled={
            props.view === "hour" ||
            (props.view === "minute" && !props.allowedView?.includes("hour")) ||
            (props.view === "second" && !props.allowedView?.includes("minute"))
          }
          onClick={props.handlePrev}
          style={{
            ...(props.arrowsColor && { color: props.arrowsColor }),
          }}
          noButtonAnimation={props.noButtonAnimation}
        >
          {props.prevIcon || (
            <PrevIcon className={"rn-w-[17px]"} color={props.arrowsColor} />
          )}
        </Button>
        <Button
          className={cn(
            `
              time-analog-prev-next-btn
              time-analog-next-btn
              rn-h-[2rem]
              rn-w-[2rem]
              rn-rounded-full 
              rn-text-black
              disabled:rn-cursor-not-allowed
              disabled:rn-bg-transparent
              dark:rn-text-white
              `,
            props.nextTimeViewBtnClass,
            props.prevNextTimeViewBtnClass,
          )}
          data-next={true}
          aria-label={"Move forward to switch to the next time view."}
          data-scope={"button"}
          data-part={"root"}
          data-type={"time-analog-prev-next-btn"}
          onClick={props.handleNext}
          disabled={
            props.view === "second" ||
            (props.view === "minute" && !props.allowedView?.includes("second"))
          }
          style={{
            ...(props.arrowsColor && { color: props.arrowsColor }),
          }}
          noButtonAnimation={props.noButtonAnimation}
        >
          {props.nextIcon || (
            <NextIcon className={"rn-w-[17px]"} color={props.arrowsColor} />
          )}
        </Button>
      </div>
    </div>
  );
};
