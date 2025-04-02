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
import DefaultNodata from "../ui/DefaultNodata";
import useChartColors from "./useChartColors";
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
  const colors = useChartColors();
  const groupedData = useMemo(() => {
    const grouped: any = {
      tang: { value: 0, count: 0 },
      giam: { value: 0, count: 0 },
      khongdoi: { value: 0, count: 0 },
    };
    if (!data) return [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.dayChange !== null) {
        if (item.dayChange > 0) {
          grouped.tang.value += item.dayValue;
          grouped.tang.count++;
        }
        if (item.dayChange < 0) {
          grouped.giam.value += item.dayValue;
          grouped.giam.count++;
        }
        if (item.dayChange === 0) {
          grouped.khongdoi.value += item.dayValue;
          grouped.khongdoi.count++;
        }
      }
    }
    return Object.entries(grouped).map(([key, item]) => {
      return {
        name: labelMap[key],
        value: (item as any).value,
        count: (item as any).count,
        itemStyle: {
          color:
            key === "tang"
              ? colors.green
              : key === "giam"
                ? colors.red
                : colors.yellow,
        },
        label: {
          show: true,
          position: "top",
          fontSize: 11,
          fontWeight: "bold",
          color:
            key === "tang"
              ? colors.green
              : key === "giam"
                ? colors.red
                : colors.yellow,
          formatter: function (params: any) {
            return formatVeryLargeNumber(params.value, false);
          },
        },
      };
    });
  }, [data, colors]);

  const isNoData = useMemo(() => {
    return (
      !data ||
      data.length === 0 ||
      groupedData.every((item: any) => !item.value)
    );
  }, [data, groupedData]);

  return (
    <div className="flex-1">
      {isLoading ? (
        <DefaultLoader />
      ) : isNoData ? (
        <DefaultNodata />
      ) : (
        <>
          <ReactEChartsCore
            echarts={echarts}
            option={{
              textStyle: {
                fontFamily: "Manrope, Manrope Fallback",
                fontSize: 10,
              },
              tooltip: {
                confine: true,
                trigger: "axis",
                formatter: function (params: any) {
                  const color =
                    params[0].name === "Tăng"
                      ? colors.green
                      : params[0].name === "Giảm"
                        ? colors.red
                        : colors.yellow;
                  return `<div class="text-left flex gap-2 text-white items-center text-sm">
                <div class="w-2! h-2! rounded-[2px]" style="background-color:${color}"></div>
                ${params[0].name}<span class="text-sm font-bold" style="color:${color}">${formatVeryLargeNumber(params[0].value)}</span>
            </div>`;
                },
                backgroundColor: colors.tooltipBackground, // Tooltip background color
                borderWidth: 0, // Tooltip border width
                padding: 10, // Tooltip padding
              },

              grid: {
                top: "15px", // Remove top padding
                bottom: "10px", // Remove bottom padding
                left: "4px", // Optional: Adjust left padding
                right: "4px", // Optional: Adjust right padding
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
                    color: colors.splitLineColor,
                  },
                },
                axisLabel: {
                  color: colors.axisLabelColor,
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
                    width: 0,
                  },
                  data: groupedData,
                },
              ],
            }}
            notMerge={true}
            lazyUpdate={true}
            style={{ minHeight: "220px", height: "100%", width: "100%" }}
          ></ReactEChartsCore>
          <div className="flex shrink-0 justify-between pr-[7.5%] pl-[19%] text-xs sm:pr-[9%] sm:pl-[17%]">
            <div className="flex w-[60px] flex-col items-center gap-0.5">
              <div className="text-muted">Tăng giá</div>
              <div className="text-green font-bold">
                {(groupedData.find((item) => item.name === "Tăng")?.count ||
                  0) + " CP"}
              </div>
            </div>
            <div className="flex w-[60px] flex-col items-center gap-0.5">
              <div className="text-muted">Giảm giá</div>
              <div className="text-red font-bold">
                {(groupedData.find((item) => item.name === "Giảm")?.count ||
                  0) + " CP"}
              </div>
            </div>
            <div className="flex w-[60px] flex-col items-center gap-0.5">
              <div className="text-muted">Không đổi</div>
              <div className="text-yellow font-bold">
                {(groupedData.find((item) => item.name === "Không đổi")
                  ?.count || 0) + " CP"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
