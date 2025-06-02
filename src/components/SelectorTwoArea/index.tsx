import { cn } from "../../utils";
import { SelectorOptionButton } from "../SelectorOptionButton";
import { defaultSelectorProps, SelectorTwoProps } from "../SelectorTwo";
import SelectorTwoYearOptions from "../SelectorTwoYearOptions";
import { handleSelectorOptionClick } from "@rnwonder/simple-datejs/datePicker";
import Show from "../Helpers/Show";

function SelectorTwoArea(props: SelectorTwoProps) {
  const handleOptionClick = (index: number, value: string) => {
    handleSelectorOptionClick(index, value, props, () => {
      props.setSelectorTwoProps?.(defaultSelectorProps);
      props.setShowSelectorTwo?.(false);
      props.close?.();
    });
  };

  return (
    <div
      className={cn(`
        date-full-size-selector-area
        rn-z-50
        rn-flex
        rn-flex-col
        rn-justify-between
       
        rn-gap-y-4 
        rn-p-2
      `)}
    >
      <Show when={!props.useValueAsName}>
        <div
          className={cn(
            `
            date-month-full-size-selector-options-wrapper 
            rn-grid 
            rn-grid-cols-3 
            rn-gap-x-1 
            rn-gap-y-4
          `,
          )}
        >
          {props.optionsArray?.map((month, index) => (
            <SelectorOptionButton
              {...props}
              value={month}
              index={index}
              key={index + month}
              className={cn(
                `
                  rn-p-2 
                  rn-text-sm
                `,
                props.className,
              )}
              handleOptionClick={handleOptionClick}
            />
          ))}
        </div>
      </Show>

      <Show when={props.useValueAsName}>
        {props.yearArray?.map((yearData, index) => (
          <SelectorTwoYearOptions
            {...props}
            key={index + yearData.join(",")}
            array={yearData}
            handleOptionClick={handleOptionClick}
          />
        ))}
      </Show>
    </div>
  );
}

export default SelectorTwoArea;
