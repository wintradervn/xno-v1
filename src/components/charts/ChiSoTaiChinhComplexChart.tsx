import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useKetQuaKinhDoanhData from "@/hooks/useKetQuaKinhDoanhData";
import { useMemo } from "react";
import { formatNumber } from "@/lib/utils";
import useCanDoiKeToanData from "@/hooks/useCanDoiKeToanData";
import useChiSoTaiChinhData from "@/hooks/useChiSoTaiChinhData";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

export default function ChiSoTaiChinhComplexChart({
  yearly,
  chartConfig,
}: {
  yearly: boolean;
  chartConfig: any;
}) {
  const { symbol } = useChiTietMaCK();
  const { data } = useKetQuaKinhDoanhData(symbol, yearly);
  const { data: data2 } = useCanDoiKeToanData(symbol, yearly);
  const { data: data3 } = useChiSoTaiChinhData(symbol, yearly);

  const selectedData = useMemo(() => {
    let selectedData: any = data;
    if (["phantichnguonvon", "phantichtaisan"].includes(chartConfig.key)) {
      selectedData = data2;
    }
    if (["chisodinhgia", "khanangthanhtoan"].includes(chartConfig.key)) {
      selectedData = data3;
    }

    return selectedData?.slice(yearly ? -10 : -16);
  }, [data, data2, data3, chartConfig]);

  const series = useMemo(() => {
    if (!selectedData) return [];

    const config: any = chartConfig.children;

    const sortedData = selectedData
      .sort((a: any, b: any) =>
        a.year !== b.year ? a.year - b.year : a.quarter - b.quarter,
      )
      .slice(yearly ? -10 : -16);

    return config.map((configItem: any) => {
      return {
        data: sortedData.map(
          configItem.getData ||
            ((item: any) => ({ value: item[configItem.key] })),
        ),
        type: configItem.type,
        name: configItem.name,
        stack: configItem.stack || "",
        yAxisIndex: configItem.type === "line" ? 1 : 0,
        smooth: true,
        tooltip: {
          valueFormatter: (value: any) =>
            configItem.formatLabel
              ? configItem.formatLabel(value)
              : formatNumber(value),
        },
      };
    });
  }, [selectedData, chartConfig]);

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          animation: false,
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          tooltip: {
            trigger: "axis",
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontSize: 12,
              color: "white",
            },
            // formatter: function (params: any) {
            //   return `<div class="flex flex-col gap-1">
            // <div class="text-[12px] flex flex-col gap-[1px] !text-white">${params[0].name}</div>
            // ${params.map((item: any) => `<div class="flex items-center gap-1"><span>${item.marker}</span><span class="!text-muted">${item.seriesName}:</span> <span class="!text-white">${configItem.formatLabel ? configItem.formatLabel(item.value) : formatNumber(item.value)}</span></div>`)}
            // </div>`;
            // },
          },
          legend: {
            width: 630,
            align: "auto",
            itemWidth: 18,
            itemHeight: 12,
            itemGap: 16,
            textStyle: {
              color: "white",
            },
            bottom: "bottom",
            left: "center",
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "64px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              color: "#98A2B3",
              fontSize: 10,
            },
            axisTick: { show: false },
            splitLine: { show: false },
            data: yearly
              ? selectedData?.map((item: any) => item.year).slice(-10)
              : selectedData
                  ?.map((item: any) => `Q${item.quarter}/${item.year}`)
                  .slice(-16),
          },
          yAxis: [
            {
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
            {
              type: "value", // Set y-axis to value type
              splitLine: {
                show: false,
              },
              axisLabel: {
                color: "#98A2B3",
                fontSize: 12,
                formatter: (value: any) => `${value}%`,
              },
            },
          ],

          series: series,
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
