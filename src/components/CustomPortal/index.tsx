"use client";

import { clickOutside } from "@rnwonder/simple-datejs/utils";
import React, { useEffect, useRef } from "react";
import { SetStateAction } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/class";

export interface ModalProps {
  children: any;
  isShown?: boolean;
  reference?: HTMLElement | null;
  class?: string;
  setIsShown?: React.Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  useRefWidth?: boolean;
  style?: React.CSSProperties;
  referenceId?: string;
  hideDefaultStyle?: boolean;
  onClickOutside?: (e?: MouseEvent) => void;
  ignoreClickOutside?: boolean;
  innerWrapperClass?: string;
  clickOutsideRef?: HTMLElement | null;
  onClickOutsideRef?: (e?: MouseEvent) => void;
  portalContainer?: HTMLElement;
}

export const CustomPortal: React.FC<ModalProps> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);

  const {
    clickOutsideRef,
    isShown,
    ignoreClickOutside,
    onClickOutsideRef,
    setIsShown,
    onClickOutside,
    onClose,
    referenceId,
    reference,
    portalContainer,
    useRefWidth,
    class: className,
    style,
    hideDefaultStyle,
    innerWrapperClass,
    children,
  } = props;

  useEffect(() => {
    const clickOutsideElement = clickOutsideRef;
    if (!clickOutsideElement) return;

    const cleanup = clickOutside(clickOutsideElement, (e) => {
      if (!isShown) return;
      if (ignoreClickOutside) return;
      if (onClickOutsideRef) {
        onClickOutsideRef(e);
        return;
      }
      setIsShown?.(false);
    });

    return cleanup;
  }, [
    clickOutsideRef,
    isShown,
    ignoreClickOutside,
    onClickOutsideRef,
    setIsShown,
  ]);

  useEffect(() => {
    if (!isShown || ignoreClickOutside) return;

    const handleClickOutside = (e: MouseEvent) => {
      // Wait for the next tick to ensure the ref is set
      setTimeout(() => {
        if (divRef.current && !divRef.current.contains(e.target as Node)) {
          if (onClickOutside) {
            onClickOutside(e);
            return;
          }
          setIsShown?.(false);
          onClose?.();
        }
      }, 0);
    };

    // Small delay to ensure the portal is mounted and ref is set
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isShown, ignoreClickOutside, onClickOutside, setIsShown, onClose]);

  if (!isShown) {
    return null;
  }

  const mountElement = referenceId
    ? document.getElementById(referenceId)
    : reference || portalContainer || (document.getElementById("modal") as any);

  if (!mountElement) {
    return null;
  }

  return createPortal(
    <div
      ref={divRef}
      className={className}
      style={{
        ...(useRefWidth &&
          (reference ||
            portalContainer ||
            (referenceId && document.getElementById(referenceId))) && {
            width: mountElement?.clientWidth + "px",
          }),
        ...style,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className={cn(
          {
            [`
                rn-absolute
                rn-z-10
                rn-flex
                rn-w-full
                rn-flex-col
                rn-bg-transparent
            `]: !hideDefaultStyle,
          },
          innerWrapperClass,
        )}
        style={{
          ...(useRefWidth && {
            width: mountElement?.clientWidth + "px",
          }),
        }}
      >
        {children}
      </div>
    </div>,
    mountElement,
  );
};
