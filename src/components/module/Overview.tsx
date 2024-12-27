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
import { format } from "date-fns";
import useVNIndexThanhKhoanData from "@/hooks/useVNIndexThanhKhoanData";
import NNYTDIndexBarChart from "../charts/NNYTDIndexBarChart";

export default function Overview() {
  const { data: marketOverviewData } = useMarketOverviewData();

  const filteredData = useMemo(
    () =>
      marketOverviewData?.filter(
        (item) => item.exchange === "HOSE" && item.secType === "S",
      ),
    [marketOverviewData],
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

  const [selectedTab, setSelectedTab] = useState("intra");
  const { data } = useVNIndexThanhKhoanData(selectedTab);

  const dataByDate = useMemo(() => {
    if (!data) return [];
    const result: any = {};
    data.forEach((item) => {
      const dateTimestamp = new Date(item.time).setHours(0, 0, 0, 0);
      const found = result[dateTimestamp];
      if (found) {
        found.push(item);
      } else {
        result[dateTimestamp] = [item];
      }
    });
    return result;
  }, [data]);

  const todayData = useMemo(() => {
    if (!dataByDate) return [];
    const todayTimestamp = new Date().setHours(0, 0, 0, 0);
    return dataByDate?.[todayTimestamp]?.map((item: any) => ({
      ...item,
      time: format(new Date(item.time), "HH:mm"),
    }));
  }, [dataByDate]);

  const yesterdayData = useMemo(() => {
    if (!dataByDate) return [];
    const todayTimestamp = new Date().setHours(0, 0, 0, 0);
    const yesterdayTimestamp = Math.max(
      ...Object.keys(dataByDate)
        .filter((str) => +str !== todayTimestamp)
        .map((str) => +str),
    );

    return dataByDate?.[yesterdayTimestamp]?.map((item: any) => ({
      ...item,
      time: format(new Date(item.time), "HH:mm"),
    }));
  }, [dataByDate]);

  const timeData = useMemo(
    () =>
      [...(data || [])]
        .sort((a, b) => (new Date(a.time) > new Date(b.time) ? 1 : -1))
        .map((item) => format(new Date(item.time), "HH:mm"))
        .filter((item, index, self) => self.indexOf(item) === index),
    [data],
  );

  const average5Day = useMemo(() => {
    if (!data || !todayData || !timeData) return [];
    const todayTimestamp = new Date().setHours(0, 0, 0, 0);

    const averageData = timeData?.map((time) => {
      const found = data?.filter(
        (item) =>
          todayTimestamp > new Date(item.time).getTime() &&
          format(new Date(item.time), "HH:mm") === time,
      );
      return {
        time: time,
        allValue:
          found.reduce((acc, cur) => acc + cur.allValue, 0) / found.length,
      };
    });
    return averageData;
  }, [data, todayData, timeData]);

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
                  <Tab key="ytd" title="YTD"></Tab>
                </Tabs>
              </div>
              {selectedTab === "10phien" ? (
                <NNMuaRong10PhienBarChart />
              ) : (
                <NNYTDIndexBarChart />
              )}
            </div>
          </div>
        </Tab>
        <Tab key="thanhkhoan" title="Thanh khoản">
          <div className="flex h-full min-h-[450px] flex-col">
            <Tabs
              className="pb-2"
              selectedKey={selectedTab}
              onSelectionChange={(k) => setSelectedTab(k as string)}
            >
              <Tab key="intra" title="0D"></Tab>
              <Tab key="5day" title="5D"></Tab>
            </Tabs>
            <ThanhKhoanLineChart
              timeList={timeData}
              data1={todayData}
              data2={selectedTab === "5day" ? average5Day : yesterdayData}
              data2Name={
                selectedTab === "5day"
                  ? "GTGD trung bình 5 phiên"
                  : "GTGD Hôm qua"
              }
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
