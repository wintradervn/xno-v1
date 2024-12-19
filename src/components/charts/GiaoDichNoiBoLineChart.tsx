import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  DataZoomInsideComponent,
  DataZoomComponent,
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
  MarkPointComponent,
  ScatterChart,
  DataZoomComponent,
  DataZoomInsideComponent,
]);

const data: any[] = [];
let now = new Date(2021, 9, 3);
const oneDay = 24 * 3600 * 1000;
let value = Math.random() * 100 + 100;
for (let i = 0; i < 100; i++) {
  now = new Date(+now + oneDay);
  value = Math.max(10, value + Math.random() * 41 - 20);
  data.push({
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
      Math.round(value),
    ],
  });
}

const data2: any[] = [
  [data[10].value[0], data[10].value[1] - 15],
  [data[10].value[0], data[10].value[1] - 30],
  [data[10].value[0], data[10].value[1] - 45],
  [data[20].value[0], data[20].value[1] - 15],
];
const data3: any[] = [
  [data[45].value[0], data[45].value[1] - 15],
  [data[45].value[0], data[45].value[1] - 30],
  [data[80].value[0], data[80].value[1] - 15],
];

export default function GiaoDichNoiBoLineChart() {
  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          dataZoom: [
            {
              type: "inside",
            },
          ],
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },

          tooltip: {
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[12px] flex flex-col gap-[1px] text-white">${params[0].name}<br/>Value: ${params[0].value}</div>`;
            },
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: 10,
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "25px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
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
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              formatter: function (value: any) {
                return value.split("/")[0]; // Remove year from x-axis
              },
              color: "#98A2B3",
              fontSize: 8,
              interval: 10,
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
          series: [
            {
              name: "Đường giá",
              type: "line",
              smooth: true,
              symbol: "none",
              symbolSize: 5,
              sampling: "average",
              lineStyle: {
                width: 2,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(123, 97, 255,0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgb(123, 97, 255,0)",
                  },
                ]),
              },

              color: "#10B969",
              data: data,
            },
            {
              type: "scatter",
              data: data2,
              itemStyle: { color: "#1DF81F" },
              name: "Mua",
            },
            {
              type: "scatter",
              data: data3,
              itemStyle: { color: "#FF135B" },
              name: "Bán",
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
