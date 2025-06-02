import DatePickerGroup, { DatePickerInputSJProps } from "./DatePickerGroup";

const DatePicker = (props: DatePickerInputSJProps) => {
  const isClient = typeof window !== "undefined";
  if (!isClient) return null;
  return <DatePickerGroup {...props} />;
};

export default DatePicker;
