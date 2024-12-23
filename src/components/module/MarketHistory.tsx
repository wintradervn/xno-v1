import { cn, formatPrice, getPriceColorFromOverviewData } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react";
import Filter from "@/icons/Filter";
import Popover from "../ui/Popover";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useDebounce } from "use-debounce";
import useMarketOverviewData from "@/hooks/useMarketOverview";

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

  const { data, isLoading } = useSWR(
    ["marketHistory", symbol || currentSymbol],
    () => {
      return fetch(`/api/marketHistory?symbol=${symbol || currentSymbol}`).then(
        (res) => res.json(),
      );
    },
    {
      refreshInterval: 3_000,
    },
  );

  const isControlled = !!symbol;

  const filteredData = useMemo(() => {
    if (!data) return [];
    return (
      data.data
        ?.filter((item: any) => item.volume > (debouncedKlFilter || 0))
        .sort((a: any, b: any) =>
          new Date(a.date) > new Date(b.date) ? -1 : 1,
        )
        .slice(0, 20) || []
    );
  }, [data, debouncedKlFilter]);

  return (
    <div className="flex h-full w-full min-w-[200px] flex-col">
      {!isControlled && (
        <div className="border-lineargreen text-lineargreen w-fit border-b-2 px-2 py-2 text-sm font-semibold">
          Lịch sử giao dịch
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="grid grid-cols-4 py-2 text-xs font-semibold text-muted">
          <div>Giá</div>
          <div className="flex items-center gap-1 text-nowrap">
            Khối lượng{" "}
            <Popover
              placement="bottom"
              isOpen={isOpen}
              onOpenChange={(open) => setIsOpen(open)}
            >
              <PopoverTrigger>
                <button className="outline-none hover:text-white">
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
              <div className="flex h-20 items-center justify-center text-sm text-muted">
                <Spinner />
              </div>
            ) : filteredData?.length ? (
              filteredData.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className={cn(
                    "grid grid-cols-4 py-1 text-sm font-semibold",
                    item.side === "B"
                      ? "animate-changeBackgroundGreen"
                      : "animate-changeBackgroundRed",
                  )}
                >
                  <div
                    className={cn(
                      symbolData?.referPrice
                        ? item.price > symbolData?.referPrice
                          ? "text-green"
                          : item.price < symbolData.referPrice
                            ? "text-red"
                            : "text-yellow"
                        : "text-yellow",
                      item.price === symbolData?.ceiling && "text-purple",
                      item.price === symbolData?.floor && "text-cyan",
                    )}
                  >
                    {formatPrice(item.price)}
                  </div>
                  <div>{(+item.volume).toLocaleString()}</div>
                  <div
                    className={cn(
                      "text-center",
                      item.side === "B" ? "text-green" : "text-red",
                    )}
                  >
                    {item.side === "B" ? "Mua" : "Bán"}
                  </div>
                  <div className="text-end">
                    {format(new Date(item.date), "HH:mm:ss")}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-20 items-center justify-center text-sm text-muted">
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
