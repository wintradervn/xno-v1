"use client";

import { ClipboardCheck, Export } from "solar-icon-set";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import { useMemo } from "react";
import FavoriteStarButton from "@/components/FavoriteStarButton";
import {
  cn,
  formatNumber,
  formatPrice,
  formatVeryLargeNumber,
  getPriceColorFromOverviewData,
} from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import DefaultLoader from "@/components/ui/DefaultLoader";

export default function KetQuaLoc() {
  const { data, isLoading } = useMarketOverviewData();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return [
      ...data.filter((item) => {
        return item.secType === "S";
      }),
    ].sort((a, b) => a.code.localeCompare(b.code));
  }, [data]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div className="card flex w-fit items-center gap-1 rounded-b-none px-4 text-md font-medium text-white">
          <ClipboardCheck size={20} />
          Kết quả lọc{" "}
          <span className="text-linearpurple font-semibold">(120)</span>
        </div>
      </div>
      <div className="card flex h-full flex-1 flex-col gap-2 rounded-tl-none p-3">
        <div
          className="grid flex-shrink-0 py-2 text-sm text-muted"
          style={{ gridTemplateColumns: "2fr 2fr 2fr 2fr 2fr 2fr 2fr" }}
        >
          <div>Mã CK</div>
          <div>Sàn</div>
          <div className="text-end">Giá</div>
          <div className="text-end">P/E</div>
          <div className="text-end">Giá trị giao dịch ròng</div>
          <div className="text-end">Vốn hóa</div>
          <div className="text-end">Biên độ đóng cửa (5 phiên)</div>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <DefaultLoader />
            ) : (
              filteredData?.slice(0, 20).map((item: TSymbolOverviewData) => (
                <div
                  className="grid items-center py-2 text-sm hover:bg-content1"
                  style={{
                    gridTemplateColumns: "2fr 2fr 2fr 2fr 2fr 2fr 2fr",
                  }}
                  key={item.code}
                >
                  <div className="flex w-fit items-center gap-1">
                    <div className="h-4 w-4 flex-shrink-0 overflow-hidden rounded-full bg-white">
                      <img
                        src={`https://finance.vietstock.vn/image/${item.code}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="font-semibold">{item.code}</div>
                    <div className="flex-shrink-0">
                      <FavoriteStarButton symbol={item.code} size={14} />
                    </div>
                  </div>
                  <div>{item.exchange}</div>
                  <div
                    className={cn(
                      "flex items-center justify-end font-semibold text-green",
                      getPriceColorFromOverviewData(item),
                    )}
                  >
                    {formatPrice(item.price)}
                  </div>
                  <div className="text-end">{formatNumber(item.pe, 2)}</div>
                  <div className="text-end">
                    {formatNumber(item.dayValue, 2)}
                  </div>
                  <div className="text-end">
                    {formatVeryLargeNumber(item.marketCap)}
                  </div>
                  <div className="text-end">{140.415}</div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
