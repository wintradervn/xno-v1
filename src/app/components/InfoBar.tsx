"use client";
import FavoriteStarButton from "@/components/FavoriteStarButton";
import SearchResultUI from "@/components/SearchSymbol/SearchResultUI";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import Popover from "@/components/ui/Popover";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useIndexOverview from "@/hooks/useIndexOverview";
import useIsMobile from "@/hooks/useIsMobile";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useNuocNgoaiData from "@/hooks/useNuocNgoaiData";
import {
  useSymbolInfoWebsocketData,
  useSymbolWSData,
  useWSDataBySymbol,
} from "@/hooks/websocket/useSymbolInfoWebsocket";
import DoubleArrow from "@/icons/DoubleArrow";
import {
  cn,
  formatNumber,
  formatPriceWithType,
  formatVeryLargeNumber,
} from "@/lib/utils";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { LucideChevronDown, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function InfoBar() {
  const pathname = usePathname();
  const { isIndex } = useCurrentSymbol();

  if (!pathname.startsWith("/giao-dich")) return null;

  return isIndex ? <IndexInfo /> : <StockInfo />;
}

function SearchPopover({
  symbolInfo,
  hasSymbol,
}: {
  symbolInfo?: any;
  hasSymbol?: boolean;
}) {
  const { currentSymbol, setCurrentSymbol } = useCurrentSymbol();
  const [searchSymbol, setSearchSymbol] = useState("");
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [firstSymbol, setFirstSymbol] = useState<string | undefined>();

  const isMobile = useIsMobile();

  useEffect(() => {
    setSearchSymbol("");
  }, [currentSymbol, isOpenSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchSymbol("");
  }, []);

  const renderTrigger = () => (
    <div
      className="flex h-full cursor-pointer flex-col justify-start gap-0"
      onClick={() => setIsOpenSearch(true)}
    >
      <div className="flex items-center gap-1 sm:gap-3">
        <div className="h-6 w-6 overflow-hidden rounded-full bg-white">
          <img
            src={`https://finance.vietstock.vn/image/${currentSymbol}`}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="text-[20px] leading-[36px] font-semibold text-white">
          {currentSymbol}
        </div>
        <div>
          <LucideChevronDown size={18} />
        </div>
        <div>
          <FavoriteStarButton symbol={currentSymbol} />
        </div>
        {hasSymbol && (
          <div className="text-medium flex items-center gap-2">
            <div className="bg-purple dark:bg-lineargreen hidden h-2 w-2 rounded-full sm:block"></div>
            <div className="text-lineargreen font-semibold">
              {symbolInfo?.exchange}
            </div>
          </div>
        )}
      </div>
      {hasSymbol && (
        <div className="text-muted line-clamp-1 h-5 shrink-0 overflow-hidden text-sm font-normal text-ellipsis">
          {symbolInfo?.symbolName}
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="flex max-w-[500px] flex-col gap-2">
      <Input
        autoFocus
        placeholder="Tìm mã CK"
        value={searchSymbol}
        onValueChange={setSearchSymbol}
        endContent={
          searchSymbol && (
            <button
              className="hover:text-foreground/80 transition-all hover:bg-neutral-800 active:bg-neutral-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSearchSymbol("");
              }}
            >
              <X size={20} />
            </button>
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClearSearch();
          }
          if (e.key === "Enter" && firstSymbol && searchSymbol) {
            setCurrentSymbol(firstSymbol);
            setIsOpenSearch(false);
          }
        }}
        className="shrink-0"
      />
      <SearchResultUI
        search={searchSymbol}
        onSearch={(s) => {
          setCurrentSymbol(s);
          setIsOpenSearch(false);
        }}
        onDataChanged={(data) => {
          setFirstSymbol(data?.[0]?.code);
        }}
      />
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          {renderTrigger()}
          <Modal
            className="h-90vh bg-card"
            classNames={{
              body: "px-3",
            }}
            isOpen={isOpenSearch}
            onClose={() => setIsOpenSearch(false)}
            placement="bottom-center"
            scrollBehavior="outside"
          >
            <ModalContent style={{ height: "90svh", minHeight: "500px" }}>
              <ModalHeader className="py-4"></ModalHeader>
              <ModalBody autoFocus>{renderContent()}</ModalBody>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Popover
          placement="bottom-start"
          isOpen={isOpenSearch}
          onOpenChange={setIsOpenSearch}
        >
          <PopoverTrigger>{renderTrigger()}</PopoverTrigger>
          <PopoverContent autoFocus>{renderContent()}</PopoverContent>
        </Popover>
      )}
    </>
  );
}

