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
import { useMemo } from "react";
import { format, interval } from "date-fns";
import { formatNumber, formatVeryLargeNumber } from "@/lib/utils";
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

    const timestamp15h = new Date(firstTimeStamp).setHours(15, 0, 0, 0);

    const timeArray = [];

    for (let i = 0; i <= 6 * 60; i++) {
      if (firstTimeStamp + i * 60 * 1000 <= timestamp15h) {
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
  }, [timeData, indexData]);

  const volumeData = useMemo(() => {
    if (!indexData || !timeData) return [];
    return timeData.map((time) => {
      const found = indexData.find((item) => item[5] === +time);
      return {
        name: time,
        value: found ? found[4] : null,
      };
    });
  }, [timeData, indexData]);

  const maxVolume = useMemo(() => {
    if (!volumeData) return 0;
    return Math.max(
      ...volumeData.map((item) => item.value).filter((item) => item !== null),
    );
  }, [volumeData]);

  const minData = useMemo(() => {
    if (!formattedData) return 0;
    return Math.min(
      ...formattedData
        .map((item) => item.value)
        .filter((item) => item !== null),
    );
  }, [formattedData]);
  const maxData = useMemo(() => {
    if (!formattedData) return 0;
    return Math.max(
      ...formattedData
        .map((item) => item.value)
        .filter((item) => item !== null),
    );
  }, [formattedData]);
  const averageData = useMemo(() => {
    if (!indexData) return 1;
    return indexData.reduce((acc, item) => acc + item[0], 0) / indexData.length;
  }, [indexData]);

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
          animation: false,

          tooltip: {
            trigger: "axis",
            formatter: function (params: any) {
              const color = params[0].value > averageData ? "green" : "red";
              if (!params[0].value) return "";

              return `<div class="text-left font-semibold flex flex-col gap-[2px] text-white w-[100px]">${format(+params[0].name, "HH:mm")}<br/>
              <div class="flex items-center gap-1 text-${color}"><div class="h-1.5 w-1.5 rounded-full bg-${color}"></div> <span class="text-muted">Giá:</span> ${params[0].value}</div>
              <div class="flex items-center gap-1 text-white"><div class="h-1.5 w-1.5 rounded-full bg-blue-600"></div> <span class="text-muted">KLGD:</span> ${formatNumber(params[1].value)}</div>
              </div>`;
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
                if (
                  index === 0 ||
                  index === timeData.length - 1 ||
                  index === timeData.length - 121 ||
                  index === timeData.length - 241
                )
                  return format(new Date(+value), "HH:mm");
              },
              color: "#98A2B3",
              fontSize: 8,
              interval: 0,
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

              min: minData,
              max: maxData,
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
              symbolSize: 5,
              sampling: "average",
              lineStyle: {
                width: 2,
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
              color: "#E9E8FF80",
              yAxisIndex: 1,
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
