import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { IVNIndexThanhKhoanData } from "@/hooks/useVNIndexThanhKhoanData";
import { useMemo } from "react";
import { format } from "date-fns";
import { formatNumber, formatVeryLargeNumber } from "@/lib/utils";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  VisualMapComponent,
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
  data,
}: {
  data?: IVNIndexThanhKhoanData[];
}) {
  const valueList = useMemo(() => {
    if (!data) return [];

    const valueByTime = data.reduce((acc: any, item) => {
      const time = new Date(item.time).getTime().toString();
      if (!acc[time]) {
        acc[time] = item.allValue;
      }
      return acc;
    }, {});

    return data.map((item) => {
      const time = new Date(item.time).getTime();
      // Nếu thứ 2 thì trừ 3 ngày để lấy dữ liệu thứ 6
      const weekDay = new Date(time).getDay();

      const lastDayValue =
        valueByTime[
          (time - (weekDay === 1 ? 72 : 24) * (60 * 60 * 1000)).toString()
        ];
      let lastDayValueChange = undefined;
      let lastDayChangePercent = undefined;

      if (lastDayValue) {
        lastDayValueChange = item.allValue - lastDayValue;
        lastDayChangePercent = (lastDayValueChange / lastDayValue) * 100;
      }

      return {
        ...item,
        value: item.allValue / 1000_000_000,
        lastDayValueChange,
        lastDayChangePercent,
      };
    });
  }, [data]);

  const timeList = useMemo(() => {
    if (!data) return [];

    return data.map((item) => {
      return new Date(item.time).getTime();
    });
  }, [data]);

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          textStyle: {
            fontFamily: "Manrope, Manrope Fallback",
          },
          tooltip: {
            trigger: "axis",
            formatter: function (params: any) {
              console.log("🚀 ~ params", params);
              return `<div class="text-left text-[12px] flex flex-col gap-[1px] text-white">${format(new Date(+params[0].name), "HH:mm dd/MM/yyyy")}<br/><div>GTGD hôm nay: <span class="text-green font-semibold">${formatNumber(params[0].value)} tỷ</span></div></div>
              <div class="${params[0].data.lastDayValueChange > 0 ? "text-green" : params[0].data.lastDayValueChange < 0 ? "text-red" : "text-white"}"><span class="text-white">So với phiên hôm qua: </span><span class="font-semibold">${formatVeryLargeNumber(params[0].data.lastDayValueChange)}</span> (<span>${formatNumber(params[0].data.lastDayChangePercent, 2)}%</span>)</div></div>`;
            },
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: 12,
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "10px", // Remove bottom padding
            left: "0px", // Optional: Adjust left padding
            right: "0px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            data: timeList,
            axisLabel: {
              formatter: function (value: any) {
                return format(new Date(+value), "HH:mm");
              },
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
            },
          },
          visualMap: [
            {
              min: -100,
              max: 0,
              dimension: 1, // Map the second dimension (value) to color
              inRange: {
                type: "linear", // Use linear gradient
                color: ["#E5115232", "#E51152"], // Gradient from red to green
              },
              show: false,
              seriesIndex: 0,
            },
            {
              min: 0,
              max: 100,
              dimension: 1, // Map the second dimension (value) to color
              inRange: {
                type: "", // Use linear gradient
                color: ["#1FAD8E", "#1FAD8E32"], // Gradient from red to green
              },
              show: false,
              seriesIndex: 0,
            },
            {
              min: 0,
              max: 0.1,
              dimension: 1, // Map the second dimension (value) to color
              inRange: {
                color: ["#E51152", "#1FAD8E"], // Color gradient from red to green
              },
              show: false,
              seriesIndex: 1,
            },
          ],
          series: [
            {
              name: "Giao dịch hôm nay",
              type: "line",
              symbol: "none",
              symbolSize: 5,
              sampling: "average",
              lineStyle: {
                width: 1,
                color: "#1FAD8E",
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: "rgb(31, 173, 142, 0.8)",
                  },
                  {
                    offset: 0,
                    color: "rgb(31, 173, 142, 0.1)",
                  },
                ]),
              },
              data: valueList,
              smooth: false,
            },
            // {
            //   name: "Giao dịch hôm qua",
            //   type: "line",
            //   smooth: true,
            //   symbol: "none",
            //   symbolSize: 5,
            //   sampling: "average",
            //   lineStyle: {
            //     width: 1,
            //     color: "#7B61FF",
            //   },
            //   areaStyle: {
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       {
            //         offset: 1,
            //         color: "rgb(123, 97, 255,0.5)",
            //       },
            //       {
            //         offset: 0,
            //         color: "rgb(123, 97, 255,0.1)",
            //       },
            //     ]),
            //   },
            //   data: seriesData2,
            // },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
