import MuaBanChuDongPieChart from "@/components/charts/MuaBanChuDongPieChart";
import NNMuaRong10PhienBarChart from "@/components/charts/NNMuaRong10PhienBarChart";
import NNYTDStockBarChart from "@/components/charts/NNYTDStockBarChart";
import Tabs from "@/components/ui/Tabs";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useMuaBanChuDong from "@/hooks/useMuaBanChuDong";
import useYTDStockData from "@/hooks/useYTDStockData";
import { formatNumber, formatPrice, formatVeryLargeNumber } from "@/lib/utils";
import { Tab } from "@nextui-org/react";
import { useMemo, useState } from "react";

export default function SubTabTongQuan() {
  const { symbol } = useChiTietMaCK();
  const { data } = useMarketOverviewData();
  const { data: muabanchudong } = useMuaBanChuDong(symbol);

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
      <div className="flex-shrink-0">
        <div className="mb-4 font-semibold">Tổng quan</div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="text-muted">Tham chiếu - Mở cửa</div>
            <div className="font-bold text-green">
              <span className="text-yellow">
                {formatPrice(symbolData?.referPrice)}
              </span>{" "}
              - {formatPrice(symbolData?.openPrice)}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-muted">Cao nhất - Thấp nhất</div>
            <div className="font-bold text-green">
              {formatPrice(symbolData?.highPrice)} -{" "}
              <span className="text-red">
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
        </div>
      </div>
      <div className="flex min-h-[180px] flex-col justify-center">
        <div className="mb-2 font-semibold">Mua bán chủ động</div>
        <div className="flex flex-1 items-center gap-2">
          <MuaBanChuDongPieChart
            mua={muaBanChuDongStats.mua || 0}
            ban={muaBanChuDongStats.ban || 0}
          />
          <div className="flex w-[56%] flex-col gap-10 text-nowrap text-sm font-medium">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rotate-45 bg-red"></div>{" "}
              <div className="text-muted">KL Bán:</div>{" "}
              <div className="text-red">
                {formatNumber(muaBanChuDongStats.ban)} (
                {muaBanChuDongStats.banPercent
                  ? (muaBanChuDongStats.banPercent * 100).toFixed(0)
                  : "-"}
                %)
              </div>
            </div>
            <div className="flex items-center gap-3 text-nowrap text-sm">
              <div className="h-2 w-2 rotate-45 bg-green"></div>{" "}
              <div className="text-muted">KL Mua:</div>{" "}
              <div className="text-green">
                {formatNumber(muaBanChuDongStats.mua)} (
                {muaBanChuDongStats.muaPercent
                  ? (muaBanChuDongStats.muaPercent * 100).toFixed(0)
                  : "-"}
                %)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-h-[220px] flex-1 flex-col">
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-semibold">NN mua ròng (tỷ)</div>
          <Tabs
            classNames={{
              tabList: "flex-1 bg-content1 p-1 rounded-[4px]",
              cursor: "!bg-background rounded-[4px]",
              tab: "text-sm py-0 h-6",
              panel: "h-full flex flex-col overflow-hidden",
            }}
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Tab key="10phien" title="10 phiên"></Tab>
            <Tab key="ytd" title="YTD"></Tab>
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
