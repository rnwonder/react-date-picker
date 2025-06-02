import React, { SetStateAction, useEffect, useRef } from "react";
import {
  DateObjectUnits,
  PickerRenderJSX,
  PickerRenderJSXProps,
} from "../interface/general";

export interface UseDatePickerRenderData extends Partial<PickerRenderJSXProps> {
  multipleObject?: DateObjectUnits[];
  endDay?: DateObjectUnits | undefined;
  startDay?: DateObjectUnits | undefined;
}

export default function useDatePickerRenderJSX(
  data: UseDatePickerRenderData,
  renderJSX?: PickerRenderJSX,
  setAllowedComponents?: React.Dispatch<SetStateAction<HTMLElement[]>>,
) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;
    setAllowedComponents?.((prev) => {
      return [...prev, ref.current];
    });
  }, [setAllowedComponents]);

  if (!renderJSX) return undefined;

  if (typeof renderJSX === "function") {
    const content = renderJSX({
      ...(data as any),
      setRefToAllowOutsideClick: ref,
      multipleDates: data.multipleObject,
      endDate: data.endDay,
      selectedDate: data.startDay,
    });
    return <div data-type="custom-jsx">{content}</div>;
  }

  return <div data-type="custom-jsx">{renderJSX}</div>;
}
