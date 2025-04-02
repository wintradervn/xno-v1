import IndexLineChart from "@/components/charts/IndexLineChart";
import useIndexOverview from "@/hooks/useIndexOverview";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatNumber } from "@/lib/utils";
import { useMemo } from "react";

export default function IndexMiniChart({
  symbol = "VNINDEX",
  showChart,
  topThrehold = 6,
}: {
  symbol?: string;
  showChart?: boolean;
  topThrehold?: number;
}) {
  const { data } = useIndexOverview();
  const { data: marketOverviewData } = useMarketOverviewData();
  const indexData = useMemo(
    () => data?.find((item) => item.code === symbol),
    [data],
  );
  const symbolTangGiamData = useMemo(() => {
    if (!marketOverviewData || !indexData) return null;
    const filteredData = marketOverviewData?.filter(
      (item) =>
        item.indexes?.includes(indexData.oldCode) && item.secType === "S",
    );

    return {
      tang:
        filteredData?.filter((item) => item.dayChange && item.dayChange > 0)
          .length || 0,
      topTang:
        filteredData?.filter(
          (item) =>
            item.dayChangePercent && item.dayChangePercent > topThrehold,
        ).length || 0,
      giam:
        filteredData?.filter((item) => item.dayChange && item.dayChange < 0)
          .length || 0,
      topGiam:
        filteredData?.filter(
          (item) =>
            item.dayChangePercent && item.dayChangePercent < -topThrehold,
        ).length || 0,
      khongdoi:
        filteredData?.filter((item) => item.dayChange === 0).length || 0,
    };
  }, [marketOverviewData, indexData]);

  return (
    <div className="card relative flex flex-1 flex-col gap-1 text-sm font-semibold">
      <div className="flex w-full shrink-0 items-center justify-between">
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
      <div className="flex w-full shrink-0 items-center justify-between gap-1">
        <div className="flex gap-2 text-[8px] sm:text-xs">
          <div className="text-green flex items-center gap-2">
            {symbolTangGiamData ? (
              <>
                <div className="flex items-center gap-1">
                  <DoubleArrow /> {symbolTangGiamData.tang}{" "}
                  <span className="text-ceiling">{`(${symbolTangGiamData.topTang})`}</span>
                </div>
                <div className="text-yellow flex items-center gap-1">
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
                <div className="text-red flex items-center gap-1">
                  <DoubleArrow rotate={180} /> {symbolTangGiamData.giam}{" "}
                  <span className="text-floor">{`(${symbolTangGiamData.topGiam})`}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-normal text-nowrap sm:text-xs">
          <div className="text-muted flex items-center gap-2">
            KL{" "}
            <div className="text-foreground min-w-[20px] text-center">
              {indexData
                ? formatNumber(indexData?.dayVolume / 1000000) + " tr"
                : "-"}
            </div>
          </div>
          <div className="text-muted flex items-center gap-2">
            GT{" "}
            <div className="text-foreground min-w-[20px] text-center">
              {indexData
                ? formatNumber(indexData?.dayValue / 1000000000) + " tỷ"
                : "-"}
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "transition-all",
          showChart ? "opacity-100" : "opacity-0",
        )}
      >
        <IndexLineChart
          symbol={indexData?.oldCode}
          referPrice={indexData?.referPrice}
        />
      </div>
    </div>
  );
}
