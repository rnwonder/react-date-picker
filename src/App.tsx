import { useState } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Popover } from "./components/Popover";
// import { PickerValue } from "./interface/general.ts";
// import { getToday } from "@rnwonder/simple-datejs/utils";
import DatePickerGroup from "./components/DatePickerGroup";
// import { TimeAnalogGroup } from "./components/TimeAnalogGroup";
import TimeAnalogPicker from "./components/TimeAnalogPicker";

function App() {
  const [count, setCount] = useState(0);
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
      <Button onClick={() => setIsShown(true)}>Click me</Button>

      <Popover content={<div>I am a pop pver</div>}>
        <Button>Hey hey</Button>
      </Popover>

      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
