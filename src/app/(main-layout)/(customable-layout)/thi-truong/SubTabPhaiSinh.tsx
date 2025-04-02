import FavoriteStarButton from "@/components/FavoriteStarButton";
import Divider from "@/components/ui/Divider";
import Table from "@/components/ui/Table";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useFilterProData, { IFilterProData } from "@/hooks/useFilterProData";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatNumber } from "@/lib/utils";
import { useMemo, useState } from "react";
import useIndexOverview from "@/hooks/useIndexOverview";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import { DoubleAltArrowLeft, DoubleAltArrowRight } from "solar-icon-set";
import { DANH_SACH_MA_PHAI_SINH } from "@/lib/constant";

export default function SubTabPhaiSinh() {
  const { data, isLoading: isLoading1 } = useFilterProData();
  const { data: overviewData, isLoading: isLoading2 } = useMarketOverviewData();
  const { data: indexOverviewData, isLoading: isLoading3 } = useIndexOverview();
  const { setChiTietMaCK } = useChiTietMaCK();
  const [isDayChange, setIsDayChange] = useState(true);

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
      ?.filter((item) => DANH_SACH_MA_PHAI_SINH.includes(item.code))
      .map((item) => ({
        code: item.code,
        marketCap: item.marketCap,
        changePercent: item.dayChangePercent,
      }));
  }, [overviewData]);

  const vn30OverviewData = useMemo(() => {
    const netValue = data
      ?.filter((item) => DANH_SACH_MA_PHAI_SINH.includes(item.MA))
      .reduce((acc, item) => acc + item.THANHKHOAN * item.THAYDOI, 0);
    const indexChange = VN30IndexData?.dayChange;
    const indexPerValue = Math.abs((indexChange || 0) / (netValue || 1));

    return data
      ?.filter((item) => DANH_SACH_MA_PHAI_SINH.includes(item.MA))
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

  const columns = useMemo(() => {
    return [
      {
        title: "Mã CK",
        key: "mack",
        render: (item: IFilterProData) => (
          <div className="flex w-fit items-center gap-1">
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
          const order = ["Uptr", "Tăng yếu", "Giảm yếu", "Giảm mạnh"];
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
    <div className="relative flex h-full flex-1 flex-col gap-2 pb-1 sm:px-2">
      <div className="flex h-full w-full flex-wrap items-center justify-center gap-7 rounded-[16px] border-1 p-2 sm:flex-nowrap sm:rounded-full">
        <div className="text-purple dark:text-lineargreen flex w-full items-center justify-center gap-1 text-[20px] font-semibold sm:w-fit">
          VN30F1M <FavoriteStarButton symbol={"VN30F1M"} />
        </div>
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
                  "text-green flex w-[110px] items-center justify-center gap-1",
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
                    value ? (value > 0 ? "rotate-0" : "rotate-180") : "hidden"
                  }
                >
                  <DoubleArrow />
                </div>
                <div>{formatNumber(value, 1)}</div>
              </div>
            );
          })()}
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
          <div className="text-md h-5 font-semibold text-white">
            {xuHuongChung}
          </div>
        </div>
      </div>
      <div className="w-full overflow-auto sm:contents">
        <Table
          className="max-h-[600px] min-h-[400px] sm:max-h-full"
          classNames={{
            header: "items-start min-w-[800px]",
            row: "min-w-[800px]",
          }}
          columns={columns}
          data={vn30OverviewData}
          isLoading={isLoading}
          onRowClick={(item) => {
            setChiTietMaCK(item.MA);
          }}
        ></Table>
      </div>
    </div>
  );
}
