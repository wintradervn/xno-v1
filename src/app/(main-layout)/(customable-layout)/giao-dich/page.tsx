"use client";
import TabBaoCaoPhanTich from "@/app/(main-layout)/chi-tiet-ma-ck/TabBaoCaoPhanTich";
import TabPhanTichKyThuat from "@/app/(main-layout)/chi-tiet-ma-ck/TabPhanTichKyThuat";
import TabPhanTichTaiChinh from "@/app/(main-layout)/chi-tiet-ma-ck/TabPhanTichTaiChinh";
import TabThongTinDoanhNghiep from "@/app/(main-layout)/chi-tiet-ma-ck/TabThongTinDoanhNghiep";
import TabTinTucSuKien from "@/app/(main-layout)/chi-tiet-ma-ck/TabTinTucSuKien";
import TabTongQuan from "@/app/(main-layout)/chi-tiet-ma-ck/TabTongQuan";
import TradingViewChart from "@/components/TradingViewChart";
import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useIsMobile from "@/hooks/useIsMobile";
import { Tab, Tabs } from "@heroui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const SymbolInfo = dynamic(() => import("@/components/module/SymbolInfo"), {
  ssr: false,
});
const Orderbook = dynamic(() => import("@/components/module/Orderbook"), {
  ssr: false,
});
const MarketHistory = dynamic(
  () => import("@/components/module/MarketHistory"),
  { ssr: false },
);

export default function GiaoDich() {
  const { isIndex } = useCurrentSymbol();
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState("bieudo");

  return (
    <>
      {isMobile ? (
        <div className="card flex min-h-[400px] flex-col pt-0">
          <Tabs
            variant="underlined"
            color="secondary"
            classNames={{
              tab: "px-1 py-0 text-sm font-semibold min-w-fit",
              panel: "h-full flex-1 overflow-hidden pb-0",
              cursor: "w-full bg-purple dark:bg-lineargreen",
              tabContent: "group-data-[selected=true]:text-lineargreen!",
            }}
            defaultSelectedKey={"bieudo"}
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Tab key="bieudo" title="Biểu đồ"></Tab>
            {isIndex && (
              <>
                <Tab key="dinhgiathitruong" title="Định giá thị trường"></Tab>
                <Tab key="tamlythitruong" title="Tâm lý thị trường"></Tab>
              </>
            )}
            {!isIndex && (
              <>
                <Tab key="solenh" title="Sổ lệnh"></Tab>
                <Tab key="lichsugiaodich" title="Khớp lệnh"></Tab>
                <Tab key="tongquan" title="Tổng quan"></Tab>
                <Tab key="taichinh" title="Tài chính"></Tab>
                <Tab key="phantichkythuat" title="Phân tích kỹ thuật"></Tab>
                <Tab key="baocaophantich" title="Báo cáo phân tích"></Tab>
                <Tab key="hoso" title="Hồ sơ"></Tab>
              </>
            )}
          </Tabs>
          <div className="flex flex-1 flex-col">
            {
              {
                bieudo: <TradingViewChart />,
                solenh: <Orderbook />,
                lichsugiaodich: <MarketHistory />,
                tongquan: <TabTongQuan />,
                taichinh: <TabPhanTichTaiChinh />,
                phantichkythuat: <TabPhanTichKyThuat />,
                baocaophantich: (
                  <UnfinishedFeature>
                    <TabBaoCaoPhanTich />
                  </UnfinishedFeature>
                ),
                hoso: <TabThongTinDoanhNghiep />,
                tintucsukien: <TabTinTucSuKien />,
              }[selectedTab]
            }
          </div>
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="flex flex-col">
          <ResizablePanel defaultSize={75} key={"chart"} minSize={15}>
            <div className="card flex h-full items-center justify-center p-2">
              <SymbolInfo />
            </div>
          </ResizablePanel>
          {!isIndex ? (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={25} key={"group2"} minSize={15}>
                <ResizablePanelGroup
                  direction="vertical"
                  className="flex flex-col"
                >
                  <ResizablePanel
                    defaultSize={50}
                    key={"orderbook"}
                    minSize={15}
                  >
                    <div className="card flex h-full flex-col p-2">
                      <div className="border-purple dark:border-lineargreen text-lineargreen w-fit shrink-0 border-b-2 px-2 py-1 text-sm font-semibold">
                        Sổ lệnh
                      </div>
                      <Orderbook />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel
                    defaultSize={50}
                    key={"market-history"}
                    minSize={15}
                  >
                    <div className="card flex h-full flex-col p-2">
                      <div className="border-purple dark:border-lineargreen text-lineargreen w-fit shrink-0 border-b-2 px-2 py-1 text-sm font-semibold">
                        Khớp lệnh
                      </div>
                      <MarketHistory />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      )}
    </>
  );
}
