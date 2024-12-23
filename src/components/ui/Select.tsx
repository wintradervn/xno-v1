"use client";
import {
  Select as SelectNextUI,
  SelectItem as SelectItemNextUI,
} from "@nextui-org/react";
import { extendVariants } from "@nextui-org/react";

export const Select = extendVariants(SelectNextUI, {
  variants: {
    variant: {
      bordered: {
        trigger: "border-1 rounded-[4px] border-neutral-800",
        popoverContent: "bg-background rounded-[6px]",
      },
      flat: {
        trigger: "rounded-[4px] bg-content1 data-[hover=true]:bg-slate-900",
        popoverContent: "bg-background rounded-[6px]",
      },
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
  compoundVariants: [],
});

export const SelectItem = extendVariants(SelectItemNextUI, {
  variants: {
    color: {
      default: {},
    },
  },
  defaultVariants: {},
  compoundVariants: [],
});
