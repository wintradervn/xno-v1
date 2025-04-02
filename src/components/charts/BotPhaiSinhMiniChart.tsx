import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  MarkLineComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useChartColors from "./useChartColors";
import useTheme from "@/hooks/useTheme";
import useBotPhaiSinhPNLData from "@/hooks/bot-api/useBotPhaiSinhPNLData";
import DefaultLoader from "../ui/DefaultLoader";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
  VisualMapComponent,
  ScatterChart,
  MarkLineComponent,
]);

export default function BotPhaiSinhMiniChart({
  botName,
}: {
  botName?: string;
}) {
  const colors = useChartColors();
  const { isLightMode } = useTheme();
  const { data, isLoading } = useBotPhaiSinhPNLData(botName);

  if (isLoading) {
    return (
      <div className="max-h-10">
        <DefaultLoader className="!h-[40px]" />
      </div>
    );
  }
  if (!data) {
    return <div className="h-full w-full flex-1"></div>;
  }

  const minValue = data.value.reduce((min, d) => Math.min(min, d), 0) || 0;
  const maxValue = data.value.reduce((max, d) => Math.max(max, d), 0) || 0;
  const referPrice = 0;
  return (
    <div className="h-full w-full flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          animationDuration: 500,
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          grid: {
            top: "0px", // Remove top padding
            bottom: "0px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              show: false,
            },
            axisTick: { show: false },
            splitLine: { show: false },
          },
          yAxis: [
            {
              type: "value", // Set y-axis to value type
              splitLine: {
                show: false,
              },
              axisLabel: {
                show: false,
              },

              min: minValue,
              max: maxValue,
            },
          ],
          series: [
            {
              type: "line",
              smooth: false,
              symbol: "none",
              lineStyle: {
                width: 2,
              },
              areaStyle: {
                // Define a linear gradient
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 1,
                    color: "rgba(0, 0, 0, 0)",
                  },
                  {
                    offset:
                      maxValue > minValue
                        ? Math.max(
                            Math.min(
                              ((referPrice || 0) - minValue) /
                                (maxValue - minValue) +
                                0.001,
                              0.999,
                            ),
                            0.002,
                          )
                        : 0.5001,
                    color: "rgba(31, 173, 142, 0.6)",
                  },
                  {
                    offset:
                      maxValue > minValue
                        ? Math.max(
                            Math.min(
                              ((referPrice || 0) - minValue) /
                                (maxValue - minValue),
                              0.99,
                            ),
                            0.001,
                          )
                        : 0.5,
                    color: "rgba(255, 128, 182, 0.6)",
                  }, // Start color (red)
                  { offset: 0, color: "rgba(0, 0, 0, 0)" }, // End color (blue)
                ]),
                origin: referPrice,
              },
              data: data.value,
              markLine: {
                animation: false,
                silent: true,
                symbol: "none",
                lineStyle: {
                  color: "yellow",
                  dash: [5, 5],
                },
                label: {
                  show: false,
                },
                data: [
                  {
                    yAxis: 0,
                  },
                ],
              },
              connectNulls: true,
            },
          ],

          visualMap: {
            show: false,
            seriesIndex: 0,
            pieces: [
              {
                lte: 1000000000000,
                color: "#10B969",
              },
              {
                gt: 0,
                color: "#10B969",
              },
              {
                lte: 0,
                color: "#FF4D4F",
              },
              {
                gt: -1000000000000,
                color: "#FF4D4F",
              },
            ],
          },
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: "140px", height: "40px" }}
      ></ReactEChartsCore>
    </div>
  );
}
