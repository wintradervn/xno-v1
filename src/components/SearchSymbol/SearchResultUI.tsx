import useCompiledOverviewData from "@/hooks/useCompiledOverviewData";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useLichSuTimKiem from "@/hooks/useLichSuTimKiem";
import { Tooltip } from "@nextui-org/react";
import { X } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import {
  cn,
  formatNumber,
  formatPrice,
  formatPriceWithType,
} from "@/lib/utils";

export default function SearchResultUI({
  search,
  onSearch,
  hiddenIndex,
}: {
  search: string;
  onSearch?: (value: string) => void;
  hiddenIndex?: boolean;
}) {
  const {
    symbols: lichSuTimKiemSymbols,
    addSymbol,
    removeSymbol,
  } = useLichSuTimKiem();
  const { data: compiledData } = useCompiledOverviewData();

  const filterData = useMemo(
    () =>
      compiledData
        ?.filter(
          (item) =>
            item.code?.toLowerCase().includes(search.toLowerCase()) ||
            item.symbolName?.toLowerCase().includes(search.toLowerCase()),
        )
        .filter((item) => (hiddenIndex ? item.secType !== "Index" : true))
        .sort((a: any, b: any) => (a.volume > b.volume ? -1 : 1))
        .sort((a, b) => {
          const startsWithA = a.code
            .toLowerCase()
            .startsWith(search.toLowerCase());
          const startsWithB = b.code
            .toLowerCase()
            .startsWith(search.toLowerCase());

          // If both start with the search string, maintain original order
          if (startsWithA && startsWithB) return 0;
          // If only 'a' starts with the search string, it ranks higher
          if (startsWithA) return -1;
          // If only 'b' starts with the search string, it ranks higher
          if (startsWithB) return 1;

          // If neither starts with the search string, sort alphabetically
          return a.code.localeCompare(b.code);
        })
        .slice(0, 20),
    [compiledData, search, hiddenIndex],
  );

  const lichsuTimKiemLabels: Record<string, string> = useMemo(() => {
    if (!lichSuTimKiemSymbols || !compiledData) return {};
    return compiledData.reduce((acc: Record<string, string>, item: any) => {
      if (lichSuTimKiemSymbols.includes(item.code)) {
        acc[item.code] = item.symbolName || item.code;
      }
      return acc;
    }, {});
  }, [lichSuTimKiemSymbols, compiledData]);

  const handleSymbolClick = (symbol: string) => {
    addSymbol(symbol);
    onSearch?.(symbol);
    // closeModal();
  };

  return (
    <Fragment>
      {lichSuTimKiemSymbols?.length ? (
        <div className="mb-1 p-2">
          <div className="mb-2 text-xs text-muted">Lịch sử tìm kiếm</div>
          <div className="flex max-h-[84px] flex-wrap gap-2 overflow-hidden">
            {lichSuTimKiemSymbols.slice(0, 10).map((symbol: string) => (
              <Tooltip
                content={lichsuTimKiemLabels[symbol]}
                key={symbol}
                className="border-1 bg-neutral-950 p-1 px-3"
                delay={800}
                closeDelay={0}
              >
                <div
                  key={symbol}
                  className="group flex cursor-pointer items-center gap-2 rounded-full border border-neutral-600 bg-transparent p-2 text-sm font-semibold text-white transition-all hover:border-neutral-500 hover:bg-neutral-800"
                  onClick={() => handleSymbolClick(symbol)}
                >
                  <div className="h-5 w-5 flex-shrink-0 overflow-hidden rounded-full bg-white">
                    <img
                      src={`https://finance.vietstock.vn/image/${symbol}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {symbol}
                  <div
                    className="rounded-full p-0.5 text-neutral-600 hover:bg-white/10 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeSymbol(symbol);
                    }}
                  >
                    <X size={14} />
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <ScrollArea className="h-[500px] min-h-0 min-w-[300px]">
        <div className="flex flex-col">
          {filterData?.map((item, index: number) => (
            <div
              key={index}
              className={cn(
                "flex w-full cursor-pointer justify-between gap-2 p-2 hover:bg-card",
              )}
              onClick={() => handleSymbolClick(item.code)}
            >
              <div className="flex flex-col">
                <div className="font-bold">{item.code}</div>
                <div className="max-w-[300px] overflow-hidden text-ellipsis text-nowrap text-sm font-thin text-muted">
                  {item.exchange} - {item.symbolName}
                </div>
              </div>
              <div
                className={cn(
                  "flex flex-col items-end",
                  item.dayChange
                    ? item.dayChange > 0
                      ? "text-green"
                      : "text-red"
                    : "text-yellow",
                  "ceiling" in item &&
                    item.price === item.ceiling &&
                    "text-purple",
                  "floor" in item && item.price === item.floor && "text-cyan",
                )}
              >
                <div className="font-bold">
                  {item.secType === "Index"
                    ? formatNumber(item.price, 2)
                    : formatPriceWithType(item.price, item.secType)}
                </div>
                <div className="text-sm">
                  {item.dayChangePercent !== null &&
                    `${item.dayChangePercent.toFixed(2)}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Fragment>
  );
}
