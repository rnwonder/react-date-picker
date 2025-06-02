import { cn } from "../../utils";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  ShadPopover,
  ShadPopoverContent,
  ShadPopoverTrigger,
} from "../ui/popover";

export type IPopOverSJContentPropType =
  | React.ReactNode
  | (({ close }: { close: () => void }) => React.ReactNode);

export type IPopOverPositionX = "left" | "right" | "center";
export type IPopOverPositionY = "top" | "bottom" | "auto";

export interface PopoverProps {
  children: React.ReactNode;
  content: IPopOverSJContentPropType;
  positionX?: IPopOverPositionX;
  positionY?: IPopOverPositionY;
  useRefWidth?: boolean;
  isShown?: boolean;
  setIsShown?: React.Dispatch<SetStateAction<boolean>>;
  onClickOutside?: (
    e?: Event,
    isShown?: React.Dispatch<SetStateAction<boolean>>,
  ) => void;
  handleChildrenClick?: (
    setIsShown?: React.Dispatch<SetStateAction<boolean>>,
  ) => void;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  zIndex?: number;
  width?: string | number;
  contentClassName?: string;
  allowedComponents?: HTMLElement[];
}

export const Popover = React.forwardRef((props: PopoverProps, ref) => {
  const [shown, setShown] = useState(false);
  const [delayShown, setDelayShown] = useState(false);

  useEffect(() => {
    if (props.isShown || shown) {
      setTimeout(() => {
        setDelayShown(true);
      }, 100);
    } else {
      setDelayShown(false);
    }
  }, [props.isShown, shown]);

  useEffect(() => {
    if (!props.isShown && !shown) {
      props.onClose?.();
      return;
    }
    props.onOpen?.();
  }, [props.isShown, shown]);

  const handleClose = () => {
    if (props.setIsShown) {
      props.setIsShown(false);
    } else {
      setShown(false);
    }
  };

  const renderContent = () => {
    if (typeof props.content === "function") {
      const content = props.content({ close: handleClose });
      return <div data-type="dropdown">{content}</div>;
    }

    return <div data-type="dropdown">{props.content}</div>;
  };

  return (
    <ShadPopover
      open={props.isShown || shown}
      onOpenChange={(isOpen) => {
        if (props.handleChildrenClick && isOpen) {
          props.handleChildrenClick(props.setIsShown || setShown);
          return;
        }

        if (props.setIsShown) {
          props.setIsShown(isOpen);
          return;
        }

        setShown(isOpen);
      }}
    >
      <ShadPopoverTrigger
        asChild
        className={cn(props.className)}
        style={{
          ...(props.width && { width: props.width || "100%" }),
        }}
      >
        {props.children}
      </ShadPopoverTrigger>

      <ShadPopoverContent
        ref={ref as any}
        side={
          !props.positionY || props.positionY === "auto"
            ? "bottom"
            : props.positionY
        }
        align={
          props.positionX === "left"
            ? "start"
            : props.positionX === "right"
              ? "end"
              : "center"
        }
        className={cn(
          `
              rn-duration-350
              rn-delay-50
              rn-transition-transform
              rn-ease-in-out
              motion-reduce:rn-transition-none
          `,
          {
            "rn-translate-y-[0rem] rn-opacity-100": delayShown,
            "-rn-translate-y-[1rem] rn-opacity-0": !delayShown,
          },
          props.contentClassName,
        )}
        style={{
          zIndex: props.zIndex || 10000,
        }}
        onInteractOutside={(e: any) => {
          if (props.onClickOutside) {
            e.preventDefault();
            props.onClickOutside(e, props.setIsShown || setShown);
          }
        }}
      >
        <div
          className={cn(
            `
                rn-duration-350
                rn-transition-opacity
                rn-ease-in-out
                motion-reduce:rn-transition-none
            `,
            {
              "rn-opacity-100 scale-100": delayShown,
              "rn-opacity-0 scale-90": !delayShown,
            },
            props.contentClassName,
          )}
        >
          {renderContent()}
        </div>
      </ShadPopoverContent>
    </ShadPopover>
  );
});
