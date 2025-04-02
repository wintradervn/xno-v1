"use client";
import { ClipboardCheck } from "solar-icon-set";
import { useMemo, useState } from "react";
import useFilterProData, { IFilterProData } from "@/hooks/useFilterProData";
import Table from "@/components/ui/Table";
import FavoriteStarButton from "@/components/FavoriteStarButton";
import { cn, formatNumber, getPriceColorFromOverviewData } from "@/lib/utils";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { isMinMaxFilter, KEY_TO_NAME, TIEU_CHI_LOC_LIST } from "../constant";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import { Tooltip } from "@heroui/react";
import { Select, SelectItem } from "@/components/ui/Select";
import useIsMobile from "@/hooks/useIsMobile";
import useTheme from "@/hooks/useTheme";

const isBadgeType = (value: string) => {
  return [
    "Tăng",
    "Giảm",
    "Tăng mạnh",
    "Giảm mạnh",
    "Tăng yếu",
    "Giảm yếu",
    "Uptrend",
    "Downtrend",
    "Cải thiện",
    "Dẫn dắt",
    "Suy yếu",
    "Tụt hậu",
  ].includes(value);
};

const sortBadgeType = (a: string, b: string) => {
  const order = [
    "Giảm mạnh",
    "Giảm yếu",
    "Giảm",
    "Sideway",
    "Tăng yếu",
    "Tăng",
    "Tăng mạnh",
    "Uptrend",
  ];
  return order.indexOf(a) - order.indexOf(b);
};
const ColoredBadge = ({ value }: { value: string }) => {
  if (!isBadgeType(value)) return value;

  let color = "#FF135B";
  if (["Tăng yếu"].includes(value)) {
    color = "#FF9783";
  }
  if (["Giảm yếu", "Sideway", "Suy yếu"].includes(value)) {
    color = "#F1C617";
  }
  if (["Tăng", "Tăng mạnh", "Uptrend", "Cải thiện"].includes(value)) {
    color = "#1FAD8E";
  }
  if (["Dẫn dắt"].includes(value)) {
    color = "#dc6bde";
  }

  return (
    <div className="flex justify-end">
      <div
        className="flex h-[28px] w-[70px] items-center justify-center rounded-full border-1 p-1 text-center text-xs font-semibold"
        style={{ borderColor: color, backgroundColor: color + "32" }}
      >
        {value}
      </div>
    </div>
  );
};

