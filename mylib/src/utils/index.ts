import {
  clickOutside,
  getMonthName,
  getToday,
  isBeforeDate,
  formatDate,
  labelFormat,
  convertDateObjectToDate,
  convertDateToDateObject,
  checkIfItsTodayDate,
  convert12HourTo24Hour,
  convert24HourTo12Hour,
  getAmPm,
  getCurrentTime,
  smartDropDownPosition,
  leadingZeros,
} from "@rnwonder/simple-datejs/utils";

interface Utils {
  clickOutside: typeof clickOutside;
  getMonthName: typeof getMonthName;
  getToday: typeof getToday;
  isBeforeDate: typeof isBeforeDate;
  formatDate: typeof formatDate;
  labelFormat: typeof labelFormat;
  convertDateObjectToDate: typeof convertDateObjectToDate;
  convertDateToDateObject: typeof convertDateToDateObject;
  checkIfItsTodayDate: typeof checkIfItsTodayDate;
  convert12HourTo24Hour: typeof convert12HourTo24Hour;
  convert24HourTo12Hour: typeof convert24HourTo12Hour;
  leadingZeros: typeof leadingZeros;
  getAmPm: typeof getAmPm;
  getCurrentTime: typeof getCurrentTime;
  smartDropDownPosition: typeof smartDropDownPosition;
}

const utils = (): Utils => ({
  clickOutside,
  getMonthName,
  getToday,
  isBeforeDate,
  formatDate,
  labelFormat,
  convertDateObjectToDate,
  convertDateToDateObject,
  checkIfItsTodayDate,
  convert12HourTo24Hour,
  convert24HourTo12Hour,
  leadingZeros,
  getAmPm,
  getCurrentTime,
  smartDropDownPosition,
});

export * from "./class";
export * from "./general";

export { utils };
