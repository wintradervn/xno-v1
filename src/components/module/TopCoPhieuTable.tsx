import { cn, formatNumber, formatPrice } from "@/lib/utils";
import FavoriteStarButton from "../FavoriteStarButton";
import Table from "../ui/Table";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import { Fragment, useMemo, useState } from "react";
import Tabs from "../ui/Tabs";
import { Tab } from "@heroui/react";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import { TransferHorizontal } from "solar-icon-set";
import { useSymbolWSData } from "@/hooks/websocket/useSymbolInfoWebsocket";
import clsx from "clsx";

const topBienDong = [
  { key: "biendonggia", name: "Biến động giá" },
  { key: "bungnokl", name: "Bùng nổ KL" },
  { key: "cancung", name: "Cạn cung" },
  { key: "vuotdinh", name: "Vượt đỉnh" },
  { key: "phaday", name: "Phá đáy" },
];

export default function TopCoPhieuTable({ type = 1 }: { type?: number }) {
  const { data, isLoading } = useMarketOverviewData();
  console.log(
    "🚀 ~ TopCoPhieuTable ~ data:",
    data?.find((i) => i.code === "VEF"),
  );

  const [selectedTab, setSelectedTab] = useState("bungnokl");
  const [selectedTime, setSelectedTime] = useState("1d");
  const [isShowPercents, setIsShowPercents] = useState(true);

  const { setChiTietMaCK } = useChiTietMaCK();

  const volumeFieldName = selectedTime === "1d" ? "dayVolume" : "avgDay5Vol";
  const bungNoKlThreshold = selectedTime === "1d" ? 1.5 : 1;
  const cancungKLThreshold = selectedTime === "1d" ? 0.35 : 0.7;

  const filteredData = useMemo(() => {
    const newData = data
      ?.filter(
        (item) =>
          item.secType === "S" &&
          item.exchange &&
          ["HNX", "UPCOM", "HOSE"].includes(item.exchange),
      )
      .map((item) => ({
        ...item,
        volPercentChangeVsLast20Days:
          item[volumeFieldName] && item.avgDay20Vol
            ? item[volumeFieldName] / item.avgDay20Vol
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

    if (selectedTab === "biendonggia") {
      return newData
        ?.sort((a, b) =>
          b.dayChangePercent !== null && a.dayChangePercent !== null
            ? b.dayChangePercent - a.dayChangePercent
            : 0,
        )
        .filter(
          (item) => item.avgDay5Value && item.avgDay5Value >= 1000_000_000,
        );
    }
    if (selectedTab === "bungnokl") {
      return newData
        ?.sort(
          (a, b) =>
            b.volPercentChangeVsLast20Days - a.volPercentChangeVsLast20Days,
        )
        .filter(
          (item) =>
            item.avgDay20Vol &&
            item.avgDay20Vol > 1000 &&
            item.volPercentChangeVsLast20Days > bungNoKlThreshold &&
            item.avgDay5Value &&
            item.avgDay5Value >= 1000_000_000,
        );
    }
    if (selectedTab === "cancung") {
      return newData
        ?.sort(
          (a, b) =>
            a.volPercentChangeVsLast20Days - b.volPercentChangeVsLast20Days,
        )
        .filter(
          (item) =>
            item.avgDay20Vol &&
            item.volPercentChangeVsLast20Days > 0 &&
            item.volPercentChangeVsLast20Days < cancungKLThreshold &&
            item.avgDay5Value &&
            item.avgDay5Value >= 1000_000_000,
        );
    }
    if (selectedTab === "phaday") {
      return newData
        ?.sort((a, b) => a.pricePercentvsLow52Week - b.pricePercentvsLow52Week)
        .filter(
          (item) =>
            item.avgDay5Value &&
            item.avgDay5Value >= 5000000000 &&
            item.pricePercentvsLow52Week <= 1.05,
        );
    }
    if (selectedTab === "vuotdinh") {
      return newData
        ?.sort(
          (a, b) => b.pricePercentvsHigh52Week - a.pricePercentvsHigh52Week,
        )
        .filter(
          (item) =>
            item.avgDay5Value &&
            item.avgDay5Value >= 5000000000 &&
            item.pricePercentvsHigh52Week >= 0.95,
        );
    }
  }, [data, selectedTab, selectedTime]);
  return (
    <>
      {type === 1 ? (
        <Tabs
          radius="sm"
          variant="solid"
          classNames={{
            base: "w-full",
            tabList: "flex-1 flex bg-content1! p-0.5 rounded-[4px]",
            cursor: "bg-background! rounded-[4px]",
            tab: "text-sm py-0 h-7 flex-1 min-w-fit px-2",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => {
            setSelectedTab(key as string);
          }}
        >
          <Tab key="biendonggia" title="Biến động giá"></Tab>
          <Tab key="bungnokl" title="Bùng nổ KL"></Tab>
          <Tab key="cancung" title="Cạn cung"></Tab>
          <Tab key="vuotdinh" title="Vượt đỉnh"></Tab>
          <Tab key="phaday" title="Phá đáy"></Tab>
        </Tabs>
      ) : (
        <div className="flex w-fit min-w-full shrink-0 justify-stretch gap-1 text-nowrap select-none">
          {topBienDong.map((item: any) => (
            <Fragment key={item.key}>
              {selectedTab === item.key ? (
                <div className="bg-linearpurple dark:bg-lineargreen min-w-fit flex-1 cursor-pointer rounded-[8px] bg-white p-[1.5px] text-center text-xs">
                  <div className="dark:bg-card dark:hover:bg-default-800 w-full min-w-fit rounded-[6.5px] bg-white px-2 py-1">
                    <div className="text-purple dark:text-lineargreen flex w-full min-w-fit items-center justify-center text-center">
                      {item.name}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "text-muted dark:bg-background dark:hover:bg-default-800 flex w-full flex-1 cursor-pointer items-center justify-center rounded-[8px] border-1 bg-white px-2 text-center text-xs dark:border-transparent",
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
      {["bungnokl", "cancung"].includes(selectedTab) && (
        <div className="flex shrink-0 justify-end">
          <Tabs
            selectedKey={selectedTime}
            onSelectionChange={(key) => setSelectedTime(key as string)}
          >
            <Tab key="1d" title="1D"></Tab>
            <Tab key="5d" title="5D"></Tab>
          </Tabs>
        </div>
      )}
      <Table
        isStickyHeader
        className="max-h-[600px] min-h-[400px] flex-1 sm:max-h-full"
        onRowClick={(item) => {
          setChiTietMaCK(item.code);
        }}
        defaultSort={
          ["bungnokl", "cancung"].includes(selectedTab)
            ? {
                field: "klhomnay",
                order: "desc",
              }
            : undefined
        }
        columns={[
          {
            title: "Mã CK",
            key: "mack",
            render: (item: TSymbolOverviewData) => (
              <div className="flex w-fit items-center gap-1">
                <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white">
                  <img
                    src={`https://finance.vietstock.vn/image/${item.code}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="font-semibold">{item.code}</div>
                <div className="shrink-0">
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
                  item.price === item.ceiling && "text-ceiling",
                  item.price === item.floor && "text-floor",
                )}
              >
                <LiveSymbolPrice
                  symbol={item.code}
                  defaultValue={formatPrice(item.price)}
                />
              </div>
            ),
          },
          selectedTime === "1d"
            ? {
                title: (
                  <div className="inline-flex items-center justify-end gap-2">
                    <div
                      className="hover:text-muted h-4 text-neutral-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsShowPercents((prev) => !prev);
                      }}
                    >
                      <TransferHorizontal size={14} />
                    </div>
                    {isShowPercents ? "%" : "Thay đổi"}
                  </div>
                ),
                key: "homnay",
                className: "text-end",
                render: (item: TSymbolOverviewData) =>
                  item.dayChangePercent !== null && (
                    <div
                      className={cn(
                        "text-green flex items-center justify-end font-semibold",
                        item.dayChangePercent && item.dayChangePercent > 0
                          ? "text-green"
                          : item.dayChangePercent
                            ? "text-red"
                            : "text-yellow",
                        item.price === item.ceiling && "text-ceiling",
                        item.price === item.floor && "text-floor",
                      )}
                    >
                      {item.dayChangePercent > 0 && "+"}
                      {isShowPercents
                        ? item.dayChangePercent.toFixed(2) + "%"
                        : formatPrice(item.dayChange)}
                    </div>
                  ),
                sortFn: isShowPercents
                  ? (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
                      b.dayChangePercent !== null && a.dayChangePercent !== null
                        ? a.dayChangePercent - b.dayChangePercent
                        : 0
                  : (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
                      a.dayChange !== null && b.dayChange !== null
                        ? a.dayChange - b.dayChange
                        : 0,
              }
            : {
                title: (
                  <div className="inline-flex items-center justify-end gap-2">
                    <div
                      className="hover:text-muted h-4 text-neutral-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsShowPercents((prev) => !prev);
                      }}
                    >
                      <TransferHorizontal size={14} />
                    </div>
                    {isShowPercents ? "%" : "Thay đổi"}
                  </div>
                ),
                key: "homnay",
                className: "text-end",
                render: (item: TSymbolOverviewData) =>
                  item.weekChangePercent ? (
                    <div
                      className={cn(
                        "text-green flex items-center justify-end font-semibold",
                        item.weekChangePercent && item.weekChangePercent > 0
                          ? "text-green"
                          : item.weekChangePercent
                            ? "text-red"
                            : "text-yellow",
                        item.price === item.ceiling && "text-ceiling",
                        item.price === item.floor && "text-floor",
                      )}
                    >
                      {item.weekChangePercent > 0 && "+"}
                      {isShowPercents
                        ? item.weekChangePercent.toFixed(2) + "%"
                        : formatPrice(item.weekChange)}
                    </div>
                  ) : (
                    <div className="text-yellow font-semibold">0.00%</div>
                  ),
                sortFn: isShowPercents
                  ? (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
                      b.weekChangePercent !== null &&
                      a.weekChangePercent !== null
                        ? a.weekChangePercent - b.weekChangePercent
                        : 0
                  : (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
                      a.weekChange !== null && b.weekChange !== null
                        ? a.weekChange - b.weekChange
                        : 0,
              },
          ...(selectedTab === "biendonggia"
            ? [
                {
                  title: "% 1W",
                  key: "tuannay",
                  className: "text-end",
                  render: (item: TSymbolOverviewData) =>
                    item.weekChangePercent ? (
                      <div
                        className={cn(
                          "text-green flex items-center justify-end font-semibold",
                          item.weekChangePercent > 0
                            ? "text-green"
                            : item.weekChangePercent
                              ? "text-red"
                              : "text-yellow-400",
                        )}
                      >
                        {item.weekChangePercent > 0 && "+"}
                        {item.weekChangePercent.toFixed(2)}%
                      </div>
                    ) : (
                      <div className="text-yellow font-semibold">0.00%</div>
                    ),
                  sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
                    a.weekChangePercent &&
                    b.weekChangePercent &&
                    a.weekChangePercent - b.weekChangePercent,
                },
                {
                  title: "% 1M",
                  key: "thangnay",
                  className: "text-end",
                  render: (item: TSymbolOverviewData) =>
                    item.month1ChangePercent ? (
                      <div
                        className={cn(
                          "text-green flex items-center justify-end font-semibold",
                          item.month1ChangePercent > 0
                            ? "text-green"
                            : item.month1ChangePercent
                              ? "text-red"
                              : "text-yellow-400",
                        )}
                      >
                        {item.month1ChangePercent > 0 && "+"}
                        {item.month1ChangePercent.toFixed(2)}%
                      </div>
                    ) : (
                      <div className="text-yellow font-semibold">0.00%</div>
                    ),
                  sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
                    a.month1ChangePercent &&
                    b.month1ChangePercent &&
                    a.month1ChangePercent - b.month1ChangePercent,
                },
              ]
            : selectedTime === "1d"
              ? [
                  {
                    title: "KLGD",
                    key: "klhomnay",
                    className: "text-end",
                    render: (item: TSymbolOverviewData) =>
                      item.dayVolume && (
                        <div
                          className={cn(
                            "flex items-center justify-end font-semibold",
                          )}
                        >
                          {formatNumber(item.dayVolume)}
                        </div>
                      ),
                    sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
                      b.dayVolume !== null && a.dayVolume !== null
                        ? a.dayVolume - b.dayVolume
                        : 0,
                  },
                ]
              : [
                  {
                    title: "KLGD",
                    key: "kltuannay",
                    className: "text-end",
                    render: (item: TSymbolOverviewData) =>
                      item.weekVolume && (
                        <div
                          className={cn(
                            "flex items-center justify-end font-semibold",
                          )}
                        >
                          {formatNumber(item.weekVolume)}
                        </div>
                      ),
                    sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
                      b.weekVolume !== null && a.weekVolume !== null
                        ? a.weekVolume - b.weekVolume
                        : 0,
                  },
                ]),
        ].filter(Boolean)}
        data={filteredData}
        isLoading={isLoading}
        key={selectedTab}
      ></Table>
    </>
  );
}

function LiveSymbolPrice({
  className,
  symbol,
  defaultValue,
}: {
  className?: string;
  symbol?: string;
  defaultValue?: string | number;
}) {
  const { siData } = useSymbolWSData(symbol);

  const price = siData?.price
    ? formatPrice(siData.price * 1000)
    : defaultValue || 0;

  return (
    <span
      className={clsx("animate-change-background-cyan", className)}
      key={price}
    >
      {price}
    </span>
  );
}
