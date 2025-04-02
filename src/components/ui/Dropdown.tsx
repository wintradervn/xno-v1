"use client";
import { extendVariants, Dropdown as DropdownLib, DropdownItem as DropdownItemLib } from "@heroui/react";

const Dropdown = extendVariants(DropdownLib, {
  variants: {
    color: {
      default: {
        content: "bg-background rounded-[8px] p-2",
        arrow: "bg-background",
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export const DropdownItem = extendVariants(DropdownItemLib, {
  variants: {
    color: {
      default: {
        base: "p-1 rounded-[4px]",
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export default Dropdown;
