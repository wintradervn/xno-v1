"use client";
import FavoriteStarButton from "@/components/FavoriteStarButton";
import Divider from "@/components/ui/Divider";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useIndexOverview from "@/hooks/useIndexOverview";
import useModalsState, { MODALS } from "@/hooks/useModalsState";
import useSymbolInfo from "@/hooks/useSymbolInfo";
import DoubleArrow from "@/icons/DoubleArrow";
import {
  cn,
  formatNumber,
  formatPrice,
  formatVeryLargeNumber,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { AltArrowDown } from "solar-icon-set";

export default function InfoBar() {
  const pathname = usePathname();
  const { isIndex } = useCurrentSymbol();

  if (!pathname.startsWith("/giao-dich")) return null;

  return isIndex ? <IndexInfo /> : <StockInfo />;
}

function IndexInfo() {
  const { openModal } = useModalsState(MODALS.TIM_KIEM);
  const { currentSymbol } = useCurrentSymbol();
  const { data, isLoading } = useIndexOverview();
  const symbolInfo = useMemo(
    () => data?.find((item) => item.code === currentSymbol),
    [data],
  );

  return (
    <div className="card h-[46px] px-5 py-1">
      <div className="flex items-center gap-4">
        <div
          className="flex h-[40px] cursor-pointer items-center gap-2"
          onClick={() => openModal()}
        >
          <div className="h-6 w-6 overflow-hidden rounded-full bg-white">
            <img
              src={`https://finance.vietstock.vn/image/${currentSymbol}`}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-xl font-semibold text-white">
            {currentSymbol}
          </div>
          <AltArrowDown className="text-muted" size={20} />
        </div>
        <div>
          <FavoriteStarButton symbol={currentSymbol} />
        </div>
        {isLoading ? (
          <div className="h-[40px]"></div>
        ) : (
          symbolInfo && (
            <div className="flex gap-8">
              <div
                className={cn(
                  "flex flex-col items-end gap-0.5",
                  symbolInfo?.dayChangePercent
                    ? symbolInfo.dayChangePercent > 0
                      ? "text-green"
                      : "text-red"
                    : "text-yellow",
                )}
              >
                <div className="text-md font-semibold">
                  {formatNumber(symbolInfo?.price, 2)}
                </div>
                <div className={cn("flex items-center text-sm font-medium")}>
                  {symbolInfo?.dayChangePercent ? (
                    symbolInfo.dayChangePercent > 0 ? (
                      <DoubleArrow size={14} />
                    ) : (
                      <DoubleArrow rotate={180} size={14} />
                    )
                  ) : null}
                  {!!symbolInfo?.dayChange &&
                    formatNumber(symbolInfo?.dayChange, 2)}{" "}
                  ({symbolInfo?.dayChangePercent.toFixed(2)}%)
                </div>
              </div>

              {/* <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá sàn</div>
                <div className="text-md font-semibold text-cyan">
                  {formatPrice(symbolInfo?.floor)}
                </div>
              </div> */}
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá tham chiếu</div>
                <div className="text-md font-semibold text-yellow">
                  {formatNumber(symbolInfo?.referPrice, 2)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá thấp nhất</div>
                <div className="text-md font-semibold text-red">
                  {formatNumber(symbolInfo?.lowPrice, 2)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá cao nhất</div>
                <div className="text-md font-semibold text-green">
                  {formatNumber(symbolInfo?.highPrice, 2)}
                </div>
              </div>
              {/* <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá trần</div>
                <div className="text-md font-semibold text-purple">
                  {formatPrice(symbolInfo?.ceiling)}
                </div>
              </div> */}
              <Divider />
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Khối lượng GD</div>
                {symbolInfo.dayVolume ? (
                  <div className="text-md font-semibold">
                    {formatNumber(+symbolInfo.dayVolume)}
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá trị khớp</div>
                {symbolInfo.dayValue ? (
                  <div className="text-md font-semibold">
                    {(symbolInfo.dayValue / 1000_000_000).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      },
                    )}
                    <span className="ml-1 text-sm font-normal text-muted">
                      tỷ
                    </span>
                  </div>
                ) : (
                  "-"
                )}
              </div>
              {/* <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Khối lượng khớp</div>
                {symbolInfo. ? (
                  <div className="text-md font-semibold">
                    {(+symbolInfo.totalTrading).toLocaleString()}
                  </div>
                ) : (
                  "-"
                )}
              </div> */}
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">NN mua ròng</div>
                {symbolInfo.foreignBuyVal ? (
                  <div className="text-md font-semibold text-green">
                    {formatVeryLargeNumber(+symbolInfo.foreignBuyVal)}
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">NN bán ròng</div>
                {symbolInfo.foreignSellVal ? (
                  <div className="text-md font-semibold text-red">
                    {formatVeryLargeNumber(+symbolInfo.foreignSellVal)}
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function StockInfo() {
  const { openModal } = useModalsState(MODALS.TIM_KIEM);
  const { currentSymbol } = useCurrentSymbol();
  const { data: symbolInfo, isLoading } = useSymbolInfo();

  return (
    <div className="card h-[46px] px-5 py-1">
      <div className="flex items-center gap-4">
        <div
          className="flex h-[40px] cursor-pointer items-center gap-2"
          onClick={() => openModal()}
        >
          <div className="h-6 w-6 overflow-hidden rounded-full bg-white">
            <img
              src={`https://finance.vietstock.vn/image/${currentSymbol}`}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-xl font-semibold text-white">
            {currentSymbol}
          </div>
          <AltArrowDown className="text-muted" size={20} />
        </div>
        <div>
          <FavoriteStarButton symbol={currentSymbol} />
        </div>
        {isLoading ? (
          <div className="h-[40px]"></div>
        ) : (
          symbolInfo && (
            <div className="flex gap-8">
              <div
                className={cn(
                  "flex flex-col items-end gap-0.5",
                  symbolInfo?.changePercent
                    ? symbolInfo.changePercent > 0
                      ? "text-green"
                      : "text-red"
                    : "text-yellow",
                  symbolInfo?.closePrice === symbolInfo?.ceiling &&
                    "text-purple",
                  symbolInfo?.closePrice === symbolInfo?.floor && "text-cyan",
                )}
              >
                <div className="text-md font-semibold">
                  {formatPrice(symbolInfo?.closePrice)}
                </div>
                <div className={cn("flex items-center text-sm font-medium")}>
                  {symbolInfo?.changePercent ? (
                    symbolInfo.changePercent > 0 ? (
                      <DoubleArrow size={14} />
                    ) : (
                      <DoubleArrow rotate={180} size={14} />
                    )
                  ) : null}
                  {!!symbolInfo?.change && formatPrice(symbolInfo?.change)}(
                  {symbolInfo?.changePercent.toFixed(2)}%)
                </div>
              </div>

              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá sàn</div>
                <div className="text-md font-semibold text-cyan">
                  {formatPrice(symbolInfo?.floor)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá tham chiếu</div>
                <div className="text-md font-semibold text-yellow">
                  {formatPrice(symbolInfo?.reference)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá trần</div>
                <div className="text-md font-semibold text-purple">
                  {formatPrice(symbolInfo?.ceiling)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá thấp nhất</div>
                <div className="text-md font-semibold text-red">
                  {formatPrice(symbolInfo?.low)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá cao nhất</div>
                <div className="text-md font-semibold text-green">
                  {formatPrice(symbolInfo?.high)}
                </div>
              </div>
              <Divider />
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Giá trị khớp</div>
                {symbolInfo.totalTradingValue ? (
                  <div className="text-md font-semibold">
                    {(
                      symbolInfo.totalTradingValue / 1000_000_000
                    ).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                    <span className="ml-1 text-sm font-normal text-muted">
                      tỷ
                    </span>
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">Khối lượng khớp</div>
                {symbolInfo.totalTrading ? (
                  <div className="text-md font-semibold">
                    {(+symbolInfo.totalTrading).toLocaleString()}
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">NN mua ròng</div>
                {symbolInfo.foreignBuy ? (
                  <div className="text-md font-semibold text-green">
                    {(+symbolInfo.foreignBuy).toLocaleString()}
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-xs text-muted">NN bán ròng</div>
                {symbolInfo.foreignSell ? (
                  <div className="text-md font-semibold text-red">
                    {(+symbolInfo.foreignSell).toLocaleString()}
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
