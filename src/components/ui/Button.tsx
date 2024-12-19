"use client";
import { Button as ButtonNextUI } from "@nextui-org/button";
import { extendVariants } from "@nextui-org/react";

const Button = extendVariants(ButtonNextUI, {
  variants: {
    color: {
      default: "bg-default-800 text-neutral-300",
      muted: "bg-[#344054] text-muted text-medium font-medium",
      primary: "bg-linearpurple text-black text-medium font-medium",
      secondary: "bg-lineargreen text-black text-medium font-medium",
    },
    isDisabled: {},
    size: {
      xs: "px-2 min-w-12 h-6 text-tiny gap-1 rounded-small",
      md: "px-4 min-w-20 h-10 text-small gap-2 rounded-small",
      xl: "px-8 min-w-28 h-14 text-large gap-4 rounded-medium",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
  compoundVariants: [],
});
export default Button;
