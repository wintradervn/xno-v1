import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";

import {
  DoubleAltArrowLeft,
  DoubleAltArrowRight,
  TransferHorizontal,
} from "solar-icon-set";
import { Fragment, useMemo, useState } from "react";
import {
  cn,
  formatNumber,
  formatPrice,
  formatPriceWithType,
} from "@/lib/utils";
import Table from "../ui/Table";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import FavoriteStarButton from "../FavoriteStarButton";
import useFavorites from "@/hooks/useFavorites";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useIndexOverview from "@/hooks/useIndexOverview";
import TopCoPhieuTable from "./TopCoPhieuTable";
import DoubleArrow from "@/icons/DoubleArrow";
import Divider from "../ui/Divider";
import { DANH_SACH_MA_PHAI_SINH } from "@/lib/constant";
import useFilterProData, { IFilterProData } from "@/hooks/useFilterProData";
import ViThePhaiSinhRongBarChart from "../charts/ViThePhaiSinhRongBarChart";
import TabNganhNoiBat from "./TabNganhNoiBat";

// const filterMarketData: any = [
//   { key: "mucyeuthich", name: "Mục yêu thích" },
//   { key: "HOSE", name: "HOSE" },
//   { key: "HNX", name: "HNX" },
//   { key: "UPCOM", name: "UPCOM" },
//   { key: "phaisinh", name: "Phái sinh" },
//   { key: "chungquyen", name: "Chứng quyển" },
// ];

const chiSo: Array<{ key: string; name: string }> = [
  {
    key: "chisoVn",
    name: "Việt Nam",
  },
  {
    key: "chisoTG",
    name: "Thế giới",
  },
  {
    key: "vimo",
    name: "Vĩ mô",
  },
];

const IndexNameMap: Record<string, string> = {
  VNIndex: "VNINDEX",
  HNXIndex: "HNX",
  HNXUpcomIndex: "UPCOM",
  VN30: "VN30",
};

const SummaryTable = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const [isShowPercents, setIsShowPercents] = useState(true);
  const { setChiTietMaCK } = useChiTietMaCK();

  const columns = useMemo(() => {
    return [
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
              "",
              item.dayChangePercent
                ? item.dayChangePercent > 0
                  ? "text-green"
                  : "text-red"
                : "text-yellow",
              item.price === item.ceiling && "text-ceiling",
              item.price === item.floor && "text-floor",
              item.dayChangePercent === 0 && "text-yellow",
            )}
          >
            {formatPriceWithType(item.price, item.secType)}
          </div>
        ),
        sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
          a.price !== null && b.price !== null ? a.price - b.price : 0,
      },
      {
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
        key: "thaydoi",
        className: "text-end",
        render: (item: TSymbolOverviewData) => {
          return isShowPercents ? (
            item.dayChangePercent !== null ? (
              <div
                className={cn(
                  "text-green flex items-center justify-end font-semibold",
                  item.dayChangePercent
                    ? item.dayChangePercent > 0
                      ? "text-green"
                      : "text-red"
                    : "text-yellow",
                  item.price === item.ceiling && "text-ceiling",
                  item.price === item.floor && "text-floor",
                  item.dayChangePercent === 0 && "text-yellow",
                )}
              >
                {(item.dayChangePercent > 0 ? "+" : "") +
                  item.dayChangePercent?.toFixed(2) +
                  "%"}
              </div>
            ) : (
              "-"
            )
          ) : (
            <div
              className={cn(
                "text-green flex items-center justify-end font-semibold",
                item.dayChangePercent
                  ? item.dayChangePercent > 0
                    ? "text-green"
                    : "text-red"
                  : "text-yellow",
                item.price === item.ceiling && "text-ceiling",
                item.price === item.floor && "text-floor",
                item.dayChangePercent === 0 && "text-yellow",
              )}
            >
              {formatPrice(item.dayChange)}
            </div>
          );
        },
        sortFn: isShowPercents
          ? (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
              a.dayChangePercent !== null && b.dayChangePercent !== null
                ? a.dayChangePercent - b.dayChangePercent
                : 0
          : (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
              a.dayChange !== null && b.dayChange !== null
                ? a.dayChange - b.dayChange
                : 0,
      },
      {
        title: "KLGD",
        key: "klgd",
        className: "text-end",
        render: (item: TSymbolOverviewData) => (
          <>{(item.dayVolume || 0).toLocaleString()}</>
        ),
        sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
          a.dayVolume !== null && b.dayVolume !== null
            ? a.dayVolume - b.dayVolume
            : 0,
      },
    ];
  }, [isShowPercents]);

  return (
    <Table
      data={data}
      isLoading={isLoading}
      columns={columns}
      defaultSort={{ field: "klgd", order: "desc" }}
      onRowClick={(item) => {
        setChiTietMaCK(item.code);
      }}
      className="mt-2 w-full"
      classNames={{
        header: "mb-0",
      }}
      isStickyHeader
    />
  );
};