export default function KetQuaLoc() {
  const { data, isLoading } = useFilterProData();
  const { filterState, listFilter } = useLocCoPhieuState();
  const { setChiTietMaCK } = useChiTietMaCK();
  const { data: overviewData } = useMarketOverviewData();
  const [selectedExchange, setSelectedExchange] = useState("all");
  const isMobile = useIsMobile();
  const { isLightMode } = useTheme();

  const symbolExtraData = useMemo(() => {
    if (!overviewData) return {};
    return overviewData?.reduce((acc: any, item) => {
      acc[item.code] = {
        color: getPriceColorFromOverviewData(item),
        exchange: item.exchange,
      };
      return acc;
    }, {});
  }, [overviewData]);

  const filteredData = useMemo(() => {
    if (!data || !filterState) return [];

    const filterFn = (item: IFilterProData) => {
      return listFilter.every((key: string) => {
        const value = filterState[key];
        if (!value) return true;

        if (Array.isArray(value)) {
          const filter = TIEU_CHI_LOC_LIST.find(
            (i) => i.key === key && i.type === "select",
          );
          const selectedOptions = value.map((v) =>
            (filter as any)?.options?.find((o: any) => o.label === v),
          );
          const includesList = selectedOptions
            ?.map((o: any) => o?.includes)
            .flat();

          return (
            includesList?.includes(item[key as keyof IFilterProData]) ||
            value.includes(item[key as keyof IFilterProData])
          );
        }
        if ("min" in value || "max" in value) {
          const filter = TIEU_CHI_LOC_LIST.find((i) => i.key === key);
          let result = true;

          if (!item[key as keyof IFilterProData]) return false;
          let v = 0;
          if (typeof item[key as keyof IFilterProData] === "number") {
            v = item[key as keyof IFilterProData] as number;
          } else {
            v = parseFloat(
              (item[key as keyof IFilterProData] as string).replaceAll("%", ""),
            );
          }
          if (filter && isMinMaxFilter(filter) && filter?.processValue) {
            v = filter.processValue(v) as number;
          }
          if (item[key as keyof IFilterProData])
            if (value.min !== undefined) {
              result = result && v >= +value.min;
            }
          if (value.max !== undefined) {
            result = result && v <= +value.max;
          }

          return result;
        }

        return true;
      });
    };
    return data
      .filter(filterFn)
      .filter(
        (item) =>
          selectedExchange === "all" ||
          symbolExtraData[item.MA]?.exchange === selectedExchange,
      );
  }, [data, filterState, listFilter, selectedExchange, symbolExtraData]);

  const columns = useMemo(() => {
    if (!listFilter) return [];
    return [
      {
        title: "Mã CK",
        key: "MA",
        className: "justify-start",
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
        key: "GIA",
        className: "text-end",
        render: (item: IFilterProData) => (
          <div className={symbolExtraData[item.MA]?.color}>
            {formatNumber(item.GIA, 2)}
          </div>
        ),
        sortFn: (a: IFilterProData, b: IFilterProData) => a.GIA - b.GIA,
      },
      {
        title: "Tổng GT GD (tỷ)",
        key: "THANHKHOAN",
        className: "text-end",
        render: (item: IFilterProData) => {
          return (
            <div className="text-right">
              {formatNumber(item.THANHKHOAN / 1000000000, 2)}
            </div>
          );
        },
        sortFn: (a: IFilterProData, b: IFilterProData) => {
          return a.THANHKHOAN - b.THANHKHOAN;
        },
      },
      {
        title: "KLGD",
        key: "volume",
        className: "text-end",
        render: (item: IFilterProData) => {
          return <div className="text-right">{formatNumber(item.volume)}</div>;
        },
        sortFn: (a: IFilterProData, b: IFilterProData) => {
          return a.volume - b.volume;
        },
      },
      ...listFilter
        ?.filter(
          (key: string) => !["volume", "THANHKHOAN", "GIA"].includes(key),
        )
        .map((key: string) => {
          const filterItem = TIEU_CHI_LOC_LIST.find((item) => item.key === key);

          return {
            key: key,
            title: (
              <Tooltip
                content={KEY_TO_NAME[key]}
                hidden={KEY_TO_NAME[key]?.length < 30}
              >
                {KEY_TO_NAME[key]}
              </Tooltip>
            ),
            className: "text-end",
            render: (item: IFilterProData) => {
              const value = item[key as keyof IFilterProData];

              if (filterItem?.customRender)
                return filterItem.customRender(value);

              if (typeof value === "string" && isBadgeType(value)) {
                return <ColoredBadge value={value as string} />;
              }

              return (
                <div className="text-right">
                  {filterItem && filterItem.processValue
                    ? formatNumber(filterItem.processValue(value), 2)
                    : value}
                </div>
              );
            },
            sortFn: (a: IFilterProData, b: IFilterProData) => {
              const aValue = a[key as keyof IFilterProData];
              const bValue = b[key as keyof IFilterProData];

              // Sort theo Tăng, Giảm, Tăng mạnh, Giảm mạnh, Tăng yếu, Giảm yếu, Uptrend, Downtrend
              if (typeof aValue === "string" && isBadgeType(aValue)) {
                return sortBadgeType(aValue, bValue as string);
              }

              if (typeof aValue === "string" && aValue.includes("%")) {
                return (
                  +aValue.replace("%", "") -
                  +(bValue as string).replace("%", "")
                );
              }

              // Sort theo dạng string: tên ngành, tên cty, ...
              if (typeof aValue === "string") {
                return aValue.localeCompare(bValue as string);
              }

              return +aValue - +bValue;
            },
          };
        }),
    ].filter(Boolean);
  }, [listFilter, symbolExtraData]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="card flex h-full flex-1 flex-col gap-0 rounded-[8px] p-0 sm:gap-2 sm:p-3">
        <div className="bg-background flex items-center justify-between sm:bg-transparent">
          <div className="bg-card sm:text-md flex w-fit items-center gap-1 rounded-t-[8px] px-2 py-1 pb-2 text-sm font-medium text-white sm:mb-0 sm:px-0 sm:pb-0">
            <svg
              width={isMobile ? "20" : "24"}
              height={isMobile ? "20" : "24"}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.25 10.03C10.25 10.57 10.4 10.65 10.74 10.77L11.25 10.95V9.25H10.95C10.57 9.25 10.25 9.6 10.25 10.03Z"
                fill={
                  isLightMode ? "#7B61FF" : "url(#paint0_linear_31320_255522)"
                }
              />
              <path
                d="M12.75 14.7508H13.05C13.44 14.7508 13.75 14.4008 13.75 13.9708C13.75 13.4308 13.6 13.3508 13.26 13.2308L12.75 13.0508V14.7508Z"
                fill={
                  isLightMode ? "#7B61FF" : "url(#paint1_linear_31320_255522)"
                }
              />
              <path
                d="M19.58 5.48L17.53 7.53C17.38 7.68 17.19 7.75 17 7.75C16.81 7.75 16.62 7.68 16.47 7.53C16.18 7.24 16.18 6.76 16.47 6.47L18.52 4.42C16.76 2.92 14.49 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 9.51 21.08 7.24 19.58 5.48ZM13.75 11.82C14.39 12.05 15.25 12.51 15.25 13.98C15.25 15.23 14.26 16.26 13.05 16.26H12.75V16.51C12.75 16.92 12.41 17.26 12 17.26C11.59 17.26 11.25 16.92 11.25 16.51V16.26H11.17C9.84 16.26 8.75 15.14 8.75 13.76C8.75 13.34 9.09 13 9.5 13C9.91 13 10.25 13.34 10.25 13.75C10.25 14.3 10.66 14.75 11.17 14.75H11.25V12.53L10.25 12.18C9.61 11.95 8.75 11.49 8.75 10.02C8.75 8.77 9.74 7.74 10.95 7.74H11.25V7.5C11.25 7.09 11.59 6.75 12 6.75C12.41 6.75 12.75 7.09 12.75 7.5V7.75H12.83C14.16 7.75 15.25 8.87 15.25 10.25C15.25 10.66 14.91 11 14.5 11C14.09 11 13.75 10.66 13.75 10.25C13.75 9.7 13.34 9.25 12.83 9.25H12.75V11.47L13.75 11.82Z"
                fill={
                  isLightMode ? "#7B61FF" : "url(#paint2_linear_31320_255522)"
                }
              />
              <path
                d="M22.69 1.71C22.61 1.53 22.47 1.38 22.28 1.3C22.19 1.27 22.1 1.25 22 1.25H18C17.59 1.25 17.25 1.59 17.25 2C17.25 2.41 17.59 2.75 18 2.75H20.19L18.52 4.42C18.9 4.75 19.25 5.1 19.58 5.48L21.25 3.81V6C21.25 6.41 21.59 6.75 22 6.75C22.41 6.75 22.75 6.41 22.75 6V2C22.75 1.9 22.73 1.81 22.69 1.71Z"
                fill={
                  isLightMode ? "#7B61FF" : "url(#paint3_linear_31320_255522)"
                }
              />
              <defs>
                <linearGradient
                  id="paint0_linear_31320_255522"
                  x1="10.25"
                  y1="9.25"
                  x2="12.4547"
                  y2="10.6035"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E9E8FF" />
                  <stop offset="1" stopColor="#B7B1FF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_31320_255522"
                  x1="12.75"
                  y1="13.0508"
                  x2="14.9547"
                  y2="14.4042"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E9E8FF" />
                  <stop offset="1" stopColor="#B7B1FF" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_31320_255522"
                  x1="2"
                  y1="2"
                  x2="31.0605"
                  y2="32.3282"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E9E8FF" />
                  <stop offset="1" stopColor="#B7B1FF" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_31320_255522"
                  x1="17.25"
                  y1="1.25"
                  x2="25.2416"
                  y2="9.59026"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E9E8FF" />
                  <stop offset="1" stopColor="#B7B1FF" />
                </linearGradient>
              </defs>
            </svg>
            Kết quả lọc{" "}
            <span className="text-linearpurple font-semibold">
              ({filteredData?.length || 0})
            </span>
          </div>
          {/* <div className="flex items-center gap-2 pb-1">
            <Select
              variant="bordered"
              placeholder="--"
              size="sm"
              className="w-[84px] text-sm sm:w-[140px]"
              classNames={{
                selectorIcon: "text-muted",
                value: "text-sm",
                trigger: "px-1 sm:px-2 ",
              }}
              defaultSelectedKeys={["all"]}
              selectionMode="single"
              selectedKeys={[selectedExchange]}
              onChange={(e) => setSelectedExchange(e.target.value)}
            >
              <SelectItem key="all">
                {isMobile ? "Sàn" : "Tất cả các sàn"}
              </SelectItem>
              <SelectItem key="HOSE">HOSE</SelectItem>
              <SelectItem key="HNX">HNX</SelectItem>
              <SelectItem key="UPCOM">UPCOM</SelectItem>
            </Select>
            <Select
              variant="bordered"
              placeholder="--"
              size="sm"
              className="w-[84px] text-sm sm:w-[140px]"
              classNames={{
                selectorIcon: "text-muted",
                value: "text-sm",
                trigger: "px-1 sm:px-2",
              }}
              defaultSelectedKeys={["all"]}
              selectionMode="single"
            >
              <SelectItem key="all">
                {isMobile ? "Ngành" : "Tất cả các ngành"}
              </SelectItem>
              <SelectItem key="HOSE">HOSE</SelectItem>
              <SelectItem key="HNX">HNX</SelectItem>
              <SelectItem key="UPCOM">UPCOM</SelectItem>
            </Select>
          </div> */}
        </div>
        <Table
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          onRowClick={(item) => {
            setChiTietMaCK(item.MA);
          }}
          classNames={{
            header:
              "bg-background dark:bg-neutral-800 max-h-11 text-foreground items-start py-1 ",
            row: "border-b-1 h-[48px] -mx-3 px-3",
          }}
        />
      </div>
    </div>
  );
}
