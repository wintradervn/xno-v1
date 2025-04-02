"use client";
import BienDongTreeChart from "../charts/BienDongTreeChart";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";
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
import TuDoanhTreeChart from "../charts/TuDoanhTreeChart";
import TuDoanhMuaRong10PhienBarChart from "../charts/TuDoanhMuaRong10PhienBarChart";
import TuDoanhYTDBarChart from "../charts/TuDoanhYTDBarChart";
import { ScrollArea } from "../ui/scroll-area";
import TacDongToiIndexBarChart from "../charts/TacDongToiIndexBarChart";
import SubTabDongTienNDT from "@/app/(main-layout)/(customable-layout)/thi-truong/SubTabDongTienNDT";

export default function Overview() {
  const { data: marketOverviewData } = useMarketOverviewData();
  const [selectedTab, setSelectedTab] = useState("intra");
  const { data } = useVNIndexThanhKhoanData(selectedTab);

  const filteredData = useMemo(
    () =>
      marketOverviewData?.filter(
        (item) => item.exchange === "HOSE" && item.secType === "S",
      ),
    [marketOverviewData],
  );

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
        .map((item) => format(new Date(item.time), "HH:mm"))
        .filter(
          (item, index, self) =>
            self.indexOf(item) === index &&
            item !== "14:50" &&
            item !== "14:55",
        )
        .sort((a: string, b: string) => {
          const hA = +a.split(":")[0];
          const mA = +a.split(":")[1];
          const hB = +b.split(":")[0];
          const mB = +b.split(":")[1];
          if (hA > hB) return 1;
          if (hA < hB) return -1;
          if (mA > mB) return 1;
          if (mA < mB) return -1;
          return 0;
        }),
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
          base: "flex-shink-0 h-fit min-h-[30px] overflow-x-auto no-scrollbar w-full md:w-fit",
          tab: "flex-1 min-w-fit px-2 py-0 text-sm font-semibold flex-shink-0 w-fit",
          tabList: "min-w-fit w-full gap-0 sm:gap-2",
          panel: "h-full flex flex-col verflow-hidden pb-0 w-full",
          cursor: "w-full",
        }}
        defaultSelectedKey={"thitruong"}
      >
        <Tab key="biendong" title="Biến động">
          <div className="no-scrollbar h-full overflow-auto">
            <div className="flex h-full min-h-[500px] w-full flex-col gap-2">
              <div className="shrink-0">
                <BienDongTreeChart />
              </div>
              <div className="flex min-h-[260px] flex-col pt-2 pb-2">
                <Tabs
                  classNames={{
                    tabList: "bg-content1 w-full",
                    base: "w-full",
                    tab: "flex-1",
                  }}
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                  defaultSelectedKey="phanbodongtien"
                >
                  <Tab key="phanbodongtien" title="Phân bổ dòng tiền"></Tab>
                  <Tab key="tacdongdenindex" title="Tác động đến index"></Tab>
                </Tabs>
                <div className="flex h-[300px] flex-col py-2">
                  {selectedTab === "phanbodongtien" && (
                    <>
                      <PhanBoDongTienBarChart data={filteredData} />
                    </>
                  )}
                  {selectedTab === "tacdongdenindex" && (
                    <div className="flex h-full flex-col pt-2">
                      <div className="flex w-full justify-center gap-7 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="bg-green h-3 w-3 rounded-[2px]"></div>
                          <div>Tác động tăng</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-red h-3 w-3 rounded-[2px]"></div>
                          <div>Tác động giảm</div>
                        </div>
                      </div>
                      <TacDongToiIndexBarChart />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="nuocngoai" title="Nước ngoài">
          <div className="no-scrollbar h-full overflow-auto">
            <div className="flex h-full min-h-fit flex-col">
              <div className="shrink-0">
                <NuocNgoaiTreeChart />
              </div>
              <div className="flex min-h-[340px] flex-col">
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold">NN mua ròng (tỷ)</div>
                  <Tabs
                    classNames={{
                      tabList: "flex-1 bg-content1 p-1 rounded-[4px]",
                      cursor: "bg-background! rounded-[4px]",
                      tab: "text-sm py-0 h-6",
                      panel: "h-full flex flex-col overflow-hidden",
                    }}
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as string)}
                  >
                    <Tab key="10phien" title="10 phiên"></Tab>
                    <Tab key="1nam" title="1 năm"></Tab>
                  </Tabs>
                </div>
                {selectedTab === "10phien" ? (
                  <NNMuaRong10PhienBarChart />
                ) : (
                  <NNYTDIndexBarChart />
                )}
              </div>
            </div>
          </div>
        </Tab>

        <Tab key="tudoanh" title="Tự doanh">
          <div className="no-scrollbar h-full overflow-auto">
            <div className="flex h-full min-h-fit flex-col">
              <div className="shrink-0">
                <TuDoanhTreeChart />
              </div>
              <div className="flex min-h-fit flex-col">
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    GT tự doanh mua ròng
                  </div>
                  <Tabs
                    classNames={{
                      tabList: "flex-1 bg-content1 p-1 rounded-[4px]",
                      cursor: "bg-background! rounded-[4px]",
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
                  <TuDoanhMuaRong10PhienBarChart />
                ) : (
                  <TuDoanhYTDBarChart />
                )}
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="thanhkhoan" title="Thanh khoản">
          <div className="no-scrollbar h-full overflow-auto">
            <div className="flex h-full flex-col pr-2">
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
          </div>
        </Tab>
        {/* <Tab key="dongtienNDT" title="Dòng tiền NĐT">
          <Tabs
            radius="sm"
            variant="solid"
            className="mb-2 w-fit"
            classNames={{
              tabList: "flex-1 bg-background p-0.5 rounded-[6px] h-[30px]",
              cursor: "bg-linearpurple! rounded-[6px] h-[24px]",
              tab: "text-sm py-0 h-[24px] font-semibold w-fit",
              tabContent: "group-data-[selected=true]:text-black!",
              base: "self-end",
            }}
          >
            <Tab key="1D" title="1D"></Tab>
            <Tab key="10D" title="10D"></Tab>
          </Tabs>
          <ScrollArea className="relative mt-4 pr-2">
            <SubTabDongTienNDT />
          </ScrollArea>
        </Tab> */}
      </Tabs>
    </div>
  );
}
