import TradingViewChart from "@/components/TradingViewChart";
import DefaultLoader from "@/components/ui/DefaultLoader";
import Tabs from "@/components/ui/Tabs";
import useIsMobile from "@/hooks/useIsMobile";
import { Tab } from "@heroui/react";
import { lazy, Suspense, useState } from "react";

const SubTabTongQuan = lazy(() => import("./SubTabTongQuan"));
const SubTabBangGia = lazy(() => import("./SubTabBangGia"));
const SubTabMucGia = lazy(() => import("./SubTabMucGia"));
const SubTabNhanDinh = lazy(() => import("./SubTabNhanDinh"));

export default function TabTongQuan() {
  const [selectedTab, setSelectedTab] = useState("tongquan");
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <div>
          <SubTabTongQuan />
          <SubTabNhanDinh />
        </div>
      ) : (
        <div className="flex h-full w-full gap-7">
          <div className="flex flex-1 flex-col gap-2">
            <TradingViewChart />
          </div>
          <div className="flex flex-col gap-2 sm:w-1/3 sm:max-w-[340px]">
            <Tabs
              color="primary"
              classNames={{
                base: "rounded-[7px] flex-shink-0",
                tabList: "p-0.5 rounded-[7px] h-[30px] w-full flex",
                tab: "py-0 text-sm font-semibold h-[26px]! flex-1",
                panel: " flex-1 overflow-hidden pb-0",
                cursor: "w-full rounded-[4px] h-[26px]!",
              }}
              selectedKey={selectedTab}
              onSelectionChange={(k) => setSelectedTab(k as string)}
            >
              <Tab key="tongquan" title="Tổng quan"></Tab>
              <Tab key="banggia" title="Bảng giá"></Tab>
              {/* <Tab key="mucgia" title="Mức giá"></Tab> */}
              <Tab key="nhandinh" title="Nhận định"></Tab>
            </Tabs>
            <div className="flex-1">
              <Suspense fallback={<DefaultLoader />}>
                {selectedTab === "tongquan" && <SubTabTongQuan />}
                {selectedTab === "banggia" && <SubTabBangGia />}
                {selectedTab === "mucgia" && <SubTabMucGia />}
                {selectedTab === "nhandinh" && <SubTabNhanDinh />}
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
