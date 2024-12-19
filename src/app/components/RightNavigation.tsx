"use client";

import Button from "@/components/ui/Button";
import useChiTietDanhMucModal from "@/hooks/useChiTietDanhMucModal";
import useRightPanelState from "@/hooks/useRightPanelState";
import useToggleRightSidePanel from "@/hooks/useToggleRightSidePanel";
import Order from "@/icons/Order";
import CoPhieuActive from "@/icons/right-panel/CoPhieuActive";
import DatLenhActive from "@/icons/right-panel/DatLenhActive";
import TinTucActive from "@/icons/right-panel/TinTucActive";
import TongQuanActive from "@/icons/right-panel/TongQuanActive";
import { cn } from "@/lib/utils";
import {
  ChatSquare2,
  DoubleAltArrowLeft,
  GraphNewUp,
  SettingsMinimalistic,
  Widget,
} from "solar-icon-set";
import NetWorkStrengthComponent from "./NetworkStrengthComponent";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  {
    id: "cophieu",
    title: "Cổ phiếu",
    icon: ChatSquare2,
    iconActive: CoPhieuActive,
  },
  {
    id: "tongquan",
    title: "Tổng quan",
    icon: Widget,
    iconActive: TongQuanActive,
  },
  {
    id: "datlenh",
    title: "Đặt lệnh",
    icon: Order,
    iconActive: DatLenhActive,
  },
  {
    id: "tintuc",
    title: "Tin tức",
    icon: GraphNewUp,
    iconActive: TinTucActive,
  },
];

export default function RightNavigation() {
  const { state, setState } = useRightPanelState();
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
    <div className="card flex flex-col justify-between px-[6px] py-5">
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="light"
          radius="full"
          className={cn(
            "flex h-fit w-[42px] min-w-0 flex-col !bg-transparent px-2 py-2 text-muted transition-colors hover:text-white",
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
              "flex h-fit w-[42px] min-w-0 flex-col !bg-transparent px-2 py-2 text-muted transition-colors",
              state === link.id ? "text-[#67e1c0]" : "hover:text-white",
            )}
            onClick={() => {
              setState(link.id);
              isHidden && toggleRightNav();
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
        <Button
          size="sm"
          variant="light"
          className={cn(
            "flex h-fit w-[42px] min-w-0 flex-col !bg-transparent px-2 py-2 text-muted transition-colors hover:text-white",
          )}
          onClick={toggle}
        >
          <SettingsMinimalistic size={24} />
          <span className={cn("text-2xs font-semibold")}>Danh mục</span>
        </Button>
      </div>
      <div>
        <NetWorkStrengthComponent />
      </div>
    </div>
  );
}
