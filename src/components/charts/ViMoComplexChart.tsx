import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import * as echarts from "echarts/core";

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

const data: any[] = [];

const years = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];

for (let j = 0; j < 10; j++) {
  const yearData = [];
  for (let i = 0; i < years.length; i++) {
    yearData.push([years[i], Math.floor(Math.random() * 500 + 200)]);
  }
  data.push(yearData);
}

const colors = [
  "#FFA940",
  "#FF5A5A",
  "#1DF81F",
  "#2ba83c",
  "#2D84FF",
  "#67E1C0",
  "#E51152",
  "#CFF8EA",
  "#CFDBF8",
  "#2D84FF",
];

export default function ViMoComplexChart({ count = 1 }: { count: number }) {
  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          tooltip: { trigger: "axis", confine: true },
          legend: { bottom: "bottom", textStyle: { color: "white" } },
          grid: {
            top: "10px", // Remove top padding
            bottom: "30px", // Remove bottom padding
            left: "0px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {},
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
          series: data.slice(0, count).map((yearData, index) => {
            return {
              type: !!(index % 2) ? "bar" : "line",
              data: yearData,
              name: "Chart" + (index + 1),
              itemStyle: {
                color: colors[index],
              },
            };
          }),
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
