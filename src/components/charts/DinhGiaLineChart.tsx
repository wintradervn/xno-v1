import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

const data = [
  ["2024-10-25", 20.5], // Lower starting value
  ["2024-10-26", 21.2],
  ["2024-10-27", 22.8],
  ["2024-10-28", 23.4],
  ["2024-10-29", 24.1],
  ["2024-10-30", 25.7],
  ["2024-10-31", 26.3],
  ["2024-11-01", 30.0],
  ["2024-11-02", 32.5],
  ["2024-11-03", 31.8], // slight decrease
  ["2024-11-04", 35.2],
  ["2024-11-05", 38.3],
  ["2024-11-06", 37.6], // slight decrease
  ["2024-11-07", 40.1],
  ["2024-11-08", 42.4],
  ["2024-11-09", 41.9], // slight decrease
  ["2024-11-10", 44.7],
  ["2024-11-11", 47.2],
  ["2024-11-12", 49.1],
  ["2024-11-13", 48.4], // slight decrease
  ["2024-11-14", 51.3],
  ["2024-11-15", 53.5],
  ["2024-11-16", 55.8],
  ["2024-11-17", 56.2], // slight increase
  ["2024-11-18", 59.4],
  ["2024-11-19", 60.0],
  ["2024-11-20", 63.6],
  ["2024-11-21", 65.1],
  ["2024-11-22", 64.8], // slight decrease
  ["2024-11-23", 66.3],
  ["2024-11-24", 68.5],
  ["2024-11-25", 70.2],
  ["2024-11-26", 72.7],
  ["2024-11-27", 75.4],
  ["2024-11-28", 77.1],
  ["2024-11-29", 76.6], // slight decrease
  ["2024-11-30", 80.3],
];
const randomData = [
  ["2024-10-25", 20.0], // Starting point close to 20
  ["2024-10-26", 22.8],
  ["2024-10-27", 21.3],
  ["2024-10-28", 24.5],
  ["2024-10-29", 21.2],
  ["2024-10-30", 24.9], // slight decrease
  ["2024-10-31", 25.5],
  ["2024-11-01", 29.5],
  ["2024-11-02", 31.0], // slight decrease
  ["2024-11-03", 34.5],
  ["2024-11-04", 31.2],
  ["2024-11-05", 33.7],
  ["2024-11-06", 36.8], // slight decrease
  ["2024-11-07", 43.5],
  ["2024-11-08", 42.0],
  ["2024-11-09", 40.3], // slight decrease
  ["2024-11-10", 40.9],
  ["2024-11-11", 47.1],
  ["2024-11-12", 49.0], // slight decrease
  ["2024-11-13", 51.5],
  ["2024-11-14", 55.2],
  ["2024-11-15", 53.4], // slight decrease
  ["2024-11-16", 54.0],
  ["2024-11-17", 53.9],
  ["2024-11-18", 57.5], // slight increase
  ["2024-11-19", 63.0],
  ["2024-11-20", 57.7],
  ["2024-11-21", 62.9], // slight decrease
  ["2024-11-22", 67.3],
  ["2024-11-23", 69.1],
  ["2024-11-24", 65.5],
  ["2024-11-25", 72.2],
  ["2024-11-26", 68.5],
  ["2024-11-27", 73.0], // slight decrease
  ["2024-11-28", 68.3],
  ["2024-11-29", 79.7],
  ["2024-11-30", 79.0],
];

const seriesData = data.map(function (item: any, index: number) {
  return {
    name: index,
    value: item[1],
  };
});

const seriesRandomData = randomData.map(function (item: any, index: number) {
  return {
    name: index,
    value: item[1],
  };
});
const data30 = data.map(function (item: any, index: number) {
  return +(item[1] * 0.5).toFixed(2);
});
const data005 = data.map(function (item: any, index: number) {
  return +(item[1] * 0.1).toFixed(2);
});

export default function DinhGiaLineChart() {
  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          tooltip: {
            trigger: "axis",
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "20px", // Remove bottom padding
            left: "40px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              formatter: function (value: any) {
                return "29/09";
              },
              color: "#98A2B3",
              fontSize: 8,
            },
            axisTick: { show: false },
            splitLine: { show: false },
          },
          yAxis: {
            position: "right",
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
            max: 120,
            min: 10,
          },

          series: [
            {
              type: "line",
              smooth: true,
              symbol: "none",
              symbolSize: 5,
              sampling: "average",
              lineStyle: {
                width: 2,
                color: "black",
              },
              data: seriesData,
            },
            {
              type: "line",
              symbol: "none",
              symbolSize: 5,
              sampling: "average",
              lineStyle: {
                width: 4,
                color: "#7B61FF",
              },
              data: seriesRandomData,
            },
            // { type: "themeRiver", data: data2 },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              smooth: true,
              data: data30,
              symbol: "none",
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: {
                color: "#38C9A7",
                opacity: 0.7,
              },
              smooth: true,
              data: data005,
              symbol: "none",
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#67E1C1", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "-30%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#9FF0D7", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "-20%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#CFF8EB", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "-10%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
                color: "transparent",
              },
              areaStyle: { color: "#F1FCF9", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "0%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },

            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FFFAFA", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "10%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FEF3F2", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "20%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FEE4E2", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "30%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FECDC9", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FDA19B", opacity: 0.7 },
              smooth: true,
              data: data005,
              symbol: "none",
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
