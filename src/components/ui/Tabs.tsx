"use client";
import { extendVariants, Tabs as TabsLib } from "@nextui-org/react";

const Tabs = extendVariants(TabsLib, {
  variants: {
    color: {
      primary: {
        tabContent: "group-data-[selected=true]:!text-black text-muted",
        tabList: "bg-neutral-800",
        tab: "w-fit",
        cursor: "bg-linearpurple",
      },
      secondary: {
        tabContent: "group-data-[selected=true]:!text-black text-muted",
        tabList: "bg-neutral-800",
        tab: "w-fit",
        cursor: "bg-lineargreen",
      },
      default: {
        tabContent: "text-muted group-data-[selected=true]:!text-white",
        tabList: "bg-content1 ",
        tab: "w-fit",
        cursor: "!bg-background",
      },
    },
    size: {
      default: {
        tabList: "px-0.5 rounded-[6px] h-[30px]",
        cursor: "rounded-[4px]",
        tab: "rounded-[4px] h-[26px] text-sm",
        tabContent: "group-data-[selected=true]:font-semibold font-normal",
      },
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

export default Tabs;
