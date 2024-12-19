"use client";
import BienDongTreeChart from "../charts/BienDongTreeChart";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@nextui-org/react";
import NNMuaRong10PhienBarChart from "../charts/NNMuaRong10PhienBarChart";
import NNMuaRongHomNayLineChart from "../charts/NNMuaRongHomNayLineChart";
import { useMemo, useState } from "react";
import PhanBoDongTienBarChart from "../charts/PhanBoDongTienBarChart";
import ThanhKhoanLineChart from "../charts/ThanhKhoanLineChart";
import NuocNgoaiTreeChart from "../charts/NuocNgoaiTreeChart";
import useMarketOverviewData from "@/hooks/useMarketOverview";

export default function Overview() {
  const [selectedTab, setSelectedTab] = useState("10phien");
  const { data } = useMarketOverviewData();

  const filteredData = useMemo(
    () =>
      data?.filter((item) => item.exchange === "HOSE" && item.secType === "S"),
    [data],
  );

  const groupedData = useMemo(() => {
    const grouped: any = { tang: 0, giam: 0, khongdoi: 0 };
    if (!filteredData) return grouped;
    for (let i = 0; i < filteredData.length; i++) {
      const item = filteredData[i];
      if (item.dayChange !== null) {
        if (item.dayChange > 0) {
          grouped.tang += 1;
        }
        if (item.dayChange < 0) {
          grouped.giam += 1;
        }
        if (item.dayChange === 0) {
          grouped.khongdoi += 1;
        }
      }
    }
    return grouped;
  }, [filteredData]);

  return (
    <div className="flex h-full w-full flex-col">
      <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          base: "flex-shink-0 h-fit min-h-[30px]",
          tab: "px-2 py-0 text-sm font-semibold ",
          panel: "h-full flex flex-col verflow-hidden pb-0 ",
          cursor: "w-full",
          tabContent: "group-data-[selected=true]:!text-lineargreen",
        }}
        defaultSelectedKey={"thitruong"}
      >
        <Tab key="biendong" title="Biến động">
          <div className="flex h-full min-h-[500px] flex-col">
            <BienDongTreeChart />
            <div className="flex min-h-[240px] flex-col">
              <div className="mt-2 flex items-center justify-between">
                <div className="py-1 text-sm font-semibold">
                  Phân bổ dòng tiền
                </div>
              </div>
              <PhanBoDongTienBarChart data={filteredData} />
              <div className="flex justify-between pl-[17%] pr-[11%] text-xs">
                <div className="flex w-[60px] flex-col items-center gap-0.5">
                  <div className="text-muted">Tăng giá</div>
                  <div className="font-bold text-green">
                    {groupedData.tang + " CP"}
                  </div>
                </div>
                <div className="flex w-[60px] flex-col items-center gap-0.5">
                  <div className="text-muted">Giảm giá</div>
                  <div className="font-bold text-red">
                    {groupedData.giam + " CP"}
                  </div>
                </div>
                <div className="flex w-[60px] flex-col items-center gap-0.5">
                  <div className="text-muted">Không đổi</div>
                  <div className="font-bold text-yellow">
                    {groupedData.khongdoi + " CP"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="nuocngoai" title="Nước ngoài">
          <div className="flex h-full min-h-[550px] flex-col">
            <NuocNgoaiTreeChart />
            <div className="flex h-[220px] flex-col">
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm font-semibold">NN mua ròng (tỷ)</div>
                <Tabs
                  classNames={{
                    tabList: "flex-1 bg-content1 p-1 rounded-[4px]",
                    cursor: "!bg-background rounded-[4px]",
                    tab: "text-sm py-0 h-6",
                    panel: "h-full flex flex-col overflow-hidden",
                  }}
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                >
                  <Tab key="10phien" title="10 phiên"></Tab>
                  <Tab key="homnay" title="Hôm nay"></Tab>
                </Tabs>
              </div>
              {selectedTab === "10phien" ? (
                <NNMuaRong10PhienBarChart />
              ) : (
                <NNMuaRongHomNayLineChart />
              )}
            </div>
          </div>
        </Tab>
        <Tab key="thanhkhoan" title="Thanh khoản">
          <div className="flex h-full min-h-[450px] flex-col">
            <Tabs className="pb-2">
              <Tab title="0D"></Tab>
              <Tab title="5D"></Tab>
              <Tab title="20D"></Tab>
            </Tabs>
            <ThanhKhoanLineChart />
            <div className="flex justify-center gap-6 pb-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-[2px] bg-green"></div>
                <div>Giao dịch hôm nay</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-[2px] bg-[#7B61FF]"></div>
                <div>Giao dịch hôm qua</div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
