"use client";
import { Checkbox as CheckboxNextUI } from "@nextui-org/react";
import { extendVariants } from "@nextui-org/react";

const Checkbox = extendVariants(CheckboxNextUI, {
  variants: {
    color: {
      default: {},
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
