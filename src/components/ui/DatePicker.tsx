"use client";
import { DatePicker as DatePickerNextUI } from "@heroui/date-picker";
import { extendVariants } from "@heroui/react";

const DatePicker = extendVariants(DatePickerNextUI, {
  variants: {},
  defaultVariants: {
    variant: "bordered",
  },
});
export default DatePicker;
