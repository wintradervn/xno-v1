import useNuocNgoaiData from "@/hooks/useNuocNgoaiData";
import { useMemo } from "react";
import { formatVeryLargeNumber } from "@/lib/utils";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import { ScrollArea } from "../ui/scroll-area";

export default function TopNuocNgoaiChart() {
  const { data } = useNuocNgoaiData();
  const { data: overviewData } = useMarketOverviewData();
  const sortedDataByNetBuy = useMemo(
    () =>
      data && overviewData
        ? [...data]
            .filter(
              (item) =>
                overviewData?.findIndex(
                  (j) => j.secType === "S" && item.code === j.code,
                ) >= 0,
            )
            .sort((a, b) => b.dayNetVal - a.dayNetVal)
        : [],
    [data, overviewData],
  );
  const maxValue = Math.max(
    ...sortedDataByNetBuy.map((item) => Math.abs(item.dayNetVal)),
  );

  return (
    <div className="flex h-full w-full flex-col gap-3">
      {/* <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          base: "w-full",
          tabList: "w-full",
          tab: "px-2 py-0 text-sm font-semibold",
          panel: "h-full overflow-hidden pb-0",
          cursor: "w-full",
        }}
        defaultSelectedKey={"muabanrong"}
      >
        <Tab key="muabanrong" title="Mua/Bán ròng"></Tab>
      </Tabs> */}
      <ScrollArea className="flex-1">
        <div className="flex w-full gap-4">
          <div className="flex flex-1 flex-col gap-3">
            {sortedDataByNetBuy
              .filter((item) => item.dayNetVal > 0)
              .slice(0, 20)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-1"
                >
                  <div className="relative ml-14 h-4 flex-1">
                    <div
                      className="bg-green absolute right-0 h-4 rounded-[4px]"
                      style={{
                        width: `calc(${(item.dayNetVal / maxValue) * 100 + "%"})`,
                      }}
                    ></div>
                    <div
                      className="text-green absolute text-[11px] text-nowrap"
                      style={{
                        right: `calc(${(item.dayNetVal / maxValue) * 100 + "%" + " + 5px"})`,
                      }}
                    >
                      {formatVeryLargeNumber(item.dayNetVal)}
                    </div>
                  </div>
                  <div className="w-9 text-end text-sm">{item.code}</div>
                </div>
              ))}
          </div>
          <div className="flex flex-1 flex-col gap-3">
            {sortedDataByNetBuy
              .filter((item) => item.dayNetVal < 0)
              .reverse()
              .slice(0, 20)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-1"
                >
                  <div className="w-9 text-sm">{item.code}</div>
                  <div className="relative mr-14 h-4 flex-1">
                    <div
                      className="bg-red absolute left-0 h-4 rounded-[4px]"
                      style={{
                        width: `calc(${(Math.abs(item.dayNetVal) / maxValue) * 100 + "%"})`,
                      }}
                    ></div>
                    <div
                      className="text-red absolute text-[11px] text-nowrap"
                      style={{
                        left: `calc(${(Math.abs(item.dayNetVal) / maxValue) * 100 + "%" + " + 5px"})`,
                      }}
                    >
                      {formatVeryLargeNumber(item.dayNetVal, true)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
