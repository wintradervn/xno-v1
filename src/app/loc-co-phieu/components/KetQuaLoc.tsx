"use client";
import { ClipboardCheck } from "solar-icon-set";
import { useMemo } from "react";
import useFilterProData, { IFilterProData } from "@/hooks/useFilterProData";
import Table from "@/components/ui/Table";
import FavoriteStarButton from "@/components/FavoriteStarButton";
import { formatNumber } from "@/lib/utils";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { KEY_TO_NAME, TIEU_CHI_LOC_LIST } from "../constant";

export default function KetQuaLoc() {
  const { data, isLoading } = useFilterProData();
  const { filterState, listFilter } = useLocCoPhieuState();

  const filteredData = useMemo(() => {
    if (!data || !filterState) return [];

    const filterFn = (item: IFilterProData) => {
      return Object.keys(filterState).every((key) => {
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
          let multiplier = 1;
          let result = true;
          if (key === "THANHKHOAN") {
            multiplier = 1000000000;
          }
          if (!item[key as keyof IFilterProData]) return false;
          let v = 0;
          if (typeof item[key as keyof IFilterProData] === "number") {
            v = item[key as keyof IFilterProData] as number;
          } else {
            v = parseFloat(
              (item[key as keyof IFilterProData] as string).replaceAll("%", ""),
            );
          }
          if (item[key as keyof IFilterProData])
            if (value.min !== undefined) {
              result = result && v >= +value.min * multiplier;
            }
          if (value.max !== undefined) {
            result = result && v <= +value.max * multiplier;
          }

          return result;
        }

        return true;
      });
    };
    return data.filter(filterFn);
  }, [data, filterState]);
  const columns = useMemo(() => {
    if (!listFilter) return [];
    return [
      {
        title: "Mã CK",
        key: "MA",
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
        key: "GIA",
        className: "text-end",
        render: (item: IFilterProData) => (
          <div className="">{formatNumber(item.GIA, 2)}</div>
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
              {formatNumber(item.THANHKHOAN / 1000000000)}
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
          return {
            key: key,
            title: KEY_TO_NAME[key],
            className: "text-end",
            render: (item: IFilterProData) => {
              return (
                <div className="text-right">
                  {item[key as keyof IFilterProData]}
                </div>
              );
            },
          };
        }),
    ].filter(Boolean);
  }, [listFilter]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div className="card flex w-fit items-center gap-1 rounded-b-none px-4 text-md font-medium text-white">
          <ClipboardCheck size={20} />
          Kết quả lọc{" "}
          <span className="text-linearpurple font-semibold">
            ({filteredData?.length || 0})
          </span>
        </div>
      </div>
      <div className="card flex h-full flex-1 flex-col gap-2 rounded-tl-none p-3">
        <Table columns={columns} data={filteredData} isLoading={isLoading} />
      </div>
    </div>
  );
}
