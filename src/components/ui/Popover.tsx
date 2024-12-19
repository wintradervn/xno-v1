"use client";
import { extendVariants, Popover as PopoverLib } from "@nextui-org/react";

const Popover = extendVariants(PopoverLib, {
  variants: {
    color: {
      default: {
        wrapper: "",
        content: "bg-background rounded-[8px] p-3",
        arrow: "bg-background",
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export default Popover;
