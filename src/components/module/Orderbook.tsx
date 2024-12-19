"use client";

import useMarketOverviewData from "@/hooks/useMarketOverview";
import useSymbolInfo from "@/hooks/useSymbolInfo";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { Spinner } from "@nextui-org/react";
import { useMemo } from "react";

function Orderbook({ symbol }: { symbol?: string }) {
  const { data, isLoading } = useSymbolInfo(symbol);
  const { data: marketOverviewData } = useMarketOverviewData();
  const symbolOverviewData = useMemo(() => {
    if (!marketOverviewData || !data) return null;
    return marketOverviewData.find((item) => item.code === data.symbol);
  }, [marketOverviewData]);

  const isControlled = !!symbol;

  const symbolData = data;
  const maxVol = symbolData
    ? Math.max(
        symbolData.bidVol1,
        symbolData.bidVol2,
        symbolData.bidVol3,
        symbolData.offerVol1,
        symbolData.offerVol2,
        symbolData.offerVol3,
      )
    : 100;
  const bidVol = symbolData
    ? symbolData.bidVol1 + symbolData.bidVol2 + symbolData.bidVol3
    : 0;
  const offerVol = symbolData
    ? symbolData.offerVol1 + symbolData.offerVol2 + symbolData.offerVol3
    : 0;

  const calculatePriceDifferent = (price1: number | string) => {
    if (isNaN(+price1) || !symbolData?.reference || +price1 === 0) return "--";

    return (
      (((+price1 - symbolData.reference) / symbolData.reference) * 100).toFixed(
        2,
      ) + "%"
    );
  };

  const calculateColor = (price: number | string) => {
    if (!symbolData || !price) return "white";
    if (isNaN(+price)) return "white";
    if (+price === symbolData.floor) return "cyan";
    if (+price === symbolData.ceiling) return "purple";
    if (+price < symbolData.reference) return "red";
    if (+price > symbolData.reference) return "green";
    return "yellow";
  };

  const conditionFormatPrice = (price: string | number) => {
    if (symbolOverviewData && symbolOverviewData.secType === "FU") {
      return formatNumber(price, 1);
    }
    return formatPrice(price);
  };

  return (
    <div className="h-full w-full min-w-[200px]">
      {!isControlled && (
        <div className="border-lineargreen text-lineargreen w-fit border-b-2 px-2 py-2 text-sm font-semibold">
          Sổ lệnh
        </div>
      )}
      <div className="grid grid-cols-3 py-2 text-xs font-semibold text-muted">
        <div>Giá</div>
        <div>Khối lượng</div>
        <div className="text-start">Tăng / Giảm</div>
      </div>
      {isLoading ? (
        <div className="flex h-20 items-center justify-center text-sm text-muted">
          <Spinner />
        </div>
      ) : symbolData ? (
        <>
          <div className="flex flex-col gap-1">
            <div
              className={cn(
                "relative h-5 text-sm font-semibold",
                "text-" + calculateColor(symbolData.offerPrice3),
              )}
            >
              <div className="absolute left-0 top-[1px] !z-10 grid w-full grid-cols-3">
                <div className="">
                  {conditionFormatPrice(symbolData.offerPrice3)}
                </div>
                <div
                  key={symbolData.offerVol3?.toString()}
                  className="animate-changeColorCyan"
                >
                  {formatNumber(symbolData.offerVol3)}
                </div>
                <div className="flex items-center">
                  {calculatePriceDifferent(symbolData.offerPrice3)}
                </div>
              </div>
              <div
                className={cn(
                  "!z-1 absolute right-0 top-0 h-full rounded-[2px] duration-1000 transition-width",
                  "!bg-red/20",
                )}
                style={{ width: `${(symbolData.offerVol3 / maxVol) * 100}%` }}
              ></div>
            </div>
            <div
              className={cn(
                "relative h-5 text-sm font-semibold",
                "text-" + calculateColor(symbolData.offerPrice2),
              )}
            >
              <div className="absolute left-0 top-[1px] !z-10 grid w-full grid-cols-3">
                <div className="">
                  {conditionFormatPrice(symbolData.offerPrice2)}
                </div>
                <div
                  key={symbolData.offerVol2?.toString()}
                  className="animate-changeColorCyan"
                >
                  {formatNumber(symbolData.offerVol2)}
                </div>
                <div className="flex items-center">
                  {calculatePriceDifferent(symbolData.offerPrice2)}
                </div>
              </div>
              <div
                className={cn(
                  "!z-1 absolute right-0 top-0 h-full rounded-[2px] duration-1000 transition-width",
                  "!bg-red/20",
                )}
                style={{ width: `${(symbolData.offerVol2 / maxVol) * 100}%` }}
              ></div>
            </div>
            <div
              className={cn(
                "relative h-5 text-sm font-semibold",
                "text-" + calculateColor(symbolData.offerPrice1),
              )}
            >
              <div className="absolute left-0 top-[1px] !z-10 grid w-full grid-cols-3">
                <div className="">
                  {conditionFormatPrice(symbolData.offerPrice1)}
                </div>
                <div
                  key={symbolData.offerVol1?.toString()}
                  className="animate-changeColorCyan"
                >
                  {formatNumber(symbolData.offerVol1)}
                </div>
                <div className="flex items-center">
                  {calculatePriceDifferent(symbolData.offerPrice1)}
                </div>
              </div>
              <div
                className={cn(
                  "!z-1 absolute right-0 top-0 h-full rounded-[2px] duration-1000 transition-width",
                  "!bg-red/20",
                )}
                style={{ width: `${(symbolData.offerVol1 / maxVol) * 100}%` }}
              ></div>
            </div>
          </div>
          {symbolData.closePrice ? (
            <div
              className={cn(
                "flex justify-center gap-4 py-3 text-md font-semibold text-green",
                +symbolData.changePercent.toFixed(2) > 0
                  ? "text-green"
                  : +symbolData.changePercent.toFixed(2) < 0
                    ? "text-red"
                    : "text-yellow",
                symbolData.closePrice === symbolData.ceiling && "text-purple",
                symbolData.closePrice === symbolData.floor && "text-cyan",
              )}
            >
              <div>{conditionFormatPrice(symbolData.closePrice)}</div>
              <div className="text-white">
                {formatNumber(symbolData.closeVol)}
              </div>
              <div className="flex items-center">
                {symbolData.changePercent > 0 ? (
                  <DoubleArrow />
                ) : symbolData.changePercent < 0 ? (
                  <DoubleArrow rotate={180} />
                ) : null}{" "}
                {conditionFormatPrice(symbolData.change)} (
                {Math.abs(symbolData.changePercent).toFixed(2)}%)
              </div>
            </div>
          ) : (
            <div className="text-yellow-400 flex justify-center gap-3 py-3 font-bold">
              -
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div
              className={cn(
                "relative h-5 text-sm font-semibold",
                "text-" + calculateColor(symbolData.bidPrice1),
              )}
            >
              <div className="absolute left-0 top-[1px] !z-10 grid w-full grid-cols-3">
                <div className="">
                  {conditionFormatPrice(symbolData.bidPrice1)}
                </div>
                <div
                  key={symbolData.bidVol1?.toString()}
                  className="animate-changeColorCyan"
                >
                  {formatNumber(symbolData.bidVol1)}
                </div>
                <div className="flex items-center">
                  {calculatePriceDifferent(symbolData.bidPrice1)}
                </div>
              </div>
              <div
                className={cn(
                  "!z-1 absolute right-0 top-0 h-full rounded-[2px] duration-1000 transition-width",
                  "!bg-green/20",
                )}
                style={{ width: `${(symbolData.bidVol1 / maxVol) * 100}%` }}
              ></div>
            </div>
            <div
              className={cn(
                "relative h-5 text-sm font-semibold",
                "text-" + calculateColor(symbolData.bidPrice2),
              )}
            >
              <div className="absolute left-0 top-[1px] !z-10 grid w-full grid-cols-3">
                <div className="">
                  {conditionFormatPrice(symbolData.bidPrice2)}
                </div>
                <div
                  key={symbolData.bidVol2?.toString()}
                  className="animate-changeColorCyan"
                >
                  {formatNumber(symbolData.bidVol2)}
                </div>
                <div className="flex items-center">
                  {calculatePriceDifferent(symbolData.bidPrice2)}
                </div>
              </div>
              <div
                className={cn(
                  "!z-1 absolute right-0 top-0 h-full rounded-[2px] duration-1000 transition-width",
                  "!bg-green/20",
                )}
                style={{ width: `${(symbolData.bidVol2 / maxVol) * 100}%` }}
              ></div>
            </div>
            <div
              className={cn(
                "relative h-5 text-sm font-semibold",
                "text-" + calculateColor(symbolData.bidPrice3),
              )}
            >
              <div className="absolute left-0 top-[1px] !z-10 grid w-full grid-cols-3">
                <div className="">
                  {conditionFormatPrice(symbolData.bidPrice3)}
                </div>
                <div
                  key={symbolData.bidVol3?.toString()}
                  className="animate-changeColorCyan"
                >
                  {formatNumber(symbolData.bidVol3)}
                </div>
                <div className="flex items-center">
                  {calculatePriceDifferent(symbolData.bidPrice3)}
                </div>
              </div>
              <div
                className={cn(
                  "!z-1 absolute right-0 top-0 h-full rounded-[2px] duration-1000 transition-width",
                  "!bg-green/20",
                )}
                style={{ width: `${(symbolData.bidVol3 / maxVol) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex py-3">
            <div className="flex w-5 items-center justify-center rounded-[4px] border-1 border-green bg-[#1BF81F33] px-1 text-sm text-green">
              M
            </div>
            <div className="relative flex flex-1 items-center">
              <div
                className="relative flex h-[24px] gap-2 overflow-hidden bg-[#1BF81F33] after:absolute after:h-full after:w-full after:origin-top-right after:rotate-[-75deg] after:bg-card after:content-['']"
                style={{ width: `${(bidVol / (bidVol + offerVol)) * 100}%` }}
              ></div>
              <div className="absolute left-2 z-10 text-sm font-semibold leading-6 text-green">
                {((bidVol / (bidVol + offerVol)) * 100).toFixed(0)}%
              </div>
              <div
                className="relative flex h-[24px] justify-end gap-2 overflow-hidden bg-[#E5115233] after:absolute after:left-0 after:right-full after:h-full after:w-full after:min-w-[50px] after:origin-bottom-left after:rotate-[-75deg] after:bg-card after:content-['']"
                style={{ width: `${(offerVol / (bidVol + offerVol)) * 100}%` }}
              ></div>
              <div className="absolute right-2 z-10 text-sm font-semibold leading-6 text-red">
                {(100 - (bidVol / (bidVol + offerVol)) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="flex w-5 items-center justify-center rounded-[4px] border-1 border-red bg-[#E5115233] px-1 text-sm text-red">
              B
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-20 items-center justify-center text-sm text-muted">
          Không có dữ liệu
        </div>
      )}
    </div>
  );
}

export default Orderbook;
