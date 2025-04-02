"use client";
import { extendVariants, Popover as PopoverLib } from "@heroui/react";

const Popover = extendVariants(PopoverLib, {
  variants: {
    color: {
      default: {
        wrapper: "",
        content: "bg-white shadow-sm dark:bg-background rounded-[8px] p-3",
        arrow: "bg-background",
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export default Popover;
