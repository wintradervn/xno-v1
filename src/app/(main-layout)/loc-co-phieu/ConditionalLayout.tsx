"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useIsMobile from "@/hooks/useIsMobile";
import BoLocCaNhan from "./components/BoLocCaNhan";
import BoLocGoiY from "./components/BoLocGoiY";
import ChonChiTieu from "./components/ChonChiTieu";
import ChonGiaTri from "./components/ChonGiaTri";
import KetQuaLoc from "./components/KetQuaLoc";
import { Tab } from "@heroui/react";
import Tabs from "@/components/ui/Tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ChonChiTieuIcon from "@/icons/ChonChiTieuIcon";
import ChonGiaTriIcon from "@/icons/ChonGiaTriIcon";
import useTheme from "@/hooks/useTheme";
import { useAuthStore } from "@/store/auth";
import ProFeatureLocker from "@/components/ui/ProFeatureLocker";

const ConditionalLayout = ({ children }: { children?: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <div className="relative flex h-full w-full flex-1 gap-1">
          {!user ? (
            <ProFeatureLocker
              bgUrl="/image/blur-loc-co-phieu.png"
              mobileUrl="/image/blur-loc-co-phieu-mobile.png"
              lightBgUrl="/image/blur-loc-co-phieu-light.png"
            />
          ) : (
            <>
              <div className="card flex w-[280px] flex-col gap-1 rounded-[8px] p-0">
                <BoLocCaNhan />
                <BoLocGoiY />
              </div>
              <ResizablePanelGroup
                direction="vertical"
                className="flex h-full flex-1 flex-col"
                autoSaveId="loc-co-phieu-layout"
              >
                <ResizablePanel className="flex gap-1" defaultSize={50}>
                  <ChonChiTieu />
                  <ChonGiaTri />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>
                  <KetQuaLoc />
                </ResizablePanel>
              </ResizablePanelGroup>
            </>
          )}
        </div>
      )}
    </>
  );
};

function MobileLayout() {
  const [selectedTab1, setSelectedTab1] = useState("boloccanhan");
  const [selectedTab2, setSelectedTab2] = useState("chonchitieu");
  const { isLightMode } = useTheme();
  return (
    <div className="flex flex-col gap-1">
      <Tabs
        color="primary"
        classNames={{
          tabList: "w-full h-[42px]",
          tab: "flex-1 py-4 h-[34px]",
        }}
        selectedKey={selectedTab1}
        onSelectionChange={(key) => setSelectedTab1(key as string)}
      >
        <Tab key="boloccanhan" title="Bộ lọc cá nhân" />
        <Tab key="bolocgoiy" title="Bộ lọc gợi ý" />
      </Tabs>
      <div>{selectedTab1}</div>
      <div>
        <div className="flex text-sm">
          <div
            className={cn(
              "flex items-center gap-2 rounded-t-[8px] px-2 py-1",
              selectedTab2 === "chonchitieu"
                ? "bg-card text-white"
                : "text-muted",
            )}
            onClick={() => setSelectedTab2("chonchitieu")}
          >
            {" "}
            <ChonChiTieuIcon
              size={20}
              fillColor={isLightMode ? "#7B61FF" : ""}
            />
            Chọn chỉ tiêu
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-t-[8px] px-2 py-1",
              selectedTab2 === "chongiatri"
                ? "bg-card text-white"
                : "text-muted",
            )}
            onClick={() => setSelectedTab2("chongiatri")}
          >
            <ChonGiaTriIcon
              size={20}
              fillColor={isLightMode ? "#7B61FF" : ""}
            />
            Chọn giá trị
          </div>
        </div>
        <div className="bg-card h-[440px] rounded-[8px] rounded-tl-none">
          {selectedTab2 === "chonchitieu" ? (
            <ChonChiTieu noTitle />
          ) : (
            <ChonGiaTri noTitle />
          )}
        </div>
      </div>
      <KetQuaLoc />
    </div>
  );
}

export default ConditionalLayout;
