import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import { useMemo } from "react";
import useChiSoIndex from "@/hooks/useChiSoIndex";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

export default function TacDongToiIndexBarChart() {
  const { data } = useMarketOverviewData();
  const { data: chiSoIndex } = useChiSoIndex();

  const VNIndexChange = useMemo(() => {
    if (!chiSoIndex) return 0.01;
    const { OHLCVT } = chiSoIndex.find((item: any) => item.index === "VNIndex");
    if (!OHLCVT?.length) return 0.01;
    const change = OHLCVT[0][3] - OHLCVT[OHLCVT.length - 1][0];
    return change || 0.01;
  }, [chiSoIndex]);

  const compiledData = useMemo(() => {
    if (!chiSoIndex) return [];
    const top50Data: any = data
      ?.filter(
        (item) =>
          !!item.dayValue &&
          !!item.sectors?.length &&
          !!item.indexes?.includes("VNIndex"),
      )
      .map((item) => ({
        name: item.code,
        change: item.dayChangePercent || 0,
        value:
          item.dayChangePercent && item.marketCap
            ? (item.dayChangePercent * item.marketCap) / 100_000_000_000
            : 0,
      }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 50);

    const top20Data = [
      ...top50Data.sort((a: any, b: any) => b.value - a.value).slice(0, 10),
      ...top50Data
        .sort((a: any, b: any) => b.value - a.value)
        .slice(top50Data.length - 10, top50Data.length),
    ];
    const netBuy =
      top20Data.reduce((acc: number, item: any) => item.value + acc, 0) * 1.5;
    const netBuyPerIndex = VNIndexChange ? Math.abs(netBuy / VNIndexChange) : 0;

    return top20Data.map((item) => ({
      ...item,
      value: item.value / netBuyPerIndex,
      itemStyle: {
        color: item.value > 0 ? "#1DF81F" : "#FF135B",
        borderRadius: [5, 5, 5, 5],
      },
    }));
  }, [data, VNIndexChange, chiSoIndex]);

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          tooltip: {
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[12px] flex flex-col gap-[1px] text-white">${params[0].name}<br/><div>Giá trị: <span class="font-bold text-${params[0].value > 0 ? "green" : "red"}">${params[0].value.toFixed(3)}</span></div></div>`;
            },
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: 10,
            },
          },
          grid: {
            top: "40px", // Remove top padding
            bottom: "40px", // Remove bottom padding
            left: "30px", // Optional: Adjust left padding
            right: "20px", // Optional: Adjust right padding
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            data: compiledData.map((item) => item.name),
            axisLabel: {
              color: "#98A2B3",
              fontSize: 12,
              interval: 0,
            },
            axisTick: { show: false },
            splitLine: { show: false },
          },
          yAxis: {
            type: "value", // Set y-axis to value type
            splitLine: {
              lineStyle: {
                color: "#1D2939",
              },
            },
            axisLabel: {
              color: "#98A2B3",
              fontSize: 12,
            },
          },
          series: [
            {
              type: "bar",
              legend: { show: false },
              barCategoryGap: "50%",
              data: compiledData,
              label: {
                show: true,
                position: "top",
                color: "#98A2B3",
                fontSize: 12,
                lineHeight: 18,
                formatter: function (params: any) {
                  return `${params.value.toFixed(2)}`;
                },
              },
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}