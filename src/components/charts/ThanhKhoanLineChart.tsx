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

const data = [
  ["2024-11-01", 1100],
  ["2024-11-02", 1200],
  ["2024-11-03", 1150],
  ["2024-11-04", 1180],
  ["2024-11-05", 970],
  ["2024-11-06", 1110],
  ["2024-11-07", 1130],
  ["2024-11-08", 1130],
  ["2024-11-09", 1200],
  ["2024-11-10", 1250],
  ["2024-11-01", 1100],
  ["2024-11-02", 1200],
  ["2024-11-03", 1150],
  ["2024-11-04", 1180],
  ["2024-11-05", 1170],
  ["2024-11-07", 1130],
  ["2024-11-08", 1130],
  ["2024-11-09", 1200],
  ["2024-11-10", 1250],
  ["2024-11-01", 1200],
  ["2024-11-02", 1200],
  ["2024-11-03", 1250],
  ["2024-11-04", 1180],
  ["2024-11-05", 1170],
  ["2024-11-06", 1110],
  ["2024-11-07", 1130],
  ["2024-11-08", 1130],
  ["2024-11-09", 1200],
  ["2024-11-10", 1250],
];
const data2 = [
  ["2024-11-01", 890],
  ["2024-11-02", 880],
  ["2024-11-03", 844],
  ["2024-11-04", 867],
  ["2024-11-05", 960],
  ["2024-11-06", 900],
  ["2024-11-07", 912],
  ["2024-11-08", 913],
  ["2024-11-09", 984],
  ["2024-11-10", 1030],
  ["2024-11-01", 981],
  ["2024-11-02", 980],
  ["2024-11-03", 740],
  ["2024-11-04", 950],
  ["2024-11-05", 860],
  ["2024-11-07", 920],
  ["2024-11-08", 921],
  ["2024-11-09", 880],
  ["2024-11-10", 820],
  ["2024-11-01", 880],
  ["2024-11-02", 870],
  ["2024-11-03", 934],
  ["2024-11-04", 865],
  ["2024-11-05", 952],
  ["2024-11-06", 800],
  ["2024-11-07", 920],
  ["2024-11-08", 920],
  ["2024-11-09", 1010],
  ["2024-11-10", 1120],
];
const seriesData = data.map(function (item: any, index: number) {
  return {
    name: index,
    value: item[1],
  };
});
const seriesData2 = data2.map(function (item: any, index: number) {
  return {
    name: index,
    value: item[1],
  };
});

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
              color: "white",
            },
            bottom: "bottom",
            left: "center",
          },
          tooltip: {
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[12px] flex flex-col gap-[1px] text-white">${params[0]?.name || params[1]?.name || "9:15"}<br/>
              <div>${data2Name}: <span class="text-green font-semibold">${formatVeryLargeNumber(params[0]?.value[1], true, 2, true)}</span></div>
              <div>GTGD hôm nay: <span class="text-green font-semibold">${formatVeryLargeNumber(params[1]?.value[1], true, 2, true)}</span></div>
              ${params[0]?.value[1] && params[1]?.value[1] ? `<div>Thay đổi: <span class="${params[1].value[1] - params[0].value[1] > 0 ? "text-green" : "text-red"} font-semibold">${formatVeryLargeNumber(params[1].value[1] - params[0].value[1], true, 2, true)}</span></div>` : ""}
              </div>
             `;
            },

            backgroundColor: "#0A0E14", // Tooltip background color
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
              color: "#98A2B3",
              fontSize: 8,
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
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
