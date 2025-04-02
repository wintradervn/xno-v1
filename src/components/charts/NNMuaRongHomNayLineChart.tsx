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
import useChartColors from "./useChartColors";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  VisualMapComponent,
]);

const data = [
  ["2024-11-01", 100],
  ["2024-11-02", 200],
  ["2024-11-03", 50],
  ["2024-11-04", 180],
  ["2024-11-05", 70],
  ["2024-11-06", 110],
  ["2024-11-07", 130],
  ["2024-11-08", 130],
  ["2024-11-09", 200],
  ["2024-11-10", 250],
  ["2024-11-01", 100],
  ["2024-11-02", 200],
  ["2024-11-03", 50],
  ["2024-11-04", 180],
  ["2024-11-05", 70],
  ["2024-11-07", 130],
  ["2024-11-08", 130],
  ["2024-11-09", 200],
  ["2024-11-10", 250],
  ["2024-11-01", 200],
  ["2024-11-02", 200],
  ["2024-11-03", 50],
  ["2024-11-04", 180],
  ["2024-11-05", 70],
  ["2024-11-06", 110],
  ["2024-11-07", 130],
  ["2024-11-08", 130],
  ["2024-11-09", 200],
  ["2024-11-10", 250],
];
const seriesData = data.map(function (item: any, index: number) {
  return {
    name: index,
    value: item[1],
    areaStyle: {
      color: "#000",
    },
  };
});

export default function NNMuaRongHomNayLineChart() {
  const colors = useChartColors();
  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          tooltip: {
            confine: true,
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[12px] flex flex-col gap-[1px] text-white">${params[0].name}<br/>Value: ${params[0].value}</div>`;
            },
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: 10,
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "20px", // Remove bottom padding
            left: "40px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              formatter: function (value: any) {
                return "29/09";
              },
              color: colors.axisLabelColor,
              fontSize: 8,
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
              "z-level": 0,
              type: "line",
              smooth: true,
              symbol: "none",
              symbolSize: 5,
              sampling: "average",
              lineStyle: {
                width: 1,
              },
              areaStyle: {},
              data: seriesData,
            },
            {
              "z-level": 1,
              type: "line",
              smooth: true,
              symbol: "none",
              symbolSize: 5,
              sampling: "average",
              lineStyle: {
                width: 1,
              },
              data: seriesData,
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
