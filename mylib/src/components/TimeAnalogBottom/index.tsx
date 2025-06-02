import { Button } from "../Button";
import { TimeMeridiem, TimeClassName } from "../../interface/general";
import { cn } from "../../utils";
import React, { SetStateAction } from "react";

interface ITimeAnalogBottomProps extends TimeClassName {
  meridiem: TimeMeridiem;
  setMeridiem: React.Dispatch<SetStateAction<TimeMeridiem>>;
  noButtonAnimation?: boolean;
}
export const TimeAnalogBottom = (props: ITimeAnalogBottomProps) => {
  const classString = (meridiem: TimeMeridiem) =>
    cn(
      `
        time-picker-meridiem-btn
        rn-aspect-square
        rn-w-[2.3rem]
        rn-flex-shrink-0
        rn-rounded-full
        dark:rn-text-white
        `,
      {
        [`
        dark:rn-bg-dark-time
        dark:hover:rn-bg-dark-time
        rn-bg-dark-time
        rn-text-white
        hover:rn-bg-dark-time
    `]: props.meridiem === meridiem,
      },
      props.timePickerMeridiemBtnClass,
    );
  return (
    <div
      className={cn(
        `
        time-picker-analog-bottom
        rn-flex
        rn-justify-between
      `,
        props.timePickerBottomAreaClass,
      )}
    >
      <Button
        className={classString("AM")}
        onClick={() => props.setMeridiem("AM")}
        noButtonAnimation={props.noButtonAnimation}
      >
        AM
      </Button>

      <Button
        className={classString("PM")}
        onClick={() => props.setMeridiem("PM")}
        noButtonAnimation={props.noButtonAnimation}
      >
        PM
      </Button>
    </div>
  );
};
