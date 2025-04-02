"use client";
import { Input as InputNextUI } from "@heroui/input";
import { extendVariants } from "@heroui/react";

const Input = extendVariants(InputNextUI, {
  variants: {
    variant: {
      bordered: {
        inputWrapper: "border-1 rounded-[4px] border-border bg-card!",
      },
    },
    color: {
      default: {
        inputWrapper: [
          "bg-content1 text-neutral-700 rounded-[6px]",
          "dark:data-[hover=true]:bg-slate-900",
          "focus-within:bg-background",
          "dark:group-data-[focus=true]:bg-slate-800",
          "dark:group-data-[focus=true]:text-neutral-500",
        ],
        input:
          "data-[filled-within=true]:text-foreground placeholder:text-neutral-700 text-neutral-500 dark:group-data-[focus=true]:placeholder:text-neutral-500",
      },
      reverse: {
        inputWrapper: [
          "bg-card text-neutral-500",
          "dark:data-[hover=true]:bg-slate-900",
          "focus-within:bg-background",
          "dark:group-data-[focus=true]:bg-slate-800",
          "dark:group-data-[focus=true]:text-neutral-500",
        ],
        input:
          "placeholder:text-neutral-500 text-foreground! dark:group-data-[focus=true]:placeholder:text-neutral-500",
      },
    },
    isDisabled: {},
    size: {},
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
  compoundVariants: [],
});
export default Input;
