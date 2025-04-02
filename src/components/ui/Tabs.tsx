"use client";
import { extendVariants, Tabs as TabsLib } from "@heroui/react";

const Tabs = extendVariants(TabsLib, {
  variants: {
    color: {
      primary: {
        tabContent: "group-data-[selected=true]:text-black! text-muted",
        tabList: "bg-background",
        tab: "w-fit",
        cursor: "bg-linearpurple",
      },
      secondary: {
        tabContent: "group-data-[selected=true]:text-black! text-muted",
        tabList: "bg-background",
        tab: "w-fit",
        cursor: "bg-purple dark:bg-lineargreen",
      },
      default: {
        tabContent: "text-muted group-data-[selected=true]:text-foreground!",
        tabList: "bg-content1",
        tab: "w-fit",
        cursor: "bg-background!",
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
    variant: {
      underlined: {
        tabList: "bg-transparent! overflow-auto no-scrollbar ",
        base: "overflow-auto no-scrollbar max-w-full",
        tabContent: "group-data-[selected=true]:text-transparent!",
      },
    },
  },
  compoundVariants: [
    {
      variant: "underlined",
      color: "secondary",
      class: {
        tabContent:
          "group-data-[selected=true]:text-purple group-data-[selected=true]:dark:text-lineargreen! transition-none",
      } as any,
    },
    {
      variant: "solid",
      color: "secondary",
      class: {
        cursor: "bg-linearpurple dark:bg-lineargreen",
        tabContent:
          "group-data-[selected=true]:text-purple group-data-[selected=true]:dark:text-black",
        tabList: "bg-background",
      } as any,
    },
  ],

  defaultVariants: {
    size: "default",
    color: "default",
  },
});

export default Tabs;
