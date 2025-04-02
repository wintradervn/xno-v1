import useCompiledOverviewData from "@/hooks/useCompiledOverviewData";
import useLichSuTimKiem from "@/hooks/useLichSuTimKiem";
import { Tooltip } from "@heroui/react";
import { X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { cn, formatNumber, formatPriceWithType } from "@/lib/utils";
import { IIndexOverview } from "@/hooks/useIndexOverview";
import { TSymbolOverviewData } from "@/hooks/useMarketOverview";

export default function SearchResultUI({
  search,
  onSearch,
  hiddenIndex,
  onDataChanged,
}: {
  search: string;
  onSearch?: (value: string) => void;
  hiddenIndex?: boolean;
  onDataChanged?: (
    data: (IIndexOverview | TSymbolOverviewData)[] | undefined,
  ) => void;
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

  useEffect(() => {
    onDataChanged?.(filterData);
  }, [filterData]);

  return (
    <Fragment>
      {lichSuTimKiemSymbols?.length ? (
        <div className="mb-1 shrink-0 p-2">
          <div className="text-muted mb-2 text-xs">Lịch sử tìm kiếm</div>
          <div className="flex max-h-[84px] flex-wrap gap-2 overflow-hidden">
            {lichSuTimKiemSymbols.slice(0, 10).map((symbol: string) => (
              <Tooltip
                content={lichsuTimKiemLabels[symbol]}
                key={symbol}
                className="bg:bg-light-surface-sub rounded-[8px] border-1 p-1 px-3 dark:bg-neutral-950"
                delay={800}
                closeDelay={0}
              >
                <div
                  key={symbol}
                  className="group hover:bg-light-surface-sub border-border flex cursor-pointer items-center gap-2 rounded-full border bg-transparent p-2 text-sm font-semibold text-white transition-all hover:dark:border-neutral-500 hover:dark:bg-neutral-800"
                  onClick={() => handleSymbolClick(symbol)}
                >
                  <div className="h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white">
                    <img
                      src={`https://finance.vietstock.vn/image/${symbol}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {symbol}
                  <div
                    className="text-muted hover:text-foreground rounded-full p-0.5 hover:dark:bg-white/10"
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
      <ScrollArea className="h-[500px] min-h-0 sm:min-w-[300px]">
        <div className="flex flex-col">
          {filterData?.map((item, index: number) => (
            <div
              key={index}
              className={cn(
                "hover:bg-light-surface-sub hover:dark:bg-card flex w-full cursor-pointer justify-between gap-2 p-2",
              )}
              onClick={() => handleSymbolClick(item.code)}
            >
              <div className="flex flex-col">
                <div className="font-bold">{item.code}</div>
                <div className="text-muted max-w-[200px] overflow-hidden text-sm font-thin text-nowrap text-ellipsis sm:max-w-[300px]">
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
                  "floor" in item && item.price === item.floor && "text-floor",
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
