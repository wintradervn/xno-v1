"use client";

import Button from "@/components/ui/Button";
import useChiTietDanhMucModal from "@/hooks/useChiTietDanhMucModal";
import useRightPanelState from "@/hooks/useRightPanelState";
import useToggleRightSidePanel from "@/hooks/useToggleRightSidePanel";
import Order from "@/icons/Order";
import CoPhieuActive from "@/icons/right-panel/CoPhieuActive";
import DatLenhActive from "@/icons/right-panel/DatLenhActive";
import TinTucActive from "@/icons/right-panel/TinTucActive";
import ThiTruongActive from "@/icons/right-panel/ThiTruongActive";
import TinHieuActive from "@/icons/right-panel/TinHieuActive";
import { cn } from "@/lib/utils";
import {
  ChatSquare2,
  DoubleAltArrowLeft,
  GraphNewUp,
  SettingsMinimalistic,
  Widget,
  StarFallMinimalistic2,
} from "solar-icon-set";
import NetWorkStrengthComponent from "./NetworkStrengthComponent";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useIsMobile from "@/hooks/useIsMobile";
import useTheme from "@/hooks/useTheme";

const links = [
  {
    id: "cophieu",
    title: "Cổ phiếu",
    icon: ChatSquare2,
    iconActive: CoPhieuActive,
  },
  {
    id: "thitruong",
    title: "Thị trường",
    icon: Widget,
    iconActive: ThiTruongActive,
  },
  // {
  //   id: "datlenh",
  //   title: "Đặt lệnh",
  //   icon: Order,
  //   iconActive: DatLenhActive,
  // },
  {
    id: "tinhieu",
    title: "Bot AI",
    icon: StarFallMinimalistic2,
    iconActive: TinHieuActive,
  },
  {
    id: "tintuc",
    title: "Tin tức",
    icon: GraphNewUp,
    iconActive: TinTucActive,
  },
];

export default function RightNavigation() {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <RightNavigationMobile />
      ) : (
        <div className="h-full">
          <RightNavigationDesktop />
        </div>
      )}
    </>
  );
}
function RightNavigationDesktop() {
  const { state, setState } = useRightPanelState();
  const { isLightMode } = useTheme();

  const localState = state || "cophieu";

  const { toggle } = useChiTietDanhMucModal();
  const {
    isHidden,
    toggle: toggleRightNav,
    open,
    close,
  } = useToggleRightSidePanel();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/giao-dich") {
      open();
    } else {
      close();
    }
  }, [pathname]);

  return (
    <div className="card relative right-0 bottom-0 left-0 flex h-full flex-col justify-between rounded-[4px] px-[6px] py-5">
      <div className="flex w-full flex-col justify-between gap-2">
        <Button
          size="sm"
          variant="light"
          radius="full"
          className={cn(
            "text-muted hover:text-foreground flex h-fit w-[42px] min-w-0 flex-col bg-transparent! px-2 py-2 transition-colors",
          )}
          onClick={toggleRightNav}
        >
          <DoubleAltArrowLeft
            size={24}
            className={cn("transition-all", isHidden ? "" : "rotate-180")}
          />
        </Button>
        {links.map((link) => (
          <Button
            key={link.id}
            size="sm"
            variant="light"
            className={cn(
              "text-muted flex h-fit w-[42px] min-w-0 flex-col bg-transparent! px-2 py-2 transition-colors",
              localState === link.id
                ? "text-purple dark:text-muted"
                : "hover:text-foreground",
            )}
            onPress={() => {
              setState(link.id);
              isHidden && toggleRightNav();
            }}
          >
            {localState === link.id ? (
              isLightMode ? (
                <link.icon size={24} iconStyle="Bold" />
              ) : (
                <link.iconActive />
              )
            ) : (
              <link.icon size={24} color="currentcolor" />
            )}
            <span
              className={cn(
                "text-2xs font-semibold",
                state === link.id && "text-lineargreen",
              )}
            >
              {link.title}
            </span>
          </Button>
        ))}
        {/* <Button
          size="sm"
          variant="light"
          className={cn(
            "text-muted hover:text-foreground flex h-fit w-[42px] min-w-0 flex-col bg-transparent! px-2 py-2 transition-colors",
          )}
          onClick={toggle}
        >
          <SettingsMinimalistic size={24} />
          <span className={cn("text-2xs font-semibold")}>Danh mục</span>
        </Button> */}
      </div>
      <div className="hidden sm:block">
        <NetWorkStrengthComponent />
      </div>
    </div>
  );
}

function RightNavigationMobile() {
  const { state, setState } = useRightPanelState();
  const { toggle } = useChiTietDanhMucModal();

  return (
    <div className="bg-background fixed right-0 bottom-0 left-0 z-200 flex justify-between rounded-none px-3">
      <div className="flex w-full justify-between gap-2 sm:flex-col">
        {links.map((link) => (
          <Button
            key={link.id}
            size="sm"
            variant="light"
            className={cn(
              "text-muted flex h-fit min-w-0 flex-1 flex-col bg-transparent! py-2 transition-colors",
            )}
            onPress={() => {
              setState(link.id);
            }}
          >
            {state === link.id ? (
              <link.iconActive />
            ) : (
              <link.icon size={24} color="currentcolor" />
            )}
            <span
              className={cn(
                "text-2xs font-semibold",
                state === link.id && "text-lineargreen",
              )}
            >
              {link.title}
            </span>
          </Button>
        ))}
        {/* <Button
          size="sm"
          variant="light"
          className={cn(
            "text-muted hover:text-foreground flex h-fit min-w-0 flex-1 flex-col bg-transparent! py-2 transition-colors",
          )}
          onClick={toggle}
        >
          <SettingsMinimalistic size={24} />
          <span className={cn("text-2xs font-semibold")}>Danh mục</span>
        </Button> */}
      </div>
    </div>
  );
}
