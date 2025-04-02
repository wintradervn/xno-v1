import MuaBanChuDongPieChart from "@/components/charts/MuaBanChuDongPieChart";
import NNMuaRong10PhienBarChart from "@/components/charts/NNMuaRong10PhienBarChart";
import NNYTDStockBarChart from "@/components/charts/NNYTDStockBarChart";
import Tabs from "@/components/ui/Tabs";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useMuaBanChuDong from "@/hooks/api-v2/useMuaBanChuDong";
import useYTDStockData from "@/hooks/useYTDStockData";
import {
  cn,
  formatNumber,
  formatPrice,
  formatVeryLargeNumber,
} from "@/lib/utils";
import { Tab, Tooltip } from "@heroui/react";
import { useMemo, useState } from "react";
import MuaBanChuDongBarChart from "@/components/charts/MuaBanChuDongBarChart";
import useFilterProData from "@/hooks/useFilterProData";
import { MAU_HINH_PATTERN } from "../loc-co-phieu/constant";
import { InfoCircle } from "solar-icon-set";

export default function SubTabTongQuan() {
  const { symbol } = useChiTietMaCK();
  const { data } = useMarketOverviewData();
  const { data: muabanchudong } = useMuaBanChuDong(symbol);
  const { data: filterProData } = useFilterProData();
  const filterProDataSymbol = useMemo(() => {
    return filterProData?.find((item) => item.MA === symbol);
  }, [filterProData, symbol]);

  //Preload data
  useYTDStockData(symbol);

  const [selectedTab, setSelectedTab] = useState("10phien");

  const symbolData = useMemo(
    () => data?.find((item) => item.code === symbol),
    [data, symbol],
  );

  const muaBanChuDongStats = useMemo(() => {
    if (!muabanchudong) return {};
    const data = muabanchudong[0];
    if (!data) return {};

    return {
      mua: data.Buy,
      ban: data.Sell,
      muaPercent: data.Buy / data.Sum,
      banPercent: data.Sell / data.Sum,
    };
  }, [muabanchudong]);

  return (
    <div className="no-scrollbar flex h-full flex-col gap-3 overflow-y-auto pt-2 text-sm">
      <div className="shrink-0">
        <div className="mb-4 font-semibold">Tổng quan</div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="text-muted">Tham chiếu - Mở cửa</div>
            <div className="text-green font-bold">
              <span className="text-yellow">
                {formatPrice(symbolData?.referPrice)}
              </span>{" "}
              - {formatPrice(symbolData?.openPrice)}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-muted">Cao nhất - Thấp nhất</div>
            <div
              className={cn(
                "text-green font-bold",
                symbolData?.highPrice === symbolData?.ceiling
                  ? "text-ceiling"
                  : "",
              )}
            >
              {formatPrice(symbolData?.highPrice)} -{" "}
              <span
                className={cn(
                  "text-red",
                  symbolData?.lowPrice === symbolData?.floor
                    ? "text-floor"
                    : "",
                )}
              >
                {formatPrice(symbolData?.lowPrice)}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-muted">P/E</div>
            <div className="font-bold">{symbolData?.pe?.toFixed(2)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-muted">P/B</div>
            <div className="font-bold">{symbolData?.pb?.toFixed(2)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-muted">Vốn hóa</div>
            <div className="font-bold">
              {formatVeryLargeNumber(symbolData?.marketCap)}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-muted">
              Tỷ lệ cổ phiếu cô đặc{" "}
              <Tooltip
                content={
                  "Số cổ phiếu có tỷ lệ nắm giữ phần lớn thuộc các cổ đông nội bộ hay cổ đông chiến lược."
                }
                placement="top"
                className="max-w-[200px]"
              >
                <InfoCircle size={16} iconStyle="Broken" />
              </Tooltip>
            </div>
            <div className="font-bold">500 triệu cp (23%)</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted">AI Trend</div>
            {filterProDataSymbol?.AiTrend === "Uptrend" ? (
              <div className="badge-green">Uptrend</div>
            ) : filterProDataSymbol?.AiTrend === "Downtrend" ? (
              <div className="badge-red">Downtrend</div>
            ) : (
              <div className="badge-yellow">Sideway</div>
            )}
          </div>
          <div className="flex justify-between">
            <div className="text-muted">Mẫu hình kỹ thuật</div>
            {filterProDataSymbol?.pattern && (
              <div className="flex flex-col items-end gap-1">
                <div className="font-bold">{filterProDataSymbol.pattern}</div>
                <div className="text-muted/70 text-xs">
                  (
                  {
                    MAU_HINH_PATTERN.find((item) =>
                      item.includes.some(
                        (p) => p === filterProDataSymbol.pattern,
                      ),
                    )?.label
                  }
                  )
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex min-h-[180px] shrink-0 flex-col justify-center py-3">
        <div className="mb-2 font-semibold">Mua bán chủ động</div>
        <div className="flex flex-1 items-center gap-2">
          <MuaBanChuDongBarChart symbol={symbol} />
        </div>
      </div>
      <div className="flex min-h-[220px] flex-1 flex-col">
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-semibold">NN mua ròng (tỷ)</div>
          <Tabs
            classNames={{
              tabList: "flex-1 bg-content1 p-1 rounded-[4px]",
              cursor: "bg-background! rounded-[4px]",
              tab: "text-sm py-0 h-6",
              panel: "h-full flex flex-col overflow-hidden",
            }}
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Tab key="10phien" title="10 phiên"></Tab>
            <Tab key="1nam" title="1 năm"></Tab>
          </Tabs>
        </div>
        {selectedTab === "10phien" ? (
          <NNMuaRong10PhienBarChart symbol={symbol} />
        ) : (
          <NNYTDStockBarChart symbol={symbol} />
        )}
      </div>
    </div>
  );
}
