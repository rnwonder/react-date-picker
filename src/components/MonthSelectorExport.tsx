import { MonthSelector, MonthSelectorProps } from "./MonthSelector";
import { SelectorProps } from "./Selector";
import SelectorTwo, { defaultSelectorProps } from "./SelectorTwo";
import { Popover } from "./Popover";
import { cn } from "../utils";
import { useState } from "react";

export interface MonthSelectorExportProps
  extends Omit<
    MonthSelectorProps,
    "type" | "setShowSelectorTwo" | "setSelectorTwoProps" | "showSelectorTwo"
  > {}

const MonthSelectorExport = (props: MonthSelectorExportProps) => {
  const [showSelectorTwo, setShowSelectorTwo] = useState(false);
  const [selectorTwoProps, setSelectorTwoProps] =
    useState<SelectorProps>(defaultSelectorProps);
  return (
    <>
      {props.monthSelectorType === "compact-dropdown" ? (
        <MonthSelector
          {...props}
          setSelectorTwoProps={setSelectorTwoProps}
          setShowSelectorTwo={setShowSelectorTwo}
          showSelectorTwo={showSelectorTwo}
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
              />
            </div>
          )}
          width={"fit-content"}
          onClose={() => {
            setShowSelectorTwo(false);
            setSelectorTwoProps(defaultSelectorProps);
          }}
        >
          <MonthSelector
            {...props}
            setSelectorTwoProps={setSelectorTwoProps}
            setShowSelectorTwo={setShowSelectorTwo}
            showSelectorTwo={showSelectorTwo}
          />
        </Popover>
      )}
    </>
  );
};

export default MonthSelectorExport;
