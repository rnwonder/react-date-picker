# @rnwonder/react-date-picker

A simple and reusable Datepicker component for ReactJS ([Demo](https://stackblitz.com/edit/solidjs-templates-dof6jl?file=src%2FApp.tsx))

[Documentation](https://soliddatepicker.netlify.app/)

![Screenshot 2023-05-20 084944.jpg](https://res.cloudinary.com/dfbebf7x0/image/upload/v1706819632/Screenshot_2024-02-01_212902_un7lqa.jpg)
![Screenshot 2023-05-20 084945.jpg](https://res.cloudinary.com/dfbebf7x0/image/upload/v1706819632/Screenshot_2024-02-01_213012_ay4sa9.jpg)
![Screenshot 2023-05-20 084946.jpg](https://res.cloudinary.com/dfbebf7x0/image/upload/v1706819632/Screenshot_2024-02-01_213053_q1qbdl.jpg)

## Installation

```bash
npm i @rnwonder/react-date-picker
```

```bash
yarn add @rnwonder/react-date-picker
```

```bash
pnpm add @rnwonder/react-date-picker
```

This package depends on `react` and `react-dom` so you need to have them installed

## Usage

```tsx
import '@rnwonder/react-date-picker/dist/style.css'
import DatePicker from "@rnwonder/react-date-picker";

const App = () => {
  return (
    <DatePicker
      onChange={(data) => {
        if (data.type === "range") {
          console.log(data.startDate, data.endDate);
        }
        if (data.type === "single") {
          console.log(data.selectedDate);
        }
        if (data.type === "multiple") {
          console.log(data.multipleDates);
        }
      }}
    />
  );
};
```

### Styling With Props, Classes, or Attributes

- You can style the datepicker using class props, color props, default css class names or data attributes.
- Check out the [documentation](https://soliddatepicker.netlify.app/docs/styling/) for more details

### Themes
- We have a growing list of themes you can use. Please check them out [here](https://soliddatepicker.netlify.app/docs/themes/)

### Other Datepicker Props
- We have some other props that can be useful when working with the datepicker. Please check them out [here](https://soliddatepicker.netlify.app/docs/other-props/)

### Formatting
- Formatting the datepicker input label is done with the `formatInputLabel`, `formatInputLabelRangeStart`, `formatInputLabelRangeEnd`, `localOptions` and `locale` props
- Check out the [documentation](https://soliddatepicker.netlify.app/docs/formatting/) for more details

### Utility Functions
- We have some utility functions that can be useful when working with the datepicker. Please check them out [here](https://soliddatepicker.netlify.app/docs/helpers-utilities/)

### Contributing
- Send a message to the author on [X](https://twitter.com/Rnwonder101) if you have any questions or suggestions. Don't forget to follow me on twitter.
- Feel free to open an issue [here](https://github.com/rnwonder/solid-date-picker/issues) if you run into any problem while using this library.
- You can also contribute to this project [here](https://github.com/rnwonder/solid-date-picker/pulls).

<a href="https://www.buymeacoffee.com/rnwonderw" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40px" width="170px"></a>
