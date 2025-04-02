import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { IVNIndexThanhKhoanData } from "@/hooks/useVNIndexThanhKhoanData";
import { useMemo } from "react";
import { formatVeryLargeNumber } from "@/lib/utils";
import useTheme from "@/hooks/useTheme";
import * as config from "./config";
import useChartColors from "./useChartColors";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  LegendComponent,
]);

export default function ThanhKhoanLineChart({
  timeList,
  data1,
  data2,
  data2Name,
}: {
  timeList: string[];
  data1?: IVNIndexThanhKhoanData[];
  data2?: { time: string; allValue: number }[];
  data2Name?: string;
}) {
  const configColors = useChartColors();

  const valueList1 = useMemo(() => {
    if (!data1) return [];

    return data1.map((item) => {
      return [item.time, item.allValue];
    });
  }, [data1]);
  const valueList2 = useMemo(() => {
    if (!data2) return [];

    return data2.map((item) => {
      return [item.time, item.allValue];
    });
  }, [data2]);

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          textStyle: {
            fontFamily: "Manrope, Manrope Fallback",
          },
          legend: {
            width: 510,
            align: "auto",
            itemWidth: 18,
            itemHeight: 12,
            itemGap: 16,
            textStyle: {
              color: configColors.legendTextColor,
            },
            bottom: "bottom",
            left: "center",
          },
          tooltip: {
            confine: true,
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[12px] flex flex-col gap-[1px] text-white">${params[0]?.name || params[1]?.name || "9:15"}<br/>
              <div>${data2Name}: <span class="text-green font-semibold">${formatVeryLargeNumber(params[0]?.value[1], true, 2, true)}</span></div>
              <div>GTGD hôm nay: <span class="text-green font-semibold">${formatVeryLargeNumber(params[1]?.value[1], true, 2, true)}</span></div>
              ${params[0]?.value[1] && params[1]?.value[1] ? `<div>Thay đổi: <span class="${params[1].value[1] - params[0].value[1] > 0 ? "text-green" : "text-red"} font-semibold">${formatVeryLargeNumber(params[1].value[1] - params[0].value[1], true, 2, true)}</span></div>` : ""}
              </div>
             `;
            },

            backgroundColor: configColors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: 12,
              color: "white",
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "35px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "0px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            data: timeList,
            axisLabel: {
              color: configColors.axisLabelColor,
              fontSize: 8,
            },
            axisTick: { show: false },
            splitLine: { show: false },
          },
          yAxis: {
            type: "value", // Set y-axis to value type

            splitLine: {
              lineStyle: {
                color: configColors.splitLineColor,
              },
            },
            axisLabel: {
              color: configColors.axisLabelColor,
              fontSize: 10,
              formatter: function (value: any) {
                return value ? formatVeryLargeNumber(value, true, 0, true) : 0;
              },
            },
          },
          series: [
            {
              name: data2Name,
              type: "line",
              symbol: "none",
              sampling: "average",
              color: "#7B61FF",
              lineStyle: {
                width: 1,
                color: "#7B61FF",
              },
              areaStyle: {
                opacity: 0.6,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(123, 97, 255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgb(123, 97, 255,0.2)",
                  },
                ]),
              },
              data: valueList2,
              smooth: true,
              z: 5,
              zLevel: 5,
              connectNulls: true,
              emphasis: {
                focus: "series",
              },
            },
            {
              name: "GTGD hôm nay",
              type: "line",
              symbol: "none",
              color: "#1FAD8E",
              lineStyle: {
                width: 1,
                color: "#1FAD8E",
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(31, 173, 142, 1)",
                  },
                  {
                    offset: 1,
                    color: "rgb(31, 173, 142, 0.2)",
                  },
                ]),
              },
              data: valueList1,
              smooth: true,
              z: 6,
              zLevel: 6,
              connectNulls: true,
              emphasis: {
                focus: "series",
              },
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ minHeight: "350px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
