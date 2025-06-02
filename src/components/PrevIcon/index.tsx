import React from "react";

interface IProps {
  color?: string;
  className?: string;
}

export const PrevIcon: React.FC<IProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill={props.color || "currentColor"}
      viewBox="0 0 256 256"
      data-scope="button"
      data-part="icon"
      className={props.className}
    >
      <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
    </svg>
  );
};
