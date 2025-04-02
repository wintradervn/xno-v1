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
import useChartColors from "./useChartColors";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useGiaoDichNoiBo from "@/hooks/api-v2/useGiaoDichNoiBo";
import { useMemo } from "react";
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
  const colors = useChartColors();
  const { currentSymbol } = useCurrentSymbol();
  const { data: giaoDichNoiBo } = useGiaoDichNoiBo(currentSymbol);

  const { buyData, sellData } = useMemo(() => {
    if (!giaoDichNoiBo) return { buyData: [], sellData: [] };
    const nowTimeframe = new Date().getTime();
    const lastMonthTimeframe = nowTimeframe - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    const last3MonthTimeframe = nowTimeframe - 90 * 24 * 60 * 60 * 1000; // 90 days ago
    const last6MonthTimeframe = nowTimeframe - 180 * 24 * 60 * 60 * 1000; // 180 days ago
    const last9MonthTimeframe = nowTimeframe - 270 * 24 * 60 * 60 * 1000; // 270 days ago
    const last12MonthTimeframe = nowTimeframe - 365 * 24 * 60 * 60 * 1000; // 365 days ago
    const last24MonthTimeframe = nowTimeframe - 730 * 24 * 60 * 60 * 1000; // 730 days ago

    const timeArray = [
      lastMonthTimeframe,
      last3MonthTimeframe,
      last6MonthTimeframe,
      last9MonthTimeframe,
      last12MonthTimeframe,
      last24MonthTimeframe,
    ];
    let index = 0;
    let acc = 0;
    const result: number[] = [];
    giaoDichNoiBo
      .reverse()
      .filter((item) => item.side === "buy")
      .forEach((item) => {
        if (new Date(item.tradingTime).getTime() < timeArray[index]) {
          result[index] = acc;
          index++;
          if (index >= timeArray.length) return;
        }
        acc += item.volume / 1000000;
      });
    index = 0;
    acc = 0;
    const resultSell: number[] = [];
    giaoDichNoiBo
      .filter((item) => item.side === "sell")
      .forEach((item) => {
        if (new Date(item.tradingTime).getTime() < timeArray[index]) {
          console.log("1424124124", new Date(item.tradingTime).getTime());
          resultSell[index] = acc;
          index++;
          if (index >= timeArray.length) return;
        }
        acc += -item.volume / 1000000;
      });
    return {
      buyData: result.reverse().map((v) => +v.toFixed(2)),
      sellData: resultSell.reverse().map((v) => +v.toFixed(2)),
    };
  }, [giaoDichNoiBo]);

  const maxValue = useMemo(() => {
    return Math.ceil(Math.max(...buyData, ...sellData) || 0);
  }, [buyData, sellData]);

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          textStyle: {
            fontFamily: "Manrope, Manrope Fallback",
          },
          tooltip: {
            confine: true,
            trigger: "axis",
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontSize: 10,
              color: colors.legendTextColor,
            },
          },
          legend: {
            bottom: "1%",
            textStyle: {
              color: colors.legendTextColor,
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
                  color: colors.splitLineColor,
                },
              },
              axisLabel: {
                fontSize: 10,
              },
              max: maxValue,
            },
            {
              type: "value",
              gridIndex: 1, // Connect to the second grid
              splitLine: {
                lineStyle: {
                  color: colors.splitLineColor,
                },
              },
              axisLabel: {
                fontSize: 10,
              },
              max: maxValue,
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
              axisLabel: { fontSize: 10 },
            },
          ],
          series: [
            {
              name: "Bán (Triệu CP)",
              type: "bar",
              data: sellData,
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
                    { offset: 1, color: "#E55E6533" },
                    { offset: 0, color: "#E55E65" },
                  ],
                },
                borderRadius: [5, 5, 5, 5],
              },
            },
            {
              name: "Mua (Triệu CP)",
              type: "bar",
              data: buyData,
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
                    { offset: 0, color: "#05AE6833" },
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
        style={{ minHeight: "200px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
