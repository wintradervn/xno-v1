"use client";

import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useSymbolInfo from "@/hooks/useSymbolInfo";
import {
  useSymbolInfoWebsocketData,
  useTPWebsocketData,
} from "@/hooks/websocket/useSymbolInfoWebsocket";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { Spinner } from "@heroui/react";
import { useMemo } from "react";

function Orderbook({ symbol }: { symbol?: string }) {
  const { data: symbolData, isLoading } = useSymbolInfo(symbol);
  const { currentSymbol } = useCurrentSymbol();
  const { data: marketOverviewData } = useMarketOverviewData();
  const symbolOverviewData = useMemo(() => {
    if (!marketOverviewData || !symbolData) return null;
    return marketOverviewData.find((item) => item.code === symbolData.symbol);
  }, [marketOverviewData]);

  const { tp } = useTPWebsocketData(currentSymbol);

  const { symbolInfo: si } = useSymbolInfoWebsocketData(currentSymbol);

  const bidList = useMemo(() => {
    if (si?.tradingSession === "CONTINUOUS") {
      return tp?.bid.map((b) => ({ ...b, price: b.price * 1000 })) || [];
    }
    return symbolData
      ? [
          { price: symbolData.bidPrice1, qtty: symbolData.bidVol1 },
          { price: symbolData.bidPrice2, qtty: symbolData.bidVol2 },
          { price: symbolData.bidPrice3, qtty: symbolData.bidVol3 },
        ]
      : [];
  }, [tp, symbolData, si]);

  const askList = useMemo(() => {
    if (si?.tradingSession === "CONTINUOUS") {
      return tp?.ask.map((b) => ({ ...b, price: b.price * 1000 })) || [];
    }
    return symbolData
      ? [
          { price: symbolData.offerPrice1, qtty: symbolData.offerVol1 },
          { price: symbolData.offerPrice2, qtty: symbolData.offerVol2 },
          { price: symbolData.offerPrice3, qtty: symbolData.offerVol3 },
        ]
      : [];
  }, [tp, symbolData, si]);

  const maxVol = useMemo(() => {
    return Math.max(
      ...bidList.map((i) => i.qtty),
      ...askList.map((i) => i.qtty),
      1,
    );
  }, [bidList, askList]);

  const bidVol = useMemo(() => {
    return (
      si?.bidQtty || bidList.reduce((acc, item) => acc + item.qtty, 0) || 0
    );
  }, [si, bidList]);

  const offerVol = useMemo(() => {
    return (
      si?.offerQtty || askList.reduce((acc, item) => acc + item.qtty, 0) || 0
    );
  }, [si, askList]);

  const changed = useMemo(() => {
    if (si?.changed) return si.changed * 1000;
    return symbolData?.change || 0;
  }, [si, symbolData]);

  const changedRatio = useMemo(() => {
    return si?.changedRatio || symbolData?.changePercent || 0;
  }, [si, symbolData]);

  const matchPrice = useMemo(() => {
    if (si?.price) return si.price * 1000;
    return symbolData?.closePrice || 0;
  }, [si, symbolData]);

  const calculatePriceDifferent = (price1: number | string) => {
    if (isNaN(+price1) || !symbolData?.reference || +price1 === 0) return "--";

    return (
      (
        ((+price1 / (symbolOverviewData?.secType === "FU" ? 1000 : 1) -
          symbolData.reference) /
          symbolData.reference) *
        100
      ).toFixed(2) + "%"
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
    if (!symbolOverviewData) return "-";
    if (symbolOverviewData?.secType === "FU") {
      return formatNumber(+price / 1000, 1);
    }
    return formatPrice(price);
  };

  return (
    <div className="flex h-full w-full min-w-[200px] flex-col gap-2">
      <div className="text-muted grid grid-cols-3 py-2 text-xs font-semibold">
        <div>Giá</div>
        <div>Khối lượng</div>
        <div className="text-start">Tăng / Giảm</div>
      </div>
      <div className="overflow-auto">
        {isLoading ? (
          <div className="text-muted flex h-20 items-center justify-center text-sm">
            <Spinner />
          </div>
        ) : symbolData ? (
          <>
            <div className="flex min-h-[70px] flex-col gap-1">
              {askList
                ? askList
                    .sort((a, b) => b.price - a.price)
                    .map((item, i) => (
                      <div
                        className={cn(
                          "relative h-5 text-sm font-semibold",
                          "text-" + calculateColor(item.price),
                        )}
                        key={item.price}
                      >
                        <div className="absolute top-[1px] left-0 z-10! grid w-full grid-cols-3">
                          <div key={item.price}>
                            {conditionFormatPrice(item.price)}
                          </div>
                          <div
                            key={item.qtty?.toString()}
                            className={cn(
                              "w-fit duration-500",
                              item.qtty && "animate-change-background-yellow",
                            )}
                          >
                            {formatNumber(item.qtty)}
                          </div>
                          <div className="flex items-center">
                            {calculatePriceDifferent(item.price)}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "transition-width absolute top-0 right-0 z-1! h-full rounded-[2px] duration-1000",
                            "bg-red-bg-light dark:bg-red-bg-dark",
                          )}
                          style={{
                            width: `${(item.qtty / maxVol) * 100}%`,
                          }}
                        ></div>
                      </div>
                    ))
                : null}
            </div>
            {matchPrice ? (
              <div
                className={cn(
                  "text-md text-green flex justify-center gap-4 py-3 font-semibold",
                  +changedRatio > 0
                    ? "text-green"
                    : +changedRatio < 0
                      ? "text-red"
                      : "text-yellow",
                  matchPrice === symbolData?.ceiling && "text-ceiling",
                  matchPrice === symbolData?.floor && "text-floor",
                )}
              >
                <div
                  className="animate-change-background-yellow"
                  key={matchPrice}
                >
                  {conditionFormatPrice(matchPrice)}
                </div>
                <div
                  className="animate-change-background-yellow text-white"
                  key={si?.matchQtty}
                >
                  {si && formatNumber(si.matchQtty * 10)}
                </div>
                <div className="flex items-center">
                  {changedRatio > 0 ? (
                    <DoubleArrow />
                  ) : changedRatio < 0 ? (
                    <DoubleArrow rotate={180} />
                  ) : null}{" "}
                  {conditionFormatPrice(changed)} (
                  {Math.abs(changedRatio).toFixed(2)}%)
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-3 py-3 font-bold text-yellow-400">
                -
              </div>
            )}
            <div className="flex min-h-[70px] flex-col gap-1">
              {bidList
                ? bidList.map((item, i) => (
                    <div
                      className={cn(
                        "relative h-5 text-sm font-semibold",
                        "text-" + calculateColor(item.price),
                      )}
                      key={item.price}
                    >
                      <div className="absolute top-[1px] left-0 z-10! grid w-full grid-cols-3">
                        <div>{conditionFormatPrice(item.price)}</div>
                        <div
                          key={item.qtty?.toString()}
                          className={cn(
                            "w-fit duration-500",
                            item.qtty && "animate-change-background-yellow",
                          )}
                        >
                          {formatNumber(item.qtty)}
                        </div>

                        <div className="flex items-center">
                          {calculatePriceDifferent(item.price)}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "transition-width absolute top-0 right-0 z-1! h-full rounded-[2px] duration-1000",
                          "bg-red-bg-light dark:bg-red-bg-dark",
                        )}
                        style={{
                          width: `${(item.qtty / maxVol) * 100}%`,
                        }}
                      ></div>
                    </div>
                  ))
                : null}
            </div>
            <div className="flex py-3">
              <div className="border-green text-green bg-green-bg-light dark:bg-green-bg-dark flex w-5 items-center justify-center rounded-[4px] border-1 px-1 text-sm">
                M
              </div>
              {bidVol && offerVol ? (
                <div className="relative flex flex-1 items-center">
                  <div
                    className="after:bg-card bg-green-bg-light dark:bg-green-bg-dark relative flex h-[24px] gap-2 overflow-hidden after:absolute after:h-full after:w-full after:origin-top-right after:rotate-[-75deg] after:content-['']"
                    style={{
                      width: `${(bidVol / (bidVol + offerVol)) * 100}%`,
                    }}
                  ></div>
                  <div className="text-green absolute left-2 z-10 text-sm leading-6 font-semibold">
                    {((bidVol / (bidVol + offerVol)) * 100).toFixed(0)}%
                  </div>
                  <div
                    className="after:bg-card bg-red-bg-light dark:bg-red-bg-dark relative flex h-[24px] justify-end gap-2 overflow-hidden after:absolute after:right-full after:left-0 after:h-full after:w-full after:min-w-[50px] after:origin-bottom-left after:rotate-[-75deg] after:content-['']"
                    style={{
                      width: `${(offerVol / (bidVol + offerVol)) * 100}%`,
                    }}
                  ></div>
                  <div className="text-red absolute right-2 z-10 text-sm leading-6 font-semibold">
                    {(100 - (bidVol / (bidVol + offerVol)) * 100).toFixed(0)}%
                  </div>
                </div>
              ) : (
                <div className="flex-1"></div>
              )}
              <div className="border-red text-red bg-red-bg-light dark:bg-red-bg-dark flex w-5 items-center justify-center rounded-[4px] border-1 px-1 text-sm">
                B
              </div>
            </div>
          </>
        ) : (
          <div className="text-muted flex h-20 items-center justify-center text-sm">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
}

export default Orderbook;
