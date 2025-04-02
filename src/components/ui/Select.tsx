"use client";
import {
  Select as SelectNextUI,
  SelectItem as SelectItemNextUI,
} from "@heroui/react";
import { extendVariants } from "@heroui/react";

export const Select = extendVariants(SelectNextUI, {
  variants: {
    variant: {
      bordered: {
        trigger:
          "border-1 rounded-[6px] border-border bg-white dark:bg-transparent",
        popoverContent: "bg-white dark:bg-background rounded-[6px] shadow-sm",
      },
      flat: {
        trigger:
          "rounded-[6px] bg-content1 data-[hover=true]:dark:bg-dark-surface-sub",
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
      default: {
        base: "data-[selectable=true]:dark:focus:bg-dark-surface-sub! transition-none data-[hover=true]:bg-light-surface-sub! data-[hover=true]:transition-none data-[hover=true]:dark:bg-dark-surface-sub!",
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
  compoundVariants: [],
});
