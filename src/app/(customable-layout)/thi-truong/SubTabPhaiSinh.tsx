import FavoriteStarButton from "@/components/FavoriteStarButton";
import Divider from "@/components/ui/Divider";
import Table from "@/components/ui/Table";
import { TDNSEDeal } from "@/hooks/dnse/useDNSEDeals";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import useFilterProData, { IFilterProData } from "@/hooks/useFilterProData";
import DoubleArrow from "@/icons/DoubleArrow";
import {
  cn,
  formatNumber,
  formatPrice,
  formatVeryLargeNumber,
} from "@/lib/utils";
import { Tooltip } from "@nextui-org/react";
import { useMemo } from "react";
import { InfoCircle } from "solar-icon-set";
import useIndexOverview from "@/hooks/useIndexOverview";
import { on } from "events";

const DanhSachMaPhaiSinh = [
  "ACB",
  "BCM",
  "BID",
  "BVH",
  "CTG",
  "FPT",
  "GAS",
  "GVR",
  "HDB",
  "HPG",
  "MBB",
  "MSN",
  "MWG",
  "PLX",
  "POW",
  "SAB",
  "SHB",
  "SSB",
  "SSI",
  "STB",
  "TCB",
  "TPB",
  "VCB",
  "VHM",
  "VIB",
  "VIC",
  "VJC",
  "VNM",
  "VPB",
  "VRE",
];