function TabMarket() {
  const { favorites } = useFavorites();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedChiSo, setSelectedChiSo] = useState("chisoVn");

  const { data, isLoading } = useMarketOverviewData();
  const { data: indexesData } = useIndexOverview();

  const filteredData = useMemo(() => {
    if (selectedChiSo === "chisoVn") {
      return indexesData
        ? indexesData.map((item) => ({
            ...item,
            code: IndexNameMap[item.code] || item.code,
          }))
        : [];
    }
    if (!data) return [];
    // if (selectedChiSo === "phaisinh") {
    //   return data.filter((item) => DANH_SACH_MA_PHAI_SINH.includes(item.code));
    // }
    return (
      data?.filter((item) => {
        const isMatchSearch = item.code.includes(search.toUpperCase());
        if (filter === "mucyeuthich") {
          if (!favorites) return false;
          return isMatchSearch && favorites.includes(item.code);
        }
        if (filter === "chungquyen") {
          return isMatchSearch && item.secType === "W";
        }
        if (filter) {
          return (
            isMatchSearch && item.exchange === filter && item.secType === "S"
          );
        }
        return isMatchSearch;
      }) || []
    ).sort((a, b) => {
      if (b.dayVolume && a.dayVolume) return b.dayVolume - a.dayVolume;
      return 0;
    });
  }, [data, search, filter, favorites, indexesData, selectedChiSo]);

  return (
    <div className="flex h-full flex-col">
      {/* <div className="flex shrink-0 justify-stretch gap-2 text-nowrap select-none">
        {chiSo.map((item: any) => (
          <Fragment key={item.key}>
            {selectedChiSo === item.key ? (
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
                onClick={() => setSelectedChiSo(item.key)}
              >
                {item.name}
              </div>
            )}
          </Fragment>
        ))}
      </div> */}
      {/* {renderContent()} */}
      <SummaryTable data={filteredData} isLoading={isLoading} />
    </div>
  );
}

function TabCoPhieu() {
  return (
    <div className="flex h-full flex-col gap-2">
      <TopCoPhieuTable type={2} />
    </div>
  );
}

