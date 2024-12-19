"use client";
import { DatePicker as DatePickerNextUI } from "@nextui-org/date-picker";
import { extendVariants } from "@nextui-org/react";

const DatePicker = extendVariants(DatePickerNextUI, {
  variants: {},
  defaultVariants: {
    variant: "bordered",
  },
});
export default DatePicker;
