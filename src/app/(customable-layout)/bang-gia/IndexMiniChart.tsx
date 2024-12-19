import IndexLineChart from "@/components/charts/IndexLineChart";
import useIndexOverview from "@/hooks/useIndexOverview";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatNumber, formatVeryLargeNumber } from "@/lib/utils";
import { Dot } from "lucide-react";
import { useMemo } from "react";

export default function IndexMiniChart({
  symbol = "VNINDEX",
}: {
  symbol?: string;
}) {
  const { data } = useIndexOverview();
  const { data: marketOverviewData } = useMarketOverviewData();
  const indexData = useMemo(
    () => data?.find((item) => item.code === symbol),
    [data],
  );
  const symbolTangGiamData = useMemo(() => {
    if (!marketOverviewData || !indexData) return null;
    const filteredData = marketOverviewData?.filter((item) =>
      item.indexes?.includes(indexData.oldCode),
    );

    return {
      tang:
        filteredData?.filter(
          (item) =>
            item.dayChange &&
            item.dayChange > 0 &&
            item.dayVolume &&
            item.dayVolume > 0,
        ).length || 0,
      giam:
        filteredData?.filter(
          (item) =>
            item.dayChange &&
            item.dayChange < 0 &&
            item.dayVolume &&
            item.dayVolume > 0,
        ).length || 0,
      khongdoi:
        filteredData?.filter(
          (item) =>
            item.dayChange !== null &&
            item.dayChange === 0 &&
            item.dayVolume &&
            item.dayVolume > 0,
        ).length || 0,
    };
  }, [marketOverviewData, indexData]);

  return (
    <div className="card relative flex flex-1 flex-col gap-1 text-sm font-semibold">
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-2">
          <div>{indexData?.code}</div>-
          <div
            className={
              indexData?.dayChange
                ? indexData.dayChange > 0
                  ? "text-green"
                  : "text-red"
                : "text-yellow"
            }
          >
            {indexData?.price}
          </div>
        </div>
        <div
          className={cn(
            "flex gap-2",
            indexData?.dayChange
              ? indexData.dayChange > 0
                ? "text-green"
                : "text-red"
              : "text-yellow",
          )}
        >
          <div>{formatNumber(indexData?.dayChange, 2)}</div> /
          <div>
            {indexData?.dayChangePercent
              ? formatNumber(indexData?.dayChangePercent, 2) + "%"
              : "-"}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-2 text-green">
            {symbolTangGiamData ? (
              <>
                <div className="flex items-center gap-1">
                  <DoubleArrow /> {symbolTangGiamData.tang}
                </div>
                <div className="flex items-center gap-1 text-yellow">
                  <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                    <rect
                      x="3.14062"
                      y="3"
                      width="7"
                      height="7"
                      rx="3.5"
                      fill="#F1C617"
                    />
                  </svg>
                  {symbolTangGiamData.khongdoi}
                </div>
                <div className="flex items-center gap-1 text-red">
                  <DoubleArrow rotate={180} /> {symbolTangGiamData.giam}
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-normal">
          <div className="flex items-center gap-2 text-muted">
            KL{" "}
            <div className="min-w-[20px] text-center text-white">
              {indexData
                ? formatNumber(indexData?.dayVolume / 1000000) + " tr"
                : "-"}
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted">
            GT{" "}
            <div className="min-w-[20px] text-center text-white">
              {indexData
                ? formatNumber(indexData?.dayValue / 1000000000) + " tỷ"
                : "-"}
            </div>
          </div>
        </div>
      </div>
      <IndexLineChart symbol={indexData?.oldCode} />
    </div>
  );
}
