import ChiSoDongTienGauge from "@/components/charts/ChiSoDongTienGauge";
import PivotsTable from "@/components/module/PivotsTable";
import TradingViewChart from "@/components/TradingViewChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";
import { useState } from "react";

const Temp = ({ size = 1 }: { size?: number }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full flex-1">
        <ChiSoDongTienGauge size={size} />
      </div>
      <div
        className={`flex flex-col items-center gap-1`}
        style={{ scale: size.toString() }}
      >
        <div>Trung lập</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-green"></div>
            <div className="text-nowrap">
              Mua (<span className="text-green">1</span>)
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-yellow"></div>
            <div className="text-nowrap">
              Trung lập (<span className="text-yellow">16</span>)
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-red"></div>
            <div className="text-nowrap">
              Bán (<span className="text-red">1</span>)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function SubTabTongQuanPTKT() {
  const [state, setState] = useState("1tuan");
  return (
    <div className="flex h-full w-full gap-10">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-1">
          <TradingViewChart />
        </div>
        <div className="shrink-0">
          <PivotsTable />
        </div>
      </div>
      <div className="flex w-[340px] flex-col gap-4">
        <Tabs
          color="primary"
          classNames={{
            base: "w-full",
            tabList: "p-0.5 rounded-[6px] w-full",
            tab: "h-[26px] px-3 py-1 rounded-[4px] text-sm font-semibold flex-1",
            panel: "h-full flex-1 overflow-hidden pb-0",
            cursor: "rounded-[4px]",
          }}
          selectedKey={state}
          onSelectionChange={(k) => setState(k as string)}
        >
          <Tab key="1ngay" title="1 ngày"></Tab>
          <Tab key="1tuan" title="1 tuần"></Tab>
        </Tabs>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-cyan"></div>
            <div>Bán mạnh</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-red"></div>
            <div>Bán</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-yellow"></div>
            <div>Trung lập</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-green"></div>
            <div>Mua</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-purple"></div>
            <div>Mua mạnh</div>
          </div>
        </div>
        <div className="no-scrollbar flex-1 overflow-auto">
          <div className="flex min-h-[370px] w-full flex-1 flex-col items-center justify-between gap-2">
            <div className="flex h-[210px] w-full flex-col items-center">
              <div className="text-caption">Tổng hợp</div>
              <Temp />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-1 flex-col items-center">
                <div className="text-caption">Đường trung bình</div>
                <div className="flex h-[145px] w-full">
                  <Temp size={0.7} />
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <div className="text-caption">Chỉ số xu hướng</div>
                <div className="flex h-[145px] w-full">
                  <Temp size={0.7} />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-1 flex-col items-center">
                <div className="text-caption">Chỉ số động lượng</div>
                <div className="flex h-[145px] w-full">
                  <Temp size={0.7} />
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <div className="text-caption">Chỉ số dòng tiền</div>
                <div className="flex h-[145px] w-full">
                  <Temp size={0.7} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
