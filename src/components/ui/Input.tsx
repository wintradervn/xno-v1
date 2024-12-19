"use client";
import { Input as InputNextUI } from "@nextui-org/input";
import { extendVariants } from "@nextui-org/react";

const Input = extendVariants(InputNextUI, {
  variants: {
    variant: {
      bordered: {
        inputWrapper: "border-1 rounded-[4px] border-neutral-800 !bg-card",
      },
    },
    color: {
      default: {
        // inputWrapper: "bg-background data-[hover=true]:bg-zinc-800 focus-winthin:text-neutral-500 text-neutral-700",
        inputWrapper: [
          "bg-content1 text-neutral-700 rounded-[6px]",
          "data-[hover=true]:bg-slate-900",
          "focus-within:bg-slate-800",
          "group-data-[focus=true]:bg-slate-800",
          "group-data-[focus=true]:text-neutral-500",
        ],
        input:
          "data-[filled-within=true]:text-white placeholder:text-neutral-700 text-neutral-500 group-data-[focus=true]:placeholder:text-neutral-500",
      },
      reverse: {
        inputWrapper: [
          "bg-card text-neutral-500",
          "data-[hover=true]:bg-slate-900",
          "focus-within:bg-slate-800",
          "group-data-[focus=true]:bg-slate-800",
          "group-data-[focus=true]:text-neutral-500",
        ],
        input:
          "placeholder:text-neutral-500 !text-white group-data-[focus=true]:placeholder:text-neutral-500",
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