function IndexInfo() {
  const { currentSymbol } = useCurrentSymbol();
  const { data, isLoading } = useIndexOverview();
  const symbolInfo = useMemo(
    () => data?.find((item) => item.code === currentSymbol),
    [data, currentSymbol],
  );
  const { siData, tpData } = useSymbolWSData("VCB");

  useEffect(() => {
    if (!symbolInfo?.price) return;
    document.title = `${formatPriceWithType(symbolInfo.price, symbolInfo.secType)} | ${symbolInfo.code} | XNO Trading platform`;
  }, [symbolInfo?.price]);

  const renderPrice = () => {
    return (
      symbolInfo && (
        <div
          className={cn(
            "flex flex-wrap items-end gap-0.5 sm:flex-col",
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
          <div
            className={cn("flex items-center text-sm font-medium text-nowrap")}
          >
            {symbolInfo?.dayChangePercent ? (
              symbolInfo.dayChangePercent > 0 ? (
                <DoubleArrow size={14} />
              ) : (
                <DoubleArrow rotate={180} size={14} />
              )
            ) : null}
            {!!symbolInfo?.dayChange && formatNumber(symbolInfo?.dayChange, 2)}{" "}
            ({symbolInfo?.dayChangePercent.toFixed(2)}%)
          </div>
        </div>
      )
    );
  };

  return (
    <div className="card px-3 py-1! sm:h-[46px] sm:px-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <SearchPopover />
          <div className="sm:hidden">{renderPrice()}</div>
        </div>
        {isLoading ? (
          <div className="h-[40px]"></div>
        ) : (
          symbolInfo && (
            <div className="grid grid-cols-3 gap-2 text-nowrap sm:flex sm:gap-8">
              <div className="hidden sm:block">{renderPrice()}</div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá tham chiếu</div>
                <div className="sm:text-md text-yellow text-sm font-semibold">
                  {formatNumber(symbolInfo?.referPrice, 2)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá thấp nhất</div>
                <div
                  className={cn(
                    "sm:text-md text-sm font-semibold",
                    symbolInfo?.lowPrice > symbolInfo?.referPrice
                      ? "text-green"
                      : symbolInfo?.lowPrice < symbolInfo?.referPrice
                        ? "text-red"
                        : "text-yellow",
                  )}
                >
                  {formatNumber(symbolInfo?.lowPrice, 2)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá cao nhất</div>
                <div
                  className={cn(
                    "sm:text-md text-sm font-semibold",
                    symbolInfo?.highPrice > symbolInfo?.referPrice
                      ? "text-green"
                      : symbolInfo?.highPrice < symbolInfo?.referPrice
                        ? "text-red"
                        : "text-yellow",
                  )}
                >
                  {formatNumber(symbolInfo?.highPrice, 2)}
                </div>
              </div>
              <Divider className="hidden sm:block" />
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Khối lượng GD</div>
                {symbolInfo.dayVolume ? (
                  <div className="sm:text-md text-sm font-semibold">
                    {formatNumber(+symbolInfo.dayVolume)}
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá trị khớp</div>
                {symbolInfo.dayValue ? (
                  <div className="sm:text-md text-sm font-semibold">
                    {(symbolInfo.dayValue / 1000_000_000).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      },
                    )}
                    <span className="text-muted ml-1 text-sm font-normal">
                      tỷ
                    </span>
                  </div>
                ) : (
                  "-"
                )}
              </div>
              {/* <div className="hidden flex-col items-start gap-0.5 sm:flex">
                <div className="text-muted text-xs">NN mua ròng</div>
                {symbolInfo.foreignBuyVal ? (
                  <div className="sm:text-md text-green text-sm font-semibold">
                    {formatVeryLargeNumber(+symbolInfo.foreignBuyVal)}
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="hidden flex-col items-start gap-0.5 sm:flex">
                <div className="text-muted text-xs">NN bán ròng</div>
                {symbolInfo.foreignSellVal ? (
                  <div className="sm:text-md text-red text-sm font-semibold">
                    {formatVeryLargeNumber(+symbolInfo.foreignSellVal)}
                  </div>
                ) : (
                  "-"
                )}
              </div> */}
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">GTGD NN ròng</div>
                <div className="flex items-center gap-2 text-sm">
                  {symbolInfo.foreignBuyVal ? (
                    <div
                      className={cn(
                        "sm:text-md text-green text-sm font-semibold",
                        +symbolInfo.foreignBuyVal - +symbolInfo.foreignSellVal >
                          0
                          ? "text-green"
                          : "text-red",
                      )}
                    >
                      {formatVeryLargeNumber(
                        +symbolInfo.foreignBuyVal - +symbolInfo.foreignSellVal,
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function StockInfo() {
  const { currentSymbol } = useCurrentSymbol();
  const { data, isLoading } = useMarketOverviewData();
  const { data: NNData } = useNuocNgoaiData();
  const { siData } = useSymbolWSData(currentSymbol);
  const stockOverviewInfo = useMemo(() => {
    return data?.find((item) => item.code === currentSymbol);
  }, [data, currentSymbol]);

  const priceData = useMemo(
    () => ({
      close: siData?.matchPrice
        ? formatNumber(siData.matchPrice, 2)
        : stockOverviewInfo?.price
          ? formatPriceWithType(
              stockOverviewInfo?.price,
              stockOverviewInfo?.secType,
            )
          : 0,
      high: siData?.highestPrice
        ? formatNumber(siData.highestPrice, 2)
        : formatPriceWithType(
            stockOverviewInfo?.highPrice,
            stockOverviewInfo?.secType,
          ),
      low: siData?.lowestPrice
        ? formatNumber(siData.lowestPrice, 2)
        : formatPriceWithType(
            stockOverviewInfo?.lowPrice,
            stockOverviewInfo?.secType,
          ),
      ceiling: siData?.ceilingPrice
        ? formatNumber(siData.ceilingPrice, 2)
        : formatPriceWithType(
            stockOverviewInfo?.ceiling,
            stockOverviewInfo?.secType,
          ),
      floor: siData?.floorPrice
        ? formatNumber(siData.floorPrice, 2)
        : formatPriceWithType(
            stockOverviewInfo?.floor,
            stockOverviewInfo?.secType,
          ),
      changed: siData?.changed
        ? formatNumber(siData.changed, 2)
        : stockOverviewInfo?.dayChange
          ? formatPriceWithType(
              stockOverviewInfo?.dayChange,
              stockOverviewInfo?.secType,
            )
          : 0,
      changedPercent: siData?.changedRatio
        ? siData.changedRatio
        : stockOverviewInfo?.dayChangePercent
          ? formatNumber(stockOverviewInfo?.dayChangePercent, 2)
          : 0,
      totalValue: siData?.accumulatedVal
        ? formatNumber(siData.accumulatedVal, 2)
        : ((stockOverviewInfo?.dayValue || 0) / 1000_000_000).toLocaleString(
            "en-US",
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            },
          ),
      totalVolume: siData?.accumulatedVol
        ? siData.accumulatedVol * 10
        : formatNumber(+(stockOverviewInfo?.dayVolume || 0) / 1000000, 2),
    }),
    [siData, stockOverviewInfo],
  );

  const stockNNInfo = useMemo(
    () => NNData?.find((item) => item.code === currentSymbol),
    [NNData, currentSymbol],
  );

  const renderPrice = () => {
    return (
      priceData &&
      stockOverviewInfo && (
        <div
          className={cn(
            "flex flex-nowrap items-end gap-0.5 rounded-md sm:flex-col",
            priceData.changedPercent
              ? +priceData.changedPercent > 0
                ? "text-green"
                : "text-red"
              : "text-yellow",
            +priceData.close === +priceData.ceiling && "text-ceiling",
            +priceData.close === +priceData.floor && "text-floor",
          )}
          key={priceData.close}
        >
          <div className="text-md animate-change-background-yellow font-semibold">
            {priceData.close}
          </div>
          <div
            className={cn(
              "animate-change-background-yellow flex items-center text-sm font-medium",
            )}
          >
            {priceData?.changedPercent ? (
              +priceData.changedPercent > 0 ? (
                <DoubleArrow size={14} />
              ) : (
                <DoubleArrow rotate={180} size={14} />
              )
            ) : null}
            {priceData.changed}({priceData.changedPercent}%)
          </div>
        </div>
      )
    );
  };

  useEffect(() => {
    if (!priceData.close || !stockOverviewInfo) return;
    document.title = `${priceData.close} | ${stockOverviewInfo.code} | XNO Trading platform`;
  }, [priceData.close, stockOverviewInfo, siData]);

  return (
    <div className="card px-3 py-1 sm:h-[58px] sm:px-5 sm:py-0!">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-start justify-between gap-4 sm:justify-start">
          <SearchPopover symbolInfo={stockOverviewInfo} hasSymbol />
          <div className="flex shrink-0 flex-col pt-2 sm:hidden">
            {renderPrice()}{" "}
            <div className="flex gap-2 sm:hidden">
              {priceData.totalValue ? (
                <div className="text-sm font-semibold">
                  {priceData.totalValue}
                  <span className="text-muted text-xs font-normal">tỷ</span>
                </div>
              ) : (
                "-"
              )}
              {priceData.totalVolume ? (
                <div className="text-sm font-semibold">
                  {priceData.totalVolume}
                  <span className="text-muted text-xs font-normal text-nowrap">
                    tr cp
                  </span>
                </div>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="h-[54px]"></div>
        ) : (
          stockOverviewInfo && (
            <div className="mt-1 grid grid-cols-3 items-center gap-2 text-nowrap sm:flex sm:gap-8">
              <div className="hidden sm:block">{renderPrice()}</div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá sàn</div>
                <div className="sm:text-md text-floor text-sm font-semibold">
                  {priceData.floor}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá tham chiếu</div>
                <div className="sm:text-md text-yellow text-sm font-semibold">
                  {formatPriceWithType(
                    stockOverviewInfo?.referPrice,
                    stockOverviewInfo?.secType,
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá trần</div>
                <div className="sm:text-md text-ceiling text-sm font-semibold">
                  {priceData.ceiling}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá thấp nhất</div>
                <div
                  className={cn(
                    "sm:text-md text-sm font-semibold",
                    stockOverviewInfo?.referPrice && priceData.low
                      ? +stockOverviewInfo.referPrice > +priceData.low
                        ? "text-red"
                        : +stockOverviewInfo?.referPrice < +priceData.low
                          ? "text-green"
                          : "text-yellow"
                      : "text-yellow",
                  )}
                >
                  {priceData.low}
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">Giá cao nhất</div>
                <div
                  className={cn(
                    "sm:text-md text-sm font-semibold",
                    stockOverviewInfo?.referPrice && priceData.high
                      ? stockOverviewInfo?.referPrice > +priceData.high
                        ? "text-red"
                        : stockOverviewInfo?.referPrice < +priceData.high
                          ? "text-green"
                          : "text-yellow"
                      : "text-yellow",
                  )}
                >
                  {priceData.high}
                </div>
              </div>
              <Divider className="hidden sm:block" />
              <div className="hidden flex-col items-start gap-0.5 sm:flex">
                <div className="text-muted text-xs">Giá trị khớp</div>
                {priceData.totalValue ? (
                  <div className="sm:text-md text-sm font-semibold">
                    {priceData.totalValue}
                    <span className="text-muted ml-1 text-sm font-normal">
                      tỷ
                    </span>
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="hidden flex-col items-start gap-0.5 sm:flex">
                <div className="text-muted text-xs">Khối lượng khớp</div>
                {stockOverviewInfo.dayVolume ? (
                  <div className="sm:text-md text-sm font-semibold">
                    {(+stockOverviewInfo.dayVolume).toLocaleString()}
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="text-muted text-xs">GTGD NN ròng</div>
                <div className="flex items-center gap-2 text-sm">
                  {stockNNInfo?.dayNetVal ? (
                    <div
                      className={cn(
                        "sm:text-md text-green text-sm font-semibold",
                        +stockNNInfo.dayNetVal > 0 ? "text-green" : "text-red",
                      )}
                    >
                      {formatVeryLargeNumber(+stockNNInfo.dayNetVal)}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
