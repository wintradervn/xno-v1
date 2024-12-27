"use client";
import Input from "@/components/ui/Input";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { RefreshCircle } from "solar-icon-set";
import {
  TIEU_CHI_LOC_NHOM_BIEN_DONG_GIA,
  TIEU_CHI_LOC_NHOM_DIEM_SO_TAI_CHINH,
  TIEU_CHI_LOC_NHOM_KY_THUAT_CHUYEN_SAU,
  TIEU_CHI_LOC_NHOM_THONG_DUNG,
  TTieuChiLoc,
} from "../constant";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Select, SelectItem } from "@/components/ui/Select";
import { use, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChonGiaTri() {
  const {
    listFilter,
    removeFilter,
    setDefaultFilter,
    filterState,
    updateFilterState,
  } = useLocCoPhieuState();

  const [state, setState] = useState<any>(filterState || {});

  const filtersData = listFilter
    ? [
        ...TIEU_CHI_LOC_NHOM_THONG_DUNG,
        ...TIEU_CHI_LOC_NHOM_BIEN_DONG_GIA,
        ...TIEU_CHI_LOC_NHOM_DIEM_SO_TAI_CHINH,
        ...TIEU_CHI_LOC_NHOM_KY_THUAT_CHUYEN_SAU,
      ]
        .filter((item) => listFilter.includes(item.key))
        .sort(
          (a: any, b: any) =>
            listFilter.indexOf(a.key) - listFilter.indexOf(b.key),
        )
    : [];

  useEffect(() => {
    if (JSON.stringify(filterState) === JSON.stringify(state)) return;
    setState(filterState || {});
  }, [filterState]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="card flex w-fit items-center gap-1 rounded-b-none px-4 text-md font-medium text-white">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.11184 1.04199H10.8725C12.404 1.04198 13.617 1.04197 14.5664 1.1696C15.5434 1.30096 16.3342 1.57773 16.9578 2.20136C17.2019 2.44544 17.2019 2.84117 16.9578 3.08525C16.7137 3.32932 16.318 3.32932 16.0739 3.08525C15.7213 2.73257 15.2382 2.52118 14.3998 2.40846C13.5434 2.29332 12.4145 2.29199 10.8255 2.29199H9.15885C7.56984 2.29199 6.44095 2.29332 5.58456 2.40846C4.74615 2.52118 4.26312 2.73257 3.91044 3.08525C3.55777 3.43792 3.34637 3.92096 3.23365 4.75937C3.11852 5.61575 3.11719 6.74464 3.11719 8.33366V11.667C3.11719 13.256 3.11852 14.3849 3.23365 15.2413C3.34637 16.0797 3.55777 16.5627 3.91044 16.9154C4.26312 17.2681 4.74615 17.4795 5.58456 17.5922C6.44095 17.7073 7.56984 17.7087 9.15885 17.7087H10.8255C12.4145 17.7087 13.5434 17.7073 14.3998 17.5922C15.2382 17.4795 15.7213 17.2681 16.0739 16.9154C16.6539 16.3355 16.8295 15.4343 16.86 13.3246C16.865 12.9795 17.1488 12.7037 17.494 12.7087C17.8391 12.7137 18.1149 12.9976 18.1099 13.3427C18.0806 15.3656 17.9497 16.8074 16.9578 17.7993C16.3342 18.4229 15.5434 18.6997 14.5664 18.831C13.617 18.9587 12.404 18.9587 10.8725 18.9587H9.11185C7.58038 18.9587 6.36735 18.9587 5.418 18.831C4.44098 18.6997 3.65019 18.4229 3.02656 17.7993C2.40292 17.1757 2.12616 16.3849 1.9948 15.4078C1.86716 14.4585 1.86717 13.2455 1.86719 11.714V8.28664C1.86717 6.75518 1.86716 5.54215 1.9948 4.59281C2.12616 3.61579 2.40292 2.825 3.02656 2.20136C3.65019 1.57773 4.44098 1.30096 5.418 1.1696C6.36735 1.04197 7.58037 1.04198 9.11184 1.04199ZM15.0865 5.87162C15.9704 4.98767 17.4036 4.98767 18.2876 5.87162C19.1715 6.75558 19.1715 8.18875 18.2876 9.07271L14.3248 13.0355C14.1092 13.2511 13.9633 13.397 13.8 13.5244C13.6078 13.6743 13.3998 13.8029 13.1798 13.9077C12.9928 13.9969 12.7971 14.0621 12.5078 14.1584L10.7714 14.7372C10.3881 14.865 9.96542 14.7652 9.67968 14.4795C9.39394 14.1938 9.29416 13.7711 9.42195 13.3878L9.98908 11.6864C9.99301 11.6746 9.99689 11.6629 10.0007 11.6514C10.0971 11.3621 10.1623 11.1664 10.2515 10.9794C10.3563 10.7593 10.4848 10.5514 10.6347 10.3592C10.7622 10.1958 10.908 10.05 11.1237 9.83442C11.1323 9.82584 11.141 9.81715 11.1498 9.80834L15.0865 5.87162ZM17.4037 6.75551C17.0079 6.35971 16.3662 6.35971 15.9704 6.75551L15.8189 6.907C15.8271 6.9349 15.8365 6.96457 15.8473 6.99576C15.9257 7.2217 16.0745 7.52055 16.3566 7.80262C16.6386 8.0847 16.9375 8.23345 17.1634 8.31184C17.1946 8.32266 17.2243 8.33209 17.2522 8.34031L17.4037 8.18882C17.7995 7.79302 17.7995 7.15131 17.4037 6.75551ZM16.2975 9.29495C16.0326 9.15581 15.7466 8.96044 15.4727 8.68651C15.1987 8.41257 15.0034 8.12654 14.8642 7.86164L12.0336 10.6922C11.7827 10.9431 11.6947 11.0327 11.6204 11.128C11.5263 11.2486 11.4457 11.3791 11.3799 11.5171C11.3279 11.6262 11.2871 11.745 11.1749 12.0816L10.8414 13.0824L11.0768 13.3178L12.0775 12.9842C12.4142 12.872 12.5329 12.8313 12.642 12.7793C12.7801 12.7135 12.9106 12.6329 13.0312 12.5388C13.1265 12.4645 13.2161 12.3764 13.467 12.1255L16.2975 9.29495ZM6.03385 7.50033C6.03385 7.15515 6.31368 6.87533 6.65885 6.87533H12.0755C12.4207 6.87533 12.7005 7.15515 12.7005 7.50033C12.7005 7.8455 12.4207 8.12533 12.0755 8.12533H6.65885C6.31368 8.12533 6.03385 7.8455 6.03385 7.50033ZM6.03385 10.8337C6.03385 10.4885 6.31368 10.2087 6.65885 10.2087H8.74219C9.08737 10.2087 9.36719 10.4885 9.36719 10.8337C9.36719 11.1788 9.08737 11.4587 8.74219 11.4587H6.65885C6.31368 11.4587 6.03385 11.1788 6.03385 10.8337ZM6.03385 14.167C6.03385 13.8218 6.31368 13.542 6.65885 13.542H7.90885C8.25403 13.542 8.53385 13.8218 8.53385 14.167C8.53385 14.5122 8.25403 14.792 7.90885 14.792H6.65885C6.31368 14.792 6.03385 14.5122 6.03385 14.167Z"
            fill="white"
          />
        </svg>
        Chọn giá trị
      </div>
      <div className="card flex flex-1 flex-col gap-2 rounded-tl-none p-3">
        <ScrollArea className="flex flex-1 flex-col pr-2">
          {filtersData?.map((filter: TTieuChiLoc) => (
            <div
              className="grid items-center p-1 text-md font-semibold"
              key={filter.key}
              style={{ gridTemplateColumns: "1.4fr 2fr 0.2fr" }}
            >
              <div className="overflow-hidden text-ellipsis text-nowrap text-sm font-semibold text-white">
                {filter.name}
              </div>
              <div className="flex items-center justify-center gap-3">
                {filter.type === "minmax" && (
                  <>
                    <Input
                      className="w-28"
                      placeholder="Tối thiểu"
                      size="sm"
                      value={state[filter.key]?.min ?? ""}
                      type="number"
                      onValueChange={(value: any) => {
                        setState({
                          ...state,
                          [filter.key]: {
                            ...state[filter.key],
                            min: value !== "" ? +value : undefined,
                          },
                        });
                      }}
                    />
                    <span>-</span>
                    <Input
                      className="w-28"
                      placeholder="Tối đa"
                      size="sm"
                      value={state[filter.key]?.max}
                      onValueChange={(value: any) =>
                        setState({
                          ...state,
                          [filter.key]: {
                            ...state[filter.key],
                            max: +value,
                          },
                        })
                      }
                    />
                  </>
                )}
                {filter.type === "select" && (
                  <>
                    <Select
                      size="sm"
                      color="default"
                      selectedKeys={state[filter.key] || []}
                      onSelectionChange={(value) => {
                        setState({
                          ...state,
                          [filter.key]: Array.from(value),
                        });
                      }}
                      className="w-64"
                      variant="flat"
                      selectionMode="multiple"
                    >
                      {filter.options.map((option) => (
                        <SelectItem key={option.label} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </>
                )}
              </div>
              <div className="flex cursor-pointer justify-end text-fuchsia-200 hover:text-white">
                <div
                  className="rounded-full p-1 hover:text-red"
                  onClick={() => {
                    removeFilter(filter.key);
                    const newState = { ...state };
                    delete newState[filter.key];
                    setState(newState);
                  }}
                >
                  <X size={16} />
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex w-full flex-shrink-0 justify-between self-end">
          <div className="flex gap-2">
            <Button
              className="flex-1"
              size="sm"
              onClick={() => {
                setDefaultFilter();
                setState({});
              }}
            >
              Đặt lại
            </Button>
            <Button className="flex-1" size="sm">
              Lưu bộ lọc
            </Button>
          </div>
          <div>
            <Button
              color="primary"
              size="sm"
              className="text-sm font-semibold"
              onClick={() => updateFilterState(state)}
            >
              Lọc <RefreshCircle />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
