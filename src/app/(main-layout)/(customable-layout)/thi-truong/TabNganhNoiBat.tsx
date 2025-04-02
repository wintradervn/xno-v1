import FavoriteStarButton from "@/components/FavoriteStarButton";
import Button from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useFilterProData, { IFilterProData } from "@/hooks/useFilterProData";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useNganhNoiBatData from "@/hooks/useNganhNoiBatData";
import ChevronDown from "@/icons/ChevronDown";
import { cn, formatNumber } from "@/lib/utils";
import { Tooltip } from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DANH_MUC_BANG_GIA } from "../bang-gia/constant";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import { ArrowDown, ArrowUp } from "solar-icon-set";
const CashFlow = React.memo(function CashFlow({
  tang = 0,
  giam = 0,
  khongdoi = 0,
}: {
  tang?: number;
  giam?: number;
  khongdoi?: number;
}) {
  const total = tang + giam + khongdoi || 1;
  const percentTang = (tang / total) * 100;
  const percentGiam = (giam / total) * 100;
  const percentKhongDoi = (khongdoi / total) * 100;

  return (
    <Tooltip
      content={
        <div className="text-muted flex flex-col text-sm">
          <div>
            Tăng giá: <span className="text-green font-semibold">{tang}</span>
          </div>
          <div>
            Giảm giá: <span className="text-red font-semibold">{giam}</span>
          </div>
          <div>
            Không đổi:{" "}
            <span className="text-yellow font-semibold">{khongdoi}</span>
          </div>
        </div>
      }
      classNames={{
        content: "bg-white dark:bg-background rounded-[4px]",
      }}
      showArrow
    >
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-green h-full"
          style={{ width: percentTang.toString() + "%" }}
        ></div>
        <div
          className="bg-red h-full"
          style={{ width: percentGiam.toString() + "%" }}
        ></div>
        <div
          className="bg-yellow h-full"
          style={{ width: percentKhongDoi.toString() + "%" }}
        ></div>
      </div>
    </Tooltip>
  );
});

