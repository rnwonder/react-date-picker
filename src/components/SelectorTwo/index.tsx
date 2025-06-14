import { cn } from "../../utils";
import { SelectorProps } from "../Selector";
import SelectorTwoTop from "../SelectorTwoTop";
import SelectorTwoArea from "../SelectorTwoArea";
import React, { SetStateAction, useEffect, useRef } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const defaultSelectorProps = {
  option: 0,
  setOption: () => {},
  optionsArray: [],
};

export interface SelectorTwoProps extends Partial<SelectorProps> {
  setSelectorTwoProps?: React.Dispatch<SetStateAction<SelectorProps>>;
  setShowSelectorTwo?: React.Dispatch<SetStateAction<boolean>>;
  setAllowedComponents?: React.Dispatch<SetStateAction<HTMLElement[]>>;
  close?: () => void;
  monthSelectorTopLabel?: string;
}

const SelectorTwo = ({ setAllowedComponents, ...props }: SelectorTwoProps) => {
  const selectorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selectorRef.current) return;

    setAllowedComponents?.((prev) => [...prev, selectorRef.current!]);
  }, [setAllowedComponents]);
  return (
    <div
      className={cn(
        `
        date-selector-wrapper
        rn-absolute
        rn-left-0
        rn-top-0
        rn-z-50
       
        rn-max-h-fit
        rn-w-full
        rn-rounded-md 
        rn-bg-white 
        rn-pb-[0.5rem]
        rn-pt-[0.625rem] 
        rn-shadow-lg
        dark:rn-bg-dreamless-sleep 
      `,
        props.monthYearSelectorWrapperClass,
      )}
      data-scope={"date-picker"}
      data-type={"date-selector-wrapper"}
      style={{
        ...(props.backgroundColor && {
          backgroundColor: props.backgroundColor,
        }),
      }}
      ref={selectorRef}
      data-part={"grid"}
      aria-roledescription={
        props.useValueAsName ? "select year" : "select month"
      }
    >
      <SelectorTwoTop {...props} isYear={props.useValueAsName} />

      <SelectorTwoArea {...props} yearArray={props.yearArray} />
    </div>
  );
};

export default SelectorTwo;
