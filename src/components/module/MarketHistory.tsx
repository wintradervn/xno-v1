import { cn, formatPrice, getPriceColorFromOverviewData } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { PopoverContent, PopoverTrigger, Spinner } from "@heroui/react";
import Filter from "@/icons/Filter";
import Popover from "../ui/Popover";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useDebounce } from "use-debounce";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useLichSuGiaoDich, { ILichSuGiaoDich } from "@/hooks/useLichSuGiaoDich";

function MarketHistory({ symbol }: { symbol?: string }) {
  const { currentSymbol } = useCurrentSymbol();
  const [isOpen, setIsOpen] = useState(false);
  const [klFilter, setKlFilter] = useState<number | null>(null);
  const { data: marketOverviewData } = useMarketOverviewData();
  const symbolData = useMemo(
    () =>
      marketOverviewData?.find(
        (item) => item.code === (symbol || currentSymbol),
      ),
    [marketOverviewData, currentSymbol, symbol],
  );

  const debouncedKlFilter = useDebounce(klFilter, 300)[0];

  const { data, isLoading } = useLichSuGiaoDich(currentSymbol);

  // const filteredData = useMemo(() => {
  //   if (!data) return [];
  //   return (
  //     data.data
  //       ?.filter((item: any) => item.volume > (debouncedKlFilter || 0))
  //       .sort((a: any, b: any) =>
  //         new Date(a.date) > new Date(b.date) ? -1 : 1,
  //       )
  //       .slice(0, 20) || []
  //   );
  // }, [data, debouncedKlFilter]);

  return (
    <div className="flex h-full w-full min-w-[200px] flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="text-muted grid grid-cols-4 py-2 text-xs font-semibold">
          <div>Giá</div>
          <div className="flex items-center gap-1 text-nowrap">
            Khối lượng{" "}
            <Popover
              placement="bottom"
              isOpen={isOpen}
              onOpenChange={(open) => setIsOpen(open)}
            >
              <PopoverTrigger>
                <button className="hover:text-foreground outline-hidden">
                  <Filter />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Khối lượng tối thiểu > 0"
                    type="number"
                    value={klFilter?.toString()}
                    onValueChange={(value) => {
                      try {
                        const num = parseInt(value);
                        if (num > 0) {
                          setKlFilter(num);
                        } else {
                          setKlFilter(0);
                        }
                      } catch (e) {
                        setKlFilter(null);
                      }
                    }}
                    className="outer-"
                  />
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 text-sm font-medium"
                      size="sm"
                      color="default"
                      onClick={() => setKlFilter(0)}
                    >
                      Đặt lại
                    </Button>
                    <Button
                      className="flex-1 text-sm font-medium"
                      size="sm"
                      color="secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Xác nhận
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="text-center">Lệnh</div>
          <div className="text-end">Thời gian</div>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1">
            {isLoading ? (
              <div className="text-muted flex h-20 items-center justify-center text-sm">
                <Spinner />
              </div>
            ) : data?.length ? (
              data.map((item: ILichSuGiaoDich, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "grid grid-cols-4 py-1 text-sm font-semibold",
                    item.Side === "B"
                      ? "animate-changeBackgroundGreen"
                      : "animate-changeBackgroundRed",
                  )}
                >
                  <div
                    className={cn(
                      symbolData?.referPrice
                        ? item.Price > symbolData?.referPrice
                          ? "text-green"
                          : item.Price < symbolData.referPrice
                            ? "text-red"
                            : "text-yellow"
                        : "text-yellow",
                      item.Price === symbolData?.ceiling && "text-ceiling",
                      item.Price === symbolData?.floor && "text-floor",
                    )}
                  >
                    {formatPrice(item.Price)}
                  </div>
                  <div>{(+item.Volume).toLocaleString()}</div>
                  <div
                    className={cn(
                      "text-center",
                      item.Side === "B" ? "text-green" : "text-red",
                    )}
                  >
                    {item.Side === "B" ? "Mua" : "Bán"}
                  </div>
                  <div className="text-end">
                    {format(new Date(item.Date), "HH:mm:ss")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted flex h-20 items-center justify-center text-sm">
                Không có dữ liệu
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default MarketHistory;
