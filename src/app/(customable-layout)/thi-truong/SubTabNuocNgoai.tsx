import NNMuaRong10PhienBarChart from "@/components/charts/NNMuaRong10PhienBarChart";
import NNYTDBarChart from "@/components/charts/NNYTDBarChart";
import NuocNgoaiTreeChart from "@/components/charts/NuocNgoaiTreeChart";
import Tabs from "@/components/ui/Tabs";
import useIndexOverview from "@/hooks/useIndexOverview";
import useNuocNgoaiData from "@/hooks/useNuocNgoaiData";
import { mapExchangeToIndex } from "@/lib/constant";
import { cn, formatNumber, formatVeryLargeNumber } from "@/lib/utils";
import { Tab } from "@nextui-org/react";
import { useMemo, useState } from "react";

export default function SubTabNuocNgoai({ exchange }: { exchange?: string }) {
  const [selectedTab, setSelectedTab] = useState("10phien");
  const { data } = useNuocNgoaiData();
  const { data: indexOverviewData } = useIndexOverview();
  const indexData = useMemo(() => {
    return indexOverviewData?.find(
      (item) => exchange && item.code === mapExchangeToIndex[exchange],
    );
  }, [indexOverviewData, exchange]);

  const filteredData = useMemo(
    () =>
      data?.filter((item) => (exchange ? item.exchange === exchange : true)),
    [data, exchange],
  );

  const tongLuongGiaoDichStats = useMemo(() => {
    const mua = filteredData?.reduce((acc, curr) => acc + curr.dayBuyVol, 0);
    const ban = filteredData?.reduce((acc, curr) => acc + curr.daySellVol, 0);
    const muaVal = filteredData?.reduce((acc, curr) => acc + curr.dayBuyVal, 0);
    const banVal = filteredData?.reduce(
      (acc, curr) => acc + curr.daySellVal,
      0,
    );
    return {
      mua,
      ban,
      muaVal,
      banVal,
      muaBan: mua && ban ? mua - ban : 0,
      muaBanVal: muaVal && banVal ? muaVal - banVal : 0,
    };
  }, [filteredData]);

  return (
    <div className="flex h-full min-h-[500px] gap-8">
      <div className="z-0 flex flex-1 flex-col">
        <NuocNgoaiTreeChart data={filteredData} />
      </div>
      <div className="z-1 flex min-h-0 w-5/12 max-w-[500px] flex-col gap-5 bg-card text-sm">
        <div>
          <div className="mb-3 font-semibold">
            <div>Giao dịch khối ngoại</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3">
              <div></div>
              <div>Khối lượng</div>
              <div>Giá trị giao dịch</div>
            </div>
            <div className="grid grid-cols-3 px-1 py-2">
              <div className="text-muted">Mua</div>
              <div className="font-bold text-green">
                {formatNumber(indexData?.foreignBuyVol)}
              </div>
              <div className="font-bold text-green">
                {formatVeryLargeNumber(indexData?.foreignBuyVal)}
              </div>
            </div>
            <div className="grid grid-cols-3 px-1 py-2">
              <div className="text-muted">Bán</div>
              <div className="font-bold text-red">
                {formatNumber(indexData?.foreignSellVol)}
              </div>
              <div className="font-bold text-red">
                {formatVeryLargeNumber(indexData?.foreignSellVal)}
              </div>
            </div>
            <div className="grid grid-cols-3 px-1 py-2">
              <div className="text-muted">Mua - Bán</div>
              <div
                className={cn(
                  "font-bold",
                  tongLuongGiaoDichStats.muaBan > 0
                    ? "text-green"
                    : tongLuongGiaoDichStats.muaBan < 0
                      ? "text-red"
                      : "text-white",
                )}
              >
                {formatNumber(
                  (indexData?.foreignBuyVol || 0) -
                    (indexData?.foreignSellVol || 0),
                )}
              </div>
              <div
                className={cn(
                  "font-bold",
                  tongLuongGiaoDichStats.muaBanVal > 0
                    ? "text-green"
                    : tongLuongGiaoDichStats.muaBanVal < 0
                      ? "text-red"
                      : "text-white",
                )}
              >
                {formatVeryLargeNumber(
                  (indexData?.foreignBuyVal || 0) -
                    (indexData?.foreignSellVal || 0),
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
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
            <NNMuaRong10PhienBarChart symbol={exchange} />
          ) : (
            <NNYTDBarChart symbol={exchange} />
          )}
        </div>
      </div>
    </div>
  );
}
