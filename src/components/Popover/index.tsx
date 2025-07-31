"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { CustomPortal } from "../CustomPortal";
import { cn } from "../../utils";
import { smartDropDownPosition } from "@rnwonder/simple-datejs/utils";

export type IPopOverSJContentPropType =
  | React.ReactElement
  | (({ close }: { close: () => void }) => React.ReactElement);

export type IPopOverPositionX = "left" | "right" | "center";
export type IPopOverPositionY = "top" | "bottom" | "auto";

export interface PopoverProps {
  children: React.ReactElement;
  content: IPopOverSJContentPropType;
  positionX?: IPopOverPositionX;
  positionY?: IPopOverPositionY;
  useRefWidth?: boolean;
  isShown?: boolean;
  setIsShown?: React.Dispatch<React.SetStateAction<boolean>>;
  onClickOutside?: (
    e?: Event,
    isShown?: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
  handleChildrenClick?: (
    setIsShown?: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  zIndex?: number;
  width?: React.CSSProperties["width"];
  contentClassName?: string;
  portalContainer?: HTMLElement;
  disableOpenAnimation?: boolean;
}

export const Popover: React.FC<PopoverProps> = (props) => {
  const [top, setTop] = useState<string | undefined>();
  const [left, setLeft] = useState<string | undefined>();
  const [shown, setShown] = useState(false);
  const [delayShown, setDelayShown] = useState(false);
  const [hasOpen, setHasOpen] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    positionX = "center",
    positionY = "auto",
    isShown,
    setIsShown,
    onClickOutside,
    handleChildrenClick,
    className,
    onOpen,
    onClose,
    zIndex = 1000,
    width,
    contentClassName,
    portalContainer,
    useRefWidth,
    content,
    children,
  } = props;

  const positionDropDown = useCallback(
    (position?: { x?: IPopOverPositionX; y?: IPopOverPositionY }) => {
      if (!position) {
        position = {
          x: positionX,
          y: positionY,
        };
      }

      if (!elementRef.current || !popoverRef.current) return;

      const { left, top } = smartDropDownPosition({
        inputRef: () => elementRef.current,
        dropDownRef: () => popoverRef.current,
        positionX: position.x,
        positionY: position.y,
      });

      setLeft(left);
      setTop(top);
    },
    [positionX, positionY],
  );

  const isPopoverVisible = isShown || shown;

  // Handle scroll and resize events only when popover visibility changes
  useEffect(() => {
    if (!isPopoverVisible) return;

    const onScroll = () => {
      positionDropDown({
        y: positionY,
        x: positionX,
      });
    };

    document.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isPopoverVisible, positionDropDown, positionX, positionY]);

  // Handle delay shown state
  useEffect(() => {
    if (isPopoverVisible) {
      const timer = setTimeout(() => {
        setDelayShown(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDelayShown(false);
    }
  }, [isPopoverVisible]);

  // Handle open/close callbacks and positioning
  useEffect(() => {
    if (!isPopoverVisible && hasOpen) {
      setHasOpen(false);
      onClose?.();
      return;
    }

    if (isPopoverVisible && !hasOpen) {
      setHasOpen(true);
      onOpen?.();
    }
  }, [isPopoverVisible, hasOpen, onOpen, onClose]);

  // Position when delay shown changes
  useEffect(() => {
    if (!delayShown) return;
    positionDropDown({
      y: positionY,
      x: positionX,
    });
  }, [delayShown, positionDropDown, positionX, positionY]);

  // Create portal island on mount
  useEffect(() => {
    if (portalContainer) return;
    const portalIsland = document.getElementById("portal-island");
    if (portalIsland) return;
    const div = document.createElement("div");
    div.id = "portal-island";
    document.body.appendChild(div);
  }, [portalContainer]);

  const handleElementClick = () => {
    if (handleChildrenClick) {
      handleChildrenClick(setIsShown || setShown);
      return;
    }
    if (setIsShown) {
      setIsShown(!isShown);
    } else {
      setShown(!shown);
    }
  };

  const handleClose = () => {
    if (setIsShown) {
      setIsShown(false);
    } else {
      setShown(false);
    }
  };

  const renderContent = () => {
    if (typeof content === "function") {
      const contentElement = content({ close: handleClose });
      return <div data-type="dropdown">{contentElement}</div>;
    }

    return <div data-type="dropdown">{content}</div>;
  };

  return (
    <div
      onKeyUp={(e) => {
        if (e.key === "Escape" && isPopoverVisible) {
          handleClose();
        }
      }}
    >
      <div
        style={{
          ...(width && { width: width || "100%" }),
        }}
        className={cn(className)}
        ref={elementRef}
        onClick={handleElementClick}
      >
        {children}
      </div>

      <CustomPortal
        setIsShown={setIsShown || setShown}
        isShown={isPopoverVisible}
        {...(portalContainer
          ? { portalContainer: portalContainer }
          : { referenceId: "portal-island" })}
        hideDefaultStyle
        onClickOutside={
          onClickOutside
            ? (e?: MouseEvent) => onClickOutside?.(e, setIsShown || setShown)
            : undefined
        }
        reference={elementRef.current}
        useRefWidth={useRefWidth}
        style={{
          zIndex: zIndex,
          position: "fixed",
          ...(top && { top: top }),
          ...(left && { left: left }),
        }}
      >
        <div
          className={`
              ${
                !props.disableOpenAnimation
                  ? delayShown
                    ? `rn-translate-y-[0rem] rn-opacity-100`
                    : `-rn-translate-y-[1rem] rn-opacity-0`
                  : `rn-translate-y-[0rem] rn-opacity-100`
              }
              rn-duration-350 
              rn-delay-50
              rn-transition-transform
              rn-ease-in-out
              motion-reduce:rn-transition-none
          `}
          ref={popoverRef}
        >
          <div
            className={cn(
              `
                ${
                  delayShown
                    ? `scale-100 rn-opacity-100`
                    : `scale-90 rn-opacity-0`
                }
                rn-transition-opacity
                rn-ease-in-out
                motion-reduce:rn-transition-none
            `,
              {
                "rn-duration-350 ": !props.disableOpenAnimation,
                "rn-duration-0 ": props.disableOpenAnimation,
              },
              contentClassName,
            )}
          >
            {renderContent()}
          </div>
        </div>
      </CustomPortal>
    </div>
  );
};
