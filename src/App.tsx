import { useState } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Popover } from "./components/Popover";
// import { PickerValue } from "./interface/general.ts";
// import { getToday } from "@rnwonder/simple-datejs/utils";
import DatePickerGroup from "./components/DatePickerGroup";
// import { TimeAnalogGroup } from "./components/TimeAnalogGroup";
import TimeAnalogPicker from "./components/TimeAnalogPicker";
import { CustomPortal } from "./components/CustomPortal";

function App() {
  // const [count, setCount] = useState(0);
  const [isShown, setIsShown] = useState(true);
  // const [date, setDate] = useState<PickerValue>({
  //   label: "",
  //   value: {
  //     selectedDateObject: getToday(),
  //   },
  // });

  return (
    <div className={"rn-flex rn-flex-col"}>
      <p>asasasas {isShown}</p>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <TimeAnalogPicker shouldCloseOnSelect />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <DatePickerGroup
        weekStartDay={0}
        weekDaysType={"short"}
        // locale={"zh-u-nu-hanidec"}
        monthSelectorTopLabel={"hhasa"}
        yearSelectorCount={10}
        renderInput={({ showDate, value }) => (
          <div>
            <input className={"rn-bg-red-200"} value={value.label} />
            <button onClick={showDate}>Open</button>
          </div>
        )}
      />
      {/* <Button onClick={() => setIsShown(true)}>Click me</Button> */}

      <Popover content={<div>I am a pop pver</div>}>
        <Button>Hey hey</Button>
      </Popover>

        <button
        className={"rn-w-[10rem] rn-bg-white"}
        id={"portal"}
        onClick={() => setIsShown(true)}
        
      >
        Hey Click me
      </button>
      <CustomPortal
        setIsShown={setIsShown}
        isShown={isShown}
        // reference={ref}
        referenceId={"portal"}
      >
        <div>
          <p>I am a portal</p>
        </div>
      </CustomPortal>

      <Popover
        content={
          <div
            className={"rn-start rn-flex rn-flex-col rn-gap-y-4 rn-px-4 rn-py-4"}
          >
            <button
              className={"rn-rounded-md rn-p-1 rn-text-start hover:rn-bg-slate-200"}
            >
              Open
            </button>
            <button
              className={"rn-rounded-md rn-p-1 rn-text-start hover:rn-bg-slate-200"}
            >
              Copy
            </button>
            <button
              className={"rn-rounded-md rn-p-1 rn-text-start hover:rn-bg-slate-200"}
            >
              Download
            </button>
          </div>
        }
        contentClassName={"rn-bg-white  rn-shadow-md rn-rounded-md"}
        className={"rn-w-40"}
        useRefWidth
      >
        <button>Click to see a popover</button>
      </Popover>
    </div>
  );
}

export default App;