function TabPhaiSinh() {
  const [isDayChange, setIsDayChange] = useState(true);
  const [selectedTab, setSelectedTab] = useState("phaisinh");
  const { setChiTietMaCK } = useChiTietMaCK();

  const { data } = useMarketOverviewData();
  const { data: filterProData, isLoading } = useFilterProData();
  const { data: indexesData } = useIndexOverview();

  const VN30FData = useMemo(() => {
    if (!data) return undefined;
    const newData = data
      ?.filter((item) => item.code.startsWith("VN30F"))
      .sort((a, b) => a.code.localeCompare(b.code));
    return newData[0];
  }, [data]);
  const VN30IndexData = useMemo(() => {
    return indexesData?.find((item) => item.code === "VN30");
  }, [indexesData]);

  const overviewVN30DataMap = useMemo(() => {
    return data
      ?.filter((item) => DANH_SACH_MA_PHAI_SINH.includes(item.code))
      .map((item) => ({
        code: item.code,
        marketCap: item.marketCap,
        changePercent: item.dayChangePercent,
      }));
  }, [data]);

  const vn30OverviewData = useMemo(() => {
    const netValue = filterProData
      ?.filter((item) => DANH_SACH_MA_PHAI_SINH.includes(item.MA))
      .reduce((acc, item) => acc + item.THANHKHOAN * item.THAYDOI, 0);
    const indexChange = VN30IndexData?.dayChange;
    const indexPerValue = Math.abs((indexChange || 0) / (netValue || 1));

    return filterProData
      ?.filter((item) => DANH_SACH_MA_PHAI_SINH.includes(item.MA))
      .map((item) => ({
        ...item,
        vonhoa:
          overviewVN30DataMap?.find(
            (overviewItem) => overviewItem.code === item.MA,
          )?.marketCap || 0,
        changePercent:
          overviewVN30DataMap?.find(
            (overviewItem) => overviewItem.code === item.MA,
          )?.changePercent || 0,
        diemanhhuong:
          (indexPerValue *
            item.THANHKHOAN *
            (overviewVN30DataMap?.find(
              (overviewItem) => overviewItem.code === item.MA,
            )?.changePercent || 0)) /
          100,
      }));
  }, [filterProData, overviewVN30DataMap, VN30IndexData]);

  const xuHuongChung = useMemo(() => {
    if (!vn30OverviewData) return "";
    let res = "";
    const order = ["Downtrend", "Sideway", "Uptrend"];
    const acc = vn30OverviewData?.reduce((acc, item) => {
      return acc + order.indexOf(item.AiTrend);
    }, 0);
    if (acc < 20) res = "Downtrend";
    else if (acc < 40) res = "Sideway";
    else res = "Uptrend";

    let color = "#F1C617";
    if (res === "Downtrend") {
      color = "#FF135B";
    }
    if (res === "Uptrend") {
      color = "#1FAD8E";
    }
    return (
      <div className="flex w-full justify-end">
        <div
          className={cn(
            "flex h-6 items-center justify-center self-end rounded-full border-1 px-2 text-xs text-white",
          )}
          style={{ backgroundColor: `${color}32`, borderColor: color }}
        >
          {res}
        </div>
      </div>
    );
  }, [vn30OverviewData]);
  const overviewDataMap = useMemo(() => {
    return data
      ?.filter((item) => DANH_SACH_MA_PHAI_SINH.includes(item.code))
      .map((item) => ({
        code: item.code,
        marketCap: item.marketCap,
        changePercent: item.dayChangePercent,
      }));
  }, [data]);
  const columns = useMemo(() => {
    return [
      {
        title: "Mã CK",
        key: "mack",
        isSticky: true,
        classNameHeader: "justify-start",
        classNameRow: "",
        render: (item: IFilterProData) => (
          <div className="sticky left-0 flex w-fit items-center gap-1">
            <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white">
              <img
                src={`https://finance.vietstock.vn/image/${item.MA}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="font-semibold">{item.MA}</div>
            <div className="shrink-0">
              <FavoriteStarButton symbol={item.MA} size={14} />
            </div>
          </div>
        ),
        sortFn: (a: IFilterProData, b: IFilterProData) =>
          b.MA.localeCompare(a.MA),
      },
      {
        title: "Giá",
        key: "gia",
        className: "text-end",
        render: (item: IFilterProData) => (
          <div className="">{formatNumber(item.GIA, 2)}</div>
        ),
        sortFn: (a: IFilterProData, b: IFilterProData) => a.GIA - b.GIA,
      },
      {
        title: "Thay đổi",
        key: "thaydoi",
        className: "text-end",
        render: (item: IFilterProData & { changePercent: number }) => {
          return (
            <div
              className={cn(
                "flex items-center justify-end gap-1",
                item.changePercent > 0
                  ? "text-green"
                  : item.changePercent < 0
                    ? "text-red"
                    : "text-yellow",
              )}
            >
              <div className="text-right">
                {item.changePercent ? formatNumber(item.changePercent, 2) : "0"}
                %
              </div>
            </div>
          );
        },
        sortFn: (
          a: IFilterProData & { changePercent: number },
          b: IFilterProData & { changePercent: number },
        ) => {
          return a.changePercent - b.changePercent;
        },
      },
      {
        title: "Tổng GT GD (tỷ)",
        key: "tonggtgd",
        className: "text-end",
        render: (item: IFilterProData) => {
          return (
            <div className="text-right">
              {formatNumber(item.THANHKHOAN / 1000000000)}
            </div>
          );
        },
        sortFn: (a: IFilterProData, b: IFilterProData) => {
          return a.THANHKHOAN - b.THANHKHOAN;
        },
      },
      {
        title: "Vốn hóa (tỷ)",
        key: "vonhoa",
        className: "text-end",
        render: (item: IFilterProData & { vonhoa?: number }) => {
          return (
            <div className="text-right">
              {formatNumber((item.vonhoa || 0) / 1000000000)}
            </div>
          );
        },
        sortFn: (
          a: IFilterProData & { vonhoa?: number },
          b: IFilterProData & { vonhoa?: number },
        ) => {
          return (a.vonhoa || 0) - (b.vonhoa || 0);
        },
      },
      {
        title: "Điểm ảnh hưởng VN30",
        key: "diemanhhuong",
        className: "text-end",
        render: (item: IFilterProData & { diemanhhuong: number }) => {
          return (
            <div
              className={
                item.diemanhhuong > 0
                  ? "text-green"
                  : item.diemanhhuong < 0
                    ? "text-red"
                    : "text-yellow"
              }
            >
              {item.diemanhhuong ? formatNumber(item.diemanhhuong, 4) : "0"}
            </div>
          );
        },
        sortFn: (
          a: IFilterProData & { diemanhhuong: number },
          b: IFilterProData & { diemanhhuong: number },
        ) => {
          return a.diemanhhuong - b.diemanhhuong;
        },
      },
      {
        title: "SMG",
        key: "smg",
        className: "text-end",
        render: (item: IFilterProData) => {
          const value = item.RS;
          const color =
            value > 50 ? "#1FAD8E" : value < 50 ? "#FF135B" : "#FF9783";
          return (
            <div className="flex w-full justify-end">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center self-end rounded-full border-1 text-xs text-white",
                )}
                style={{ backgroundColor: `${color}32`, borderColor: color }}
              >
                {value}
              </div>
            </div>
          );
        },
        sortFn: (a: IFilterProData, b: IFilterProData) => {
          return a.RS - b.RS;
        },
      },
      {
        title: (
          <div className="flex w-full justify-end">
            <div className="w-[74px] text-center">Xu hướng</div>
          </div>
        ),
        key: "xuhuong",
        className: "text-end",
        render: (item: IFilterProData) => {
          const value = item.AiTrend;
          let color = "#F1C617";
          if (value === "Downtrend") {
            color = "#FF135B";
          }
          if (value === "Uptrend") {
            color = "#1FAD8E";
          }
          return (
            <div className="flex w-full justify-end">
              <div
                className={cn(
                  "flex h-7 w-[74px] items-center justify-center self-end rounded-full border-1 px-2 text-xs text-white",
                )}
                style={{ backgroundColor: `${color}32`, borderColor: color }}
              >
                {value}
              </div>
            </div>
          );
        },
        sortFn: (a: IFilterProData, b: IFilterProData) => {
          const order = ["Downtrend", "Sideway", "Uptrend"];
          return order.indexOf(a.AiTrend) - order.indexOf(b.AiTrend);
        },
      },
      {
        title: "AI dự báo 20D",
        key: "AIPredict20d",
        className: "text-end",
        render: (item: IFilterProData) => {
          return formatNumber(item.AIPredict20d, 1);
        },
        sortFn: (a: IFilterProData, b: IFilterProData) => {
          return a.AIPredict20d - b.AIPredict20d;
        },
      },
    ];
  }, [overviewDataMap]);

  return (
    <>
      <div className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-2 py-1">
        {/* <Tabs
          color="secondary"
          variant="solid"
          classNames={{
            tabList: "w-full",
            base: "w-full",
            tab: "flex-1",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="phaisinh" title="Phái sinh"></Tab>
          <Tab key="vithendt" title="Vị thế NĐT"></Tab>
        </Tabs> */}
        <div className="flex h-full w-full flex-1 flex-col gap-2">
          {selectedTab === "phaisinh" && (
            <>
              <div className="text-purple dark:text-lineargreen flex w-full shrink-0 items-center justify-center gap-1 text-[16px] font-semibold">
                VN30F1M <FavoriteStarButton symbol={"VN30F1M"} size={16} />
              </div>
              <div className="flex w-full shrink-0 items-center justify-between gap-5">
                <div className="flex flex-col gap-1">
                  <div className="text-md text-muted">KLGD</div>
                  <div className="text-md font-semibold text-white">
                    {formatNumber(VN30FData?.dayVolume)}
                  </div>
                </div>
                <Divider className="h-6!" />
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="text-muted hover:text-foreground h-5 cursor-pointer"
                      onClick={() => setIsDayChange((prev) => !prev)}
                    >
                      <DoubleAltArrowLeft iconStyle="Bold" size={16} />
                    </div>
                    <div className="text-md text-muted">
                      {isDayChange ? "1D" : "1W"}
                    </div>
                    <div
                      className="text-muted hover:text-foreground h-5 cursor-pointer"
                      onClick={() => setIsDayChange((prev) => !prev)}
                    >
                      <DoubleAltArrowRight iconStyle="Bold" size={16} />
                    </div>
                  </div>
                  {(function RenderChange() {
                    const value = isDayChange
                      ? VN30FData?.dayChange
                      : VN30FData?.weekChange;
                    return (
                      <div
                        className={cn(
                          "text-green flex w-[110px] items-center justify-center gap-1 font-semibold",
                          value
                            ? value > 0
                              ? "text-green"
                              : "text-red"
                            : "text-yellow",
                        )}
                      >
                        <div>{formatNumber(VN30FData?.price, 1)}</div>
                        <div
                          className={
                            value
                              ? value > 0
                                ? "rotate-0"
                                : "rotate-180"
                              : "hidden"
                          }
                        >
                          <DoubleArrow />
                        </div>
                        <div>{formatNumber(value, 1)}</div>
                      </div>
                    );
                  })()}
                </div>
                <Divider className="h-6!" />

                <div className="flex flex-col gap-1">
                  <div className="text-md text-muted">Xu hướng</div>
                  <div className="text-md h-5 font-semibold text-white">
                    {xuHuongChung}
                  </div>
                </div>
              </div>
              <Table
                className="max-h-[600px] min-h-[400px] sm:max-h-full"
                classNames={{
                  header: "items-start min-w-[900px] text-nowrap",
                  row: "min-w-[900px]",
                }}
                columns={columns}
                data={vn30OverviewData}
                isLoading={isLoading}
                onRowClick={(item) => {
                  setChiTietMaCK(item.MA);
                }}
                isStickyHeader
              ></Table>
            </>
          )}
          {/* {selectedTab === "vithendt" && (
            <>
              <ViThePhaiSinhRongBarChart />
            </>
          )} */}
        </div>
      </div>
    </>
  );
}

function Market() {
  return (
    <div className="flex h-full w-full min-w-[300px] flex-col">
      <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          tab: "px-2 py-0 text-sm font-semibold flex-1",
          tabList: "w-full",
          panel: "h-full w-full flex-1 pb-0 shrink-0",
          cursor: "w-full",
        }}
        defaultSelectedKey={"thitruong"}
      >
        <Tab key="thitruong" title="Chỉ số">
          <TabMarket />
        </Tab>
        <Tab key="cophieu" title="Cổ phiếu">
          <TabCoPhieu />
        </Tab>
        <Tab key="nganhnoibat" title="Ngành">
          <TabNganhNoiBat noTitle />
        </Tab>
        <Tab key="phaisinh" title="Phái sinh">
          <TabPhaiSinh />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Market;
