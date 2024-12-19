import {
  cn,
  formatNumber,
  formatPrice,
  formatVeryLargeNumber,
} from "@/lib/utils";
import FavoriteStarButton from "../FavoriteStarButton";
import Table from "../ui/Table";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import { Fragment, useMemo, useState } from "react";
import Tabs from "../ui/Tabs";
import { Tab } from "@nextui-org/react";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";

const topBienDong = [
  { key: "bungnokl", name: "Bùng nổ KL" },
  { key: "cancung", name: "Cạn cung" },
  { key: "vuotdinh", name: "Vượt đỉnh" },
  { key: "phaday", name: "Phá đáy" },
];

export default function TopDotBienKhoiLuongTable({
  type = 1,
}: {
  type?: number;
}) {
  const { data, isLoading } = useMarketOverviewData();
  const [selectedTab, setSelectedTab] = useState("bungnokl");
  const { setChiTietMaCK } = useChiTietMaCK();
  const filteredData = useMemo(() => {
    const newData = data
      ?.filter(
        (item) => item.dayVolume && item.dayVolume > 0 && item.sectors?.length,
      )
      .map((item) => ({
        ...item,
        percentChangeVsLast20Days:
          item.dayVolume && item.avgDay20Vol
            ? item.dayVolume / item.avgDay20Vol
            : 0,
        pricePercentvsHigh52Week:
          item.price && item.highWeek52Price
            ? item.price / item.highWeek52Price
            : 0,
        pricePercentvsLow52Week:
          item.price && item.lowWeek52Price
            ? item.price / item.lowWeek52Price
            : 0,
      }));

    if (selectedTab === "bungnokl") {
      return newData
        ?.sort(
          (a, b) => b.percentChangeVsLast20Days - a.percentChangeVsLast20Days,
        )
        .filter(
          (item) =>
            item.avgDay20Vol &&
            item.avgDay20Vol > 1000 &&
            item.percentChangeVsLast20Days > 1.5,
        );
    }
    if (selectedTab === "cancung") {
      return newData
        ?.sort(
          (a, b) => a.percentChangeVsLast20Days - b.percentChangeVsLast20Days,
        )
        .filter(
          (item) =>
            item.avgDay20Vol &&
            item.percentChangeVsLast20Days > 0 &&
            item.percentChangeVsLast20Days < 0.35,
        );
    }
    if (selectedTab === "phaday") {
      return newData
        ?.sort((a, b) => a.pricePercentvsLow52Week - b.pricePercentvsLow52Week)
        .filter((item) => item.pricePercentvsLow52Week <= 1.05);
    }
    if (selectedTab === "vuotdinh") {
      return newData
        ?.sort(
          (a, b) => b.pricePercentvsHigh52Week - a.pricePercentvsHigh52Week,
        )
        .filter((item) => item.pricePercentvsHigh52Week >= 0.95);
    }
  }, [data, selectedTab]);

  return (
    <>
      {type === 1 ? (
        <Tabs
          radius="sm"
          variant="solid"
          classNames={{
            base: "w-full",
            tabList: "flex-1 flex !bg-content1 p-0.5 rounded-[4px]",
            cursor: "!bg-background rounded-[4px]",
            tab: "text-sm py-0 h-7 flex-1 min-w-fit px-2",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="bungnokl" title="Bùng nổ KL"></Tab>
          <Tab key="cancung" title="Cạn cung"></Tab>
          <Tab key="vuotdinh" title="Vượt đỉnh"></Tab>
          <Tab key="phaday" title="Phá đáy"></Tab>
        </Tabs>
      ) : (
        <div className="flex flex-shrink-0 select-none justify-stretch gap-2 text-nowrap">
          {topBienDong.map((item: any) => (
            <Fragment key={item.key}>
              {selectedTab === item.key ? (
                <div className="bg-lineargreen flex-1 cursor-pointer rounded-[6px] p-[1.5px] text-center text-xs">
                  <div className="rounded-[4.5px] bg-card px-2 py-1 hover:bg-default-800">
                    <div className="text-lineargreen flex items-center justify-center text-center">
                      {item.name}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "flex min-w-fit flex-1 cursor-pointer items-center justify-center rounded-[6px] bg-background text-center text-xs text-muted hover:bg-default-800",
                  )}
                  onClick={() => setSelectedTab(item.key)}
                >
                  {item.name}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}
      <Table
        className="flex-1"
        onRowClick={(item) => {
          setChiTietMaCK(item.code);
        }}
        columns={[
          {
            title: "Mã CK",
            key: "mack",
            render: (item: TSymbolOverviewData) => (
              <div className="flex w-fit items-center gap-1">
                <div className="h-4 w-4 flex-shrink-0 overflow-hidden rounded-full bg-white">
                  <img
                    src={`https://finance.vietstock.vn/image/${item.code}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="font-semibold">{item.code}</div>
                <div className="flex-shrink-0">
                  <FavoriteStarButton symbol={item.code} size={14} />
                </div>
              </div>
            ),
          },
          {
            title: "Giá",
            key: "gia",
            className: "text-end",
            render: (item: TSymbolOverviewData) => (
              <div
                className={cn(
                  item.dayChangePercent
                    ? item.dayChangePercent > 0
                      ? "text-green"
                      : item.dayChangePercent < 0
                        ? "text-red"
                        : "text-yellow"
                    : "text-yellow",
                  item.price === item.ceiling && "text-purple",
                  item.price === item.floor && "text-cyan",
                )}
              >
                {formatPrice(item.price)}
              </div>
            ),
          },
          {
            title: "% Hôm nay",
            key: "homnay",
            className: "text-end",
            render: (item: TSymbolOverviewData) =>
              item.dayChangePercent && (
                <div
                  className={cn(
                    "flex items-center justify-end font-semibold text-green",
                    item.dayChangePercent && item.dayChangePercent > 0
                      ? "text-green"
                      : item.dayChangePercent
                        ? "text-red"
                        : "text-yellow",
                  )}
                >
                  {item.dayChangePercent > 0 && "+"}
                  {item.dayChangePercent.toFixed(2)}%
                </div>
              ),
            sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
              b.dayChangePercent !== null && a.dayChangePercent !== null
                ? a.dayChangePercent - b.dayChangePercent
                : 0,
          },
          {
            title: "KL Hôm nay",
            key: "klhomnay",
            className: "text-end",
            render: (item: TSymbolOverviewData) =>
              item.dayVolume && (
                <div
                  className={cn("flex items-center justify-end font-semibold")}
                >
                  {formatNumber(item.dayVolume)}
                </div>
              ),
            sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
              b.dayVolume !== null && a.dayVolume !== null
                ? a.dayVolume - b.dayVolume
                : 0,
          },
        ].filter(Boolean)}
        data={filteredData}
        isLoading={isLoading}
      ></Table>
    </>
  );
}
