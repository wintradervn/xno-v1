// import ReactEChartsCore from "echarts-for-react/lib/core";
// import { CanvasRenderer } from "echarts/renderers";
// import { BarChart } from "echarts/charts";
// import {TitleComponent,TooltipComponent,GridComponent} from 'echarts/components';
// import * as echarts from "echarts/core";
// echarts.use([CanvasRenderer, BarChart,TitleComponent,TooltipComponent,GridComponent]);

// export default function NNMuaRongBarChart() {
//   return <ReactEChartsCore echarts={echarts} option={{}}></ReactEChartsCore>;
// }
import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import { useMemo } from "react";
import DefaultLoader from "../ui/DefaultLoader";
import { formatVeryLargeNumber } from "@/lib/utils";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

const labelMap: Record<string, string> = {
  tang: "Tăng",
  giam: "Giảm",
  khongdoi: "Không đổi",
};

export default function PhanBoDongTienBarChart({
  data,
  isLoading,
}: {
  data?: TSymbolOverviewData[];
  isLoading?: boolean;
}) {
  const groupedData = useMemo(() => {
    const grouped: any = { tang: 0, giam: 0, khongdoi: 0 };
    if (!data) return grouped;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.dayChange !== null) {
        if (item.dayChange > 0) {
          grouped.tang += item.dayValue;
        }
        if (item.dayChange < 0) {
          grouped.giam += item.dayValue;
        }
        if (item.dayChange === 0) {
          grouped.khongdoi += item.dayValue;
        }
      }
    }
    return Object.entries(grouped).map(([key, value]) => {
      return {
        name: labelMap[key],
        value: value,
        itemStyle: {
          color:
            key === "tang" ? "#1DF81F" : key === "giam" ? "#FF135B" : "#F1C617",
        },
        label: {
          show: true,
          position: "top",
          fontSize: 11,
          fontWeight: "bold",
          color:
            key === "tang" ? "#1DF81F" : key === "giam" ? "#FF135B" : "#F1C617",
          formatter: function (params: any) {
            return formatVeryLargeNumber(params.value, false);
          },
        },
      };
    });
  }, [data]);
  console.log("groupedData", groupedData);

  if (isLoading) {
    return <DefaultLoader />;
  }

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          textStyle: {
            fontFamily: "Manrope, Manrope Fallback",
            fontSize: 10,
          },
          tooltip: {
            trigger: "axis",
            formatter: function (params: any) {
              const color =
                params[0].name === "Tăng"
                  ? "#1DF81F"
                  : params[0].name === "Giảm"
                    ? "#FF135B"
                    : "#F1C617";
              return `<div class="text-left flex gap-2 text-white items-center text-sm">
                <div class="!w-2 !h-2 rounded-[2px]" style="background-color:${color}"></div>
                ${params[0].name}<span class="text-sm font-bold" style="color:${color}">${formatVeryLargeNumber(params[0].value)}</span>
            </div>`;
            },
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
          },

          grid: {
            top: "10px", // Remove top padding
            bottom: "20px", // Remove bottom padding
            left: "4px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              show: false,
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
              formatter: function (value: any) {
                return formatVeryLargeNumber(value, false, 0);
              },
              fontSize: 10,
            },
          },
          series: [
            {
              type: "bar",
              legend: { show: false },
              barCategoryGap: "60%",
              itemStyle: {
                borderRadius: [10, 10, 0, 0],
              },
              data: groupedData,
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
