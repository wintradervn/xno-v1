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
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

const data = [
  ["2024-11-01", -200],
  ["2024-11-02", 200],
  ["2024-11-03", 50],
  ["2024-11-04", 180],
  ["2024-11-05", -70],
  ["2024-11-06", -110],
  ["2024-11-07", 130],
  ["2024-11-08", 130],
  ["2024-11-09", 200],
  ["2024-11-10", 250],
];

export default function GiaoDichNoiBoLuyKeBarChart() {
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
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontSize: 10,
              color: "#fff",
            },
          },
          legend: {
            bottom: "1%",
            textStyle: {
              color: "#fff",
            },
          },
          grid: [
            {
              // First grid
              left: "1%",
              width: "44%",
              top: "1%",
              bottom: "40px", // Height of the first chart
              containLabel: true,
              position: "right",
            },
            {
              // Second grid
              left: "47%",
              right: "1%",
              top: "1%", // Positioning below the first chart
              bottom: "40px", // Height of the second chart
              containLabel: true,
            },
          ],
          xAxis: [
            {
              type: "value",
              gridIndex: 0, // Connect to the first grid
              inverse: true,
              splitLine: {
                lineStyle: {
                  color: "#1D2939",
                },
              },
            },
            {
              type: "value",
              gridIndex: 1, // Connect to the second grid
              splitLine: {
                lineStyle: {
                  color: "#1D2939",
                },
              },
            },
          ],
          yAxis: [
            {
              type: "category",
              data: [
                "24 tháng",
                "12 tháng",
                "9 tháng",
                "6 tháng",
                "3 tháng",
                "1 tháng",
              ],
              gridIndex: 0, // Connect to the first grid
              position: "right",
              show: false,
              axisLabel: { show: false },
            },
            {
              type: "category",
              data: [
                "24 tháng",
                "12 tháng",
                "9 tháng",
                "6 tháng",
                "3 tháng",
                "1 tháng",
              ],
              gridIndex: 1, // Connect to the second grid
              axisTick: { show: false },
              axisLine: { show: false },
            },
          ],
          series: [
            {
              name: "Bán (Triệu CP)",
              type: "bar",
              data: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6],
              xAxisIndex: 0, // Connect to the first xAxis
              yAxisIndex: 0, // Connect to the first yAxis
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 1, color: "#532F38" },
                    { offset: 0, color: "#E55E65" },
                  ],
                },
                borderRadius: [5, 5, 5, 5],
              },
            },
            {
              name: "Mua (Triệu CP)",
              type: "bar",
              data: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6],
              xAxisIndex: 1, // Connect to the second xAxis
              yAxisIndex: 1, // Connect to the second yAxis
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "#114437" },
                    { offset: 1, color: "#05AE68" },
                  ],
                }, // Color for Chart 2
                borderRadius: [5, 5, 5, 5],
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
