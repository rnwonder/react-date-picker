import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DatePicker from '@rnwonder/react-date-picker/index';
import Calendar from '@rnwonder/react-date-picker/calendar';
const App = () => {
  return (
    <div>
      <DatePicker />
      <Calendar />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
