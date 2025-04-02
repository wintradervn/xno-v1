"use client";
import { Checkbox as CheckboxNextUI } from "@heroui/react";
import { extendVariants } from "@heroui/react";

const Checkbox = extendVariants(CheckboxNextUI, {
  variants: {
    color: {
      default: {
        wrapper: "flex items-center gap-2",
        input: "w-4 h-4",
        label: "text-sm",
        base: "bg-red",
        hiddenInput: "bg-red",
        checked: "bg-red",
      },
    },
    isDisabled: {},
    size: {},
  },
  defaultVariants: {
    size: "md",
    radius: "sm",
  },
  compoundVariants: [],
});
export default Checkbox;