export default function TabNganhNoiBat({ noTitle }: { noTitle?: boolean }) {
  const [selectingNganh, setSelectingNganh] = useState<string | null>(null);

  const { data: overviewData } = useMarketOverviewData();
  const { data: nganhNoiBat } = useNganhNoiBatData();

  const abc = useMemo(() => {
    if (!overviewData) return [];
    return Object.keys(DANH_MUC_BANG_GIA)
      .map((key: string) => {
        const danhMuc = DANH_MUC_BANG_GIA[key];
        const symbolOverview = overviewData.filter((item) =>
          danhMuc.symbols.includes(item.code),
        );

        const totalDayValue = symbolOverview.reduce(
          (acc, item) => acc + (item.dayValue || 0),
          0,
        );
        const totalMarketCap = symbolOverview.reduce(
          (acc, item) => acc + (item.marketCap || 0),
          0,
        );

        const totalNNMR = symbolOverview.reduce(
          (acc, item) => acc + (item.dayNetRoomVal || 0),
          0,
        );

        const dayChange = symbolOverview.reduce(
          (acc, item) =>
            acc +
            (totalMarketCap > 0
              ? ((item.marketCap || 0) * (item.dayChangePercent || 0)) /
                totalMarketCap
              : 0),
          0,
        );

        const pe = symbolOverview.reduce(
          (acc, item) =>
            acc +
            (totalMarketCap > 0
              ? ((item.pe || 0) * (item.marketCap || 0)) / totalMarketCap
              : 0),
          0,
        );

        const pb = symbolOverview.reduce(
          (acc, item) =>
            acc +
            (totalMarketCap > 0
              ? ((item.pb || 0) * (item.marketCap || 0)) / totalMarketCap
              : 0),
          0,
        );

        return {
          id: key,
          name: danhMuc.name,
          dayValue: totalDayValue,
          nuocngoaiMR: totalNNMR,
          marketCap: totalMarketCap,
          dayChange,
          pe,
          pb,
          tang: symbolOverview.reduce(
            (acc, item2) => ((item2.dayChangePercent || 0) > 0 ? acc + 1 : acc),
            0,
          ),
          giam: symbolOverview.reduce(
            (acc, item2) => ((item2.dayChangePercent || 0) < 0 ? acc + 1 : acc),
            0,
          ),
          khongdoi: symbolOverview.reduce(
            (acc, item2) =>
              +(item2.dayChangePercent || 0)?.toFixed(2) === 0 ? 1 : acc,
            0,
          ),
        };
      })
      .sort((a, b) => b.dayChange - a.dayChange);
  }, [overviewData]);

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="sync">
        {selectingNganh ? (
          <motion.div
            key="symbols-list"
            initial={{ opacity: 0, x: "20%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "20%" }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="bg-card absolute inset-0 h-full w-full"
          >
            <SymbolsList
              nganhCode={selectingNganh}
              onGoBack={() => {
                setSelectingNganh(null);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="nganh-list"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="flex h-full flex-col gap-4"
          >
            {!noTitle && (
              <div className="text-lineargreen flex h-[30px] shrink-0 items-center font-semibold">
                Ngành nổi bật
              </div>
            )}
            <ScrollArea className="flex-1 pr-2">
              <div className="flex flex-col gap-2">
                <div
                  className="bg-card sticky top-0 z-2 grid min-w-[700px] gap-2 py-1 text-nowrap"
                  style={{
                    gridTemplateColumns: "1.7fr 0.8fr repeat(5,1fr) 1.5fr",
                  }}
                >
                  <div className="bg-card text-muted sticky left-0 min-w-[120px] text-sm">
                    Nhóm
                  </div>
                  <div className="text-muted text-right text-sm">%1D</div>
                  <div className="text-muted text-right text-sm">
                    Giá trị GD (tỷ)
                  </div>
                  <div className="text-muted text-right text-sm">
                    NN MR (tỷ)
                  </div>
                  <div className="text-muted text-right text-sm">
                    Vốn hóa (tỷ)
                  </div>
                  <div className="text-muted text-right text-sm">P/E</div>
                  <div className="text-muted text-right text-sm">P/B</div>
                  <div className="text-muted text-right text-sm">
                    Phân bổ dòng tiền
                  </div>
                </div>
                {abc ? (
                  <div className="px-0">
                    {abc.map((item: any, index: number) => (
                      <div
                        className="grid gap-2 py-2 text-sm font-medium text-white"
                        style={{
                          gridTemplateColumns:
                            "1.7fr 0.8fr repeat(5,1fr) 1.5fr",
                        }}
                        key={index}
                      >
                        <div
                          className="group bg-card sticky left-0 flex min-w-[120px] items-center gap-2 font-semibold"
                          onClick={() => setSelectingNganh(item.id)}
                        >
                          <div className="flex cursor-pointer items-center gap-2">
                            <div className="line-clamp-1 overflow-hidden">
                              {item.name}
                            </div>
                            <div className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                              <ArrowRight size={12} />
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "text-right",
                            item.dayChange > 0 ? "text-green" : "text-red",
                          )}
                        >
                          {item.dayChange.toFixed(2)}%
                        </div>
                        {/* <div className="text-right">12.3%</div> */}
                        <div className="text-right">
                          {formatNumber(item.dayValue / 1_000_000_000, 1)}
                        </div>
                        <div
                          className={cn(
                            "text-right",
                            item.nuocngoaiMR > 0 ? "text-green" : "text-red",
                          )}
                        >
                          {formatNumber(item.nuocngoaiMR / 1_000_000_000, 1)}
                        </div>
                        <div className="text-right">
                          {formatNumber(item.marketCap / 1_000_000_000, 1)}
                        </div>
                        <div className="text-right">
                          {formatNumber(item.pe, 2)}
                        </div>
                        <div className="text-right">
                          {formatNumber(item.pb, 2)}
                        </div>

                        <div className="flex items-center">
                          <CashFlow
                            tang={item.tang}
                            giam={item.giam}
                            khongdoi={item.khongdoi}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SymbolsList({
  nganhCode,
  onGoBack,
}: {
  nganhCode: string;
  onGoBack: () => void;
}) {
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const { data: filterProData } = useFilterProData();
  const { data: overviewData } = useMarketOverviewData();
  const { setChiTietMaCK } = useChiTietMaCK();

  const nganhData = useMemo(() => {
    return DANH_MUC_BANG_GIA[nganhCode];
  }, [nganhCode]);

  const stocksData: Array<any> = useMemo(() => {
    if (!filterProData || !overviewData) return [];

    return DANH_MUC_BANG_GIA[nganhCode].symbols
      .map((symbol: any) => {
        const stock = filterProData.find((item2: any) => item2.MA === symbol);
        if (!stock) return null;
        const symbolOverview = overviewData.find(
          (item2) => item2.code === symbol,
        );

        return {
          ...stock,
          changePercent: symbolOverview?.dayChangePercent || 0,
          marketCap: symbolOverview?.marketCap || 0,
          pb: symbolOverview?.pb,
          dayValue: symbolOverview?.dayValue || 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) =>
        !!a && !!b
          ? (b.changePercent - a.changePercent) * (sortAsc ? -1 : 1)
          : 0,
      );
  }, [filterProData, overviewData, nganhCode, sortAsc]);

  const renderSMG = (value: number) => {
    const color = value > 50 ? "#1FAD8E" : value < 50 ? "#FF135B" : "#FF9783";
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
  };

  const renderXuHuong = (value: string) => {
    let color = "#F1C617";
    if (value === "Downtrend") {
      color = "#FF135B";
    }
    if (value === "Uptrend") {
      color = "#1FAD8E";
    }
    return (
      <div
        className={cn(
          "flex h-7 w-[74px] items-center justify-center self-end rounded-full border-1 px-2 text-xs text-white",
        )}
        style={{ backgroundColor: `${color}32`, borderColor: color }}
      >
        {value}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex h-[30px] shrink-0 items-center gap-3">
        <Button
          variant="bordered"
          onClick={onGoBack}
          className="text-muted hover:text-foreground h-7 min-h-0 w-7 min-w-0 rounded-full bg-transparent p-1"
        >
          <ArrowLeft size={16} />
        </Button>{" "}
        <div className="text-lineargreen text-lg font-semibold">
          {nganhData?.name}
        </div>
      </div>
      <ScrollArea className="flex-1 pl-1">
        <div className="h-fit">
          <div
            className="grid min-w-[750px] gap-5 text-nowrap"
            style={{
              gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr repeat(4,1fr) 1.5fr",
            }}
          >
            <div className="bg-card text-muted sticky left-0 min-w-[80px] text-sm">
              Mã CK
            </div>
            <div className="text-muted text-right text-sm">Giá</div>
            <div
              className="text-muted hover:text-foreground flex cursor-pointer items-center justify-end text-sm"
              onClick={() => {
                setSortAsc(!sortAsc);
              }}
            >
              Thay đổi{" "}
              {sortAsc ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            </div>
            <div className="text-muted text-right text-sm">Tổng GTGD (tỷ)</div>
            <div className="text-muted text-right text-sm">Vốn hóa (tỷ)</div>
            <div className="text-muted text-right text-sm">ROE</div>
            <div className="text-muted text-right text-sm">P/B</div>
            <div className="text-muted text-right text-sm">SMG</div>
            <div className="text-muted text-center text-sm">Xu hướng</div>
          </div>
          {stocksData?.map((item: any, index: number) => (
            <div
              key={index}
              className="grid gap-5 py-2 text-sm font-medium text-white [&>div]:flex [&>div]:w-full [&>div]:items-center"
              style={{
                gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr repeat(4,1fr) 1.5fr",
              }}
            >
              <div
                className="bg-card sticky left-0 flex w-fit min-w-[80px] cursor-pointer items-center gap-1 hover:bg-white/10"
                onClick={() => {
                  setChiTietMaCK(item?.MA);
                }}
              >
                <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white">
                  <img
                    src={`https://finance.vietstock.vn/image/${item?.MA}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="font-semibold">{item?.MA}</div>
                <div className="shrink-0">
                  <FavoriteStarButton symbol={item?.MA} size={14} />
                </div>
              </div>
              <div className="justify-end">{formatNumber(item?.GIA, 2)}</div>
              <div
                className={cn(
                  "flex items-center justify-end gap-1",
                  item?.changePercent > 0
                    ? "text-green"
                    : item?.changePercent < 0
                      ? "text-red"
                      : "text-yellow",
                )}
              >
                <div className="justify-end">
                  {item.changePercent
                    ? formatNumber(item.changePercent, 2)
                    : "0"}
                  %
                </div>
              </div>
              <div className="justify-end">
                {formatNumber(item.dayValue / 1000000000, 2)}
              </div>
              <div className="justify-end">
                {formatNumber((item.marketCap || 0) / 1000000000)}
              </div>
              <div className="justify-end">{formatNumber(item.ROE, 2)}</div>
              <div className="justify-end">{formatNumber(item.pb, 2)}</div>
              <div>{renderSMG(item.RS)}</div>
              <div className="flex w-full items-center justify-center">
                {renderXuHuong(item.AiTrend)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