export default function SubTabPhaiSinh() {
  const { data, isLoading: isLoading1 } = useFilterProData();
  const { data: overviewData, isLoading: isLoading2 } = useMarketOverviewData();
  const { data: indexOverviewData, isLoading: isLoading3 } = useIndexOverview();

  const isLoading = isLoading1 || isLoading2 || isLoading3;

  const VN30IndexData = useMemo(() => {
    return indexOverviewData?.find((item) => item.code === "VN30");
  }, [indexOverviewData]);

  const VN30FData = useMemo(() => {
    if (!overviewData) return undefined;
    const data = overviewData
      ?.filter((item) => item.code.startsWith("VN30F"))
      .sort((a, b) => a.code.localeCompare(b.code));
    return data[0];
  }, [overviewData]);

  const overviewDataMap = useMemo(() => {
    return overviewData
      ?.filter((item) => DanhSachMaPhaiSinh.includes(item.code))
      .map((item) => ({
        code: item.code,
        marketCap: item.marketCap,
        changePercent: item.dayChangePercent,
      }));
  }, [overviewData]);

  const vn30OverviewData = useMemo(() => {
    const netValue = data
      ?.filter((item) => DanhSachMaPhaiSinh.includes(item.MA))
      .reduce(
        (acc, item) =>
          acc +
          (item.THANHKHOAN * parseFloat(item.THAYDOI.split("%")[0])) / 100,
        0,
      );
    const indexChange = VN30IndexData?.dayChange;
    const indexPerValue = Math.abs((indexChange || 0) / (netValue || 1));

    return data
      ?.filter((item) => DanhSachMaPhaiSinh.includes(item.MA))
      .map((item) => ({
        ...item,
        vonhoa:
          overviewDataMap?.find((overviewItem) => overviewItem.code === item.MA)
            ?.marketCap || 0,
        changePercent:
          overviewDataMap?.find((overviewItem) => overviewItem.code === item.MA)
            ?.changePercent || 0,
        diemanhhuong:
          (indexPerValue *
            item.THANHKHOAN *
            (overviewDataMap?.find(
              (overviewItem) => overviewItem.code === item.MA,
            )?.changePercent || 0)) /
          100,
      }));
  }, [data, overviewDataMap, VN30IndexData]);

  const xuHuongChung = useMemo(() => {
    if (!vn30OverviewData) return "";
    let res = "";
    const order = ["Giảm mạnh", "Giảm yếu", "Tăng yếu", "Tăng mạnh"];
    const acc = vn30OverviewData?.reduce((acc, item) => {
      return acc + order.indexOf(item.SUCMANH);
    }, 0);
    if (acc < 22.5) res = "Giảm mạnh";
    else if (acc < 45) res = "Giảm yếu";
    else if (acc < 67.5) res = "Tăng yếu";
    else res = "Tăng mạnh";

    let color = "#F1C617";
    if (res === "Giảm mạnh") {
      color = "#FF135B";
    }
    if (res === "Tăng mạnh") {
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

  const giaHopLy = useMemo(() => {
    if (!vn30OverviewData || !overviewDataMap || !VN30FData) return 0;
    const a = vn30OverviewData.reduce((acc, item) => {
      const marketCap =
        overviewDataMap?.find((j) => j.code === item.MA)?.marketCap || 0;
      return acc + item.AIPredict20d * marketCap;
    }, 0);
    const b =
      vn30OverviewData.reduce((acc, item) => {
        const marketCap =
          overviewDataMap?.find((j) => j.code === item.MA)?.marketCap || 0;
        return acc + item.GIA * marketCap;
      }, 0) || 1;
    return (a / b) * (VN30FData.price || 0);
  }, [vn30OverviewData]);

  const columns = useMemo(() => {
    return [
      {
        title: "Mã CK",
        key: "mack",
        render: (item: IFilterProData) => (
          <div className="flex w-fit items-center gap-1">
            <div className="h-4 w-4 flex-shrink-0 overflow-hidden rounded-full bg-white">
              <img
                src={`https://finance.vietstock.vn/image/${item.MA}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="font-semibold">{item.MA}</div>
            <div className="flex-shrink-0">
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
        title: "Điểm ảnh hưởng",
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
          const value = item.SUCMANH;
          let color = "#F1C617";
          if (value === "Giảm mạnh") {
            color = "#FF135B";
          }
          if (value === "Tăng mạnh") {
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
          const order = ["Tăng mạnh", "Tăng yếu", "Giảm yếu", "Giảm mạnh"];
          return order.indexOf(a.SUCMANH) - order.indexOf(b.SUCMANH);
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
    <div className="relative flex h-full flex-1 flex-col gap-2 px-2 pb-1">
      <div className="flex w-full items-center justify-center gap-7 rounded-full border-1 border-neutral-800 p-2">
        <div className="text-lineargreen flex items-center gap-1 text-[20px] font-semibold">
          VN30F1M <FavoriteStarButton symbol={"VN30F1M"} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-2">
            <div className="text-md text-muted">1 ngày</div>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-green",
              VN30FData?.dayChange
                ? VN30FData.dayChange > 0
                  ? "text-green"
                  : "text-red"
                : "text-yellow",
            )}
          >
            <div>{formatNumber(VN30FData?.price, 1)}</div>
            <div
              className={
                VN30FData?.dayChange
                  ? VN30FData.dayChange > 0
                    ? "rotate-0"
                    : "rotate-180"
                  : "hidden"
              }
            >
              <DoubleArrow />
            </div>
            <div>{formatNumber(VN30FData?.dayChange, 1)}</div>
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-1">
          <div className="text-md text-muted">KLGD</div>
          <div className="text-md font-semibold text-white">
            {formatNumber(VN30FData?.dayVolume)}
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-1">
          <div className="text-md text-muted">Xu hướng</div>
          <div className="text-md font-semibold text-white">{xuHuongChung}</div>
        </div>
        <Divider />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-md text-muted">
            AI dự đoán 20D
            <Tooltip
              content="Dựa trên AI model dự đoán 20 phiên"
              className="text-sm text-muted"
            >
              <InfoCircle iconStyle="Broken" size={14} />
            </Tooltip>
          </div>
          <div className="text-md font-semibold text-white">
            {formatNumber(giaHopLy, 1)}
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={vn30OverviewData}
        isLoading={isLoading}
      ></Table>
    </div>
  );
}
