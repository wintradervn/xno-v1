import BienDongTreeChart from "@/components/charts/BienDongTreeChart";
import PhanBoDongTienBarChart from "@/components/charts/PhanBoDongTienBarChart";
import useIndexOverview from "@/hooks/useIndexOverview";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useTuDoanhData from "@/hooks/useTuDoanhData";
import { cn, formatVeryLargeNumber } from "@/lib/utils";
import { Tooltip } from "@heroui/react";
import { useMemo } from "react";
import { DangerCircle } from "solar-icon-set";

const IndexMap: Record<string, string> = {
  HOSE: "VNINDEX",
  HNX: "HNX",
  UPCOM: "UPCOM",
};

export default function SubTabBienDong({
  exchange,
  onLabelClick,
}: {
  exchange?: string;
  onLabelClick?: () => void;
}) {
  const { data, isLoading } = useMarketOverviewData();
  const { data: indexesData } = useIndexOverview();
  const { data: tudoanhData } = useTuDoanhData();

  const filteredData = useMemo(
    () =>
      data?.filter(
        (item) =>
          (exchange ? item.exchange === exchange : true) &&
          item.secType === "S",
      ),
    [data, exchange],
  );

  const indexData = useMemo(
    () =>
      indexesData?.find((item) =>
        exchange && IndexMap[exchange]
          ? item.code === IndexMap[exchange]
          : false,
      ),
    [indexesData, exchange],
  );

  const groupedData = useMemo(() => {
    const grouped: any = { tang: 0, giam: 0, khongdoi: 0 };
    if (!filteredData) return grouped;
    for (let i = 0; i < filteredData.length; i++) {
      const item = filteredData[i];
      if (item.dayChange !== null) {
        if (item.dayChange > 0) {
          grouped.tang += 1;
        }
        if (item.dayChange < 0) {
          grouped.giam += 1;
        }
        if (item.dayChange === 0) {
          grouped.khongdoi += 1;
        }
      }
    }
    return grouped;
  }, [filteredData]);

  const tudoanhVNIndexNetBuy = useMemo(() => {
    if (!tudoanhData) return 0;
    let res = 0;
    tudoanhData.forEach((item) => {
      res += item.netProprietaryValue;
    });
    return res;
  }, [tudoanhData]);

  return (
    <div className="flex h-full min-h-[500px] flex-col gap-3 sm:flex-row sm:gap-8">
      <div className="z-0 flex flex-1 flex-col">
        <BienDongTreeChart data={filteredData} onLabelClick={onLabelClick} />
      </div>
      <div className="bg-card z-1 flex min-h-0 flex-col text-sm sm:w-5/12 sm:max-w-[500px] sm:gap-5">
        <div>
          <div className="mb-4 font-semibold">Tổng quan</div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="text-muted">Tham chiếu - Mở cửa</div>
              <div className="font-bold">
                <span className="text-yellow">{indexData?.referPrice}</span> -{" "}
                <span className="text-green">{indexData?.openPrice}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted">Cao nhất - Thấp nhất</div>
              <div className="font-bold">
                <span className="text-green">{indexData?.highPrice}</span> -{" "}
                <span className="text-red">{indexData?.lowPrice}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted">Khối lượng - GTGD</div>
              <div className="font-bold">
                {formatVeryLargeNumber(indexData?.dayVolume)} -{" "}
                {formatVeryLargeNumber(indexData?.dayValue)}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted">Giá trị NN mua ròng</div>
              <div
                className={cn(
                  "font-bold",
                  indexData
                    ? indexData.foreignBuyVal - indexData.foreignSellVal > 0
                      ? "text-green"
                      : indexData.foreignBuyVal - indexData.foreignSellVal < 0
                        ? "text-red"
                        : "text-yellow"
                    : "text-white",
                )}
              >
                {indexData
                  ? formatVeryLargeNumber(
                      indexData.foreignBuyVal - indexData.foreignSellVal,
                    )
                  : "-"}
              </div>
            </div>
            {exchange === "HOSE" ? (
              <div className="flex h-5 justify-between">
                <div className="text-muted flex items-center gap-1">
                  Giá trị tự doanh mua ròng{" "}
                  <Tooltip content="Dữ liệu được cập nhật cuối ngày" showArrow>
                    <DangerCircle iconStyle="Broken" size={12} />
                  </Tooltip>
                </div>
                <div
                  className={cn(
                    "font-bold",
                    tudoanhVNIndexNetBuy > 0
                      ? "text-green"
                      : tudoanhVNIndexNetBuy < 0
                        ? "text-red"
                        : "text-yellow",
                  )}
                >
                  {formatVeryLargeNumber(tudoanhVNIndexNetBuy)}
                </div>
              </div>
            ) : (
              <div className="h-5"></div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="mb-3 font-semibold">Phân bổ dòng tiền</div>
          <PhanBoDongTienBarChart data={filteredData} />
          <div className="flex justify-between pr-[11%] pl-[17%]">
            <div className="flex w-[60px] flex-col items-center gap-0.5">
              <div className="text-muted">Tăng giá</div>
              <div className="text-green font-bold">
                {groupedData.tang + " CP"}
              </div>
            </div>
            <div className="flex w-[60px] flex-col items-center gap-0.5">
              <div className="text-muted">Giảm giá</div>
              <div className="text-red font-bold">
                {groupedData.giam + " CP"}
              </div>
            </div>
            <div className="flex w-[60px] flex-col items-center gap-0.5">
              <div className="text-muted">Không đổi</div>
              <div className="text-yellow font-bold">
                {groupedData.khongdoi + " CP"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
