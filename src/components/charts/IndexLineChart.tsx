import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  DataZoomInsideComponent,
  DataZoomComponent,
  MarkLineComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useIndexChartData from "@/hooks/useIndexChartData";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { formatNumber } from "@/lib/utils";
import useIsMobile from "@/hooks/useIsMobile";
import useChartColors from "./useChartColors";
import useTheme from "@/hooks/useTheme";
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
  DataZoomComponent,
  DataZoomInsideComponent,
  MarkLineComponent,
]);

export default function IndexLineChart({
  symbol = "VNIndex",
  referPrice,
}: {
  symbol?: string;
  referPrice?: number;
}) {
  const { data } = useIndexChartData();
  const [isShow, setIsShow] = useState(false);
  const isMobile = useIsMobile();
  const colors = useChartColors();
  const { isLightMode } = useTheme();
  const indexData = useMemo(() => {
    return (
      data
        ?.find((item) => item.index === symbol)
        ?.OHLCVT.sort((a, b) => a[5] - b[5]) || []
    );
  }, [data]);

  const timeData = useMemo(() => {
    if (!indexData?.length) return [];
    const firstTimeStamp = indexData[0]?.[5];

    const lastTimeStamp = indexData[indexData.length - 1]?.[5];

    const timeArray = [];

    for (let i = 0; i <= 6 * 60; i++) {
      if (firstTimeStamp + i * 60 * 1000 <= lastTimeStamp) {
        timeArray.push((firstTimeStamp + i * 60 * 1000).toString());
      }
    }

    return timeArray;
  }, [indexData]);

  const formattedData = useMemo(() => {
    if (!indexData || !timeData) return [];
    return timeData.map((time) => {
      const found = indexData.find((item) => item[5] === +time);
      return {
        name: time,
        value: found ? found[0] : null,
      };
    });
    // if (!indexData || !timeData) return [];
    // return indexData.map(
    //   (item: any) => ({
    //     name: item[5],
    //     value: item[0],
    //   }),
    //   [],
    // );
  }, [timeData, indexData]);

  const minValue = useMemo(() => {
    if (!formattedData) return 0;
    return Math.min(
      ...formattedData
        .map((item) => item.value)
        .filter((item) => item !== null),
    );
  }, [formattedData]);

  const maxValue = useMemo(() => {
    if (!formattedData) return 0;
    return Math.max(
      ...formattedData
        .map((item) => item.value)
        .filter((item) => item !== null),
    );
  }, [formattedData]);

  const volumeData = useMemo(() => {
    if (!indexData || !timeData) return [];
    return timeData.map((time) => {
      const found = indexData.find((item) => item[5] === +time);
      return {
        name: time,
        value: found ? found[4] : null,
      };
    });
    // if (!indexData || !timeData) return [];
    // return indexData.map(
    //   (item: any) => ({
    //     name: item[5],
    //     value: item[4],
    //   }),
    //   [],
    // );
  }, [timeData, indexData]);

  const maxVolume = useMemo(() => {
    if (!volumeData) return 0;
    return Math.max(
      ...volumeData.map((item) => item.value).filter((item) => item !== null),
    );
  }, [volumeData]);

  useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    }, 1000);
  }, []);

  return (
    <div className="flex-1">
      {isShow && (
        <ReactEChartsCore
          echarts={echarts}
          option={{
            dataZoom: [
              {
                type: "inside",
              },
            ],
            textStyle: { fontFamily: "Manrope, Manrope Fallback" },
            animation: false,

            tooltip: {
              confine: true,
              trigger: "axis",
              formatter: function (params: any) {
                const color =
                  params[0].value > (referPrice || 0) ? "green" : "red";
                if (!params[0].value) return "";

                return `<div class="text-left font-semibold flex flex-col gap-[1px] text-white w-[100px]">${format(+params[0].name, "HH:mm")}<br/>
              <div class="flex items-center gap-1 text-${color}"><div class="h-1.5 w-1.5 rounded-full bg-${color}"></div> <span class="text-muted">Giá:</span> ${params[0].value}</div>
              <div class="flex items-center gap-1 text-white"><div class="h-1.5 w-1.5 rounded-full bg-blue-600"></div> <span class="text-muted">KLGD:</span> ${formatNumber(params[1].value)}</div>
              </div>`;
              },
              backgroundColor: colors.tooltipBackground, // Tooltip background color
              borderWidth: 0, // Tooltip border width
              padding: 8, // Tooltip padding
              textStyle: {
                fontFamily: "Manrope, Manrope Fallback",
                fontSize: 12,
              },
            },
            grid: {
              top: "20px", // Remove top padding
              bottom: "0px", // Remove bottom padding
              left: "10px", // Optional: Adjust left padding
              right: "10px", // Optional: Adjust right padding
              containLabel: true,
            },

            xAxis: {
              type: "category",
              axisLine: { show: false },
              axisLabel: {
                formatter: function (value: any, index: number) {
                  return format(new Date(+value), "HH:mm");
                },
                color: colors.axisLabelColor,
                fontSize: 8,
                showMinLabel: true,
                showMaxLabel: true,
              },
              data: timeData,
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
              {
                type: "value",
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  show: false,
                },

                min: 0,
                max: maxVolume * 2,
              },
            ],
            visualMap: {
              show: false,
              seriesIndex: 0,
              pieces: [
                {
                  lte: 4000,
                  color: "#10B969",
                },
                {
                  gt: referPrice,
                  color: "#10B969",
                },
                {
                  lte: referPrice,
                  color: "#FF4D4F",
                },
                {
                  gt: 0,
                  color: "#FF4D4F",
                },
              ],
            },
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
                yAxisIndex: 0,
                xAxisIndex: 0,
                data: formattedData,
                markLine: referPrice
                  ? {
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
                          yAxis: referPrice,
                        },
                      ],
                    }
                  : undefined,
                connectNulls: true,
              },
              {
                type: "bar",
                data: volumeData,
                xAxisIndex: 0,
                color: isLightMode ? "#B7B1FFaa" : "#E9E8FF80",
                yAxisIndex: 1,
              },
            ],
          }}
          notMerge={true}
          lazyUpdate={true}
          style={{ height: isMobile ? "70px" : "118px", width: "100%" }}
        ></ReactEChartsCore>
      )}
    </div>
  );
}
