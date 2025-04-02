import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { text } from "stream/consumers";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

const label = {};

const series = [
  {
    data: [50, 60, 66, 70, 60, 70, 63, 64, 75, 65, 56, 65],
    type: "bar",
    stack: "a",
    name: "Góp vốn đầu tư",
    itemStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          { offset: 0, color: "#CFF8EA" },
          { offset: 1, color: "#67E1C0" },
        ],
      },
    },
    label: label,
    barWidth: "22px",
  },
  {
    data: [50, 20, 32, 60, 20, 30, 33, 34, 35, 36, 36, 38],
    type: "bar",
    stack: "a",
    name: "Tài sản cố định",
    itemStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          { offset: 0, color: "#CFDBF8" },
          { offset: 1, color: "#2D84FF" },
        ],
      },
    },
    label: label,
    barWidth: "22px",
  },
  {
    data: [20, 40, 42, 21, 20, 20, 23, 24, 25, 26, 27, 28],
    type: "bar",
    stack: "a",
    name: "Tiền mặt và tương đương tiền",
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          { offset: 0, color: "#FFCCE2" },
          { offset: 1, color: "#FF80B6" },
        ],
      },
    },
    label: label,
    barWidth: "22px",
  },
  {
    data: [120, 140, 142, 51, 71, 71, 70, 90, 45, 65, 70, 120],
    type: "line",
    color: "#F5B763",
    symbolSize: 5,
  },
  {
    data: [120, 140, 142, 121, 91, 111, 110, 70, 85, 45, 110, 120],
    type: "line",
    color: "#3673E8",
    symbolSize: 5,
  },
  {
    data: [120, 30, 42, 21, 41, 61, 40, 50, 65, 85, 60, 90],
    type: "line",
    color: "#61B8FF",
    symbolSize: 5,
  },
];

export default function PhanTichTaiChinhBarChart() {
  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          tooltip: {
            confine: true,
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[12px] flex flex-col gap-[1px] text-white">${params[0].name}<br/>Value: ${params[0].value}</div>`;
            },
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontSize: 10,
            },
          },
          legend: {
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 25,
            textStyle: {
              color: "white",
            },
            bottom: "bottom",
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "60px", // Remove bottom padding
            left: "40px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              color: "#98A2B3",
              fontSize: 10,
            },
            data: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
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
          series: series,
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
