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
import { BarChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useIsMobile from "@/hooks/useIsMobile";
import useChartColors from "./useChartColors";
import useTheme from "@/hooks/useTheme";
import useSelectedBotName from "@/hooks/useSelectedBotName";
import DefaultNodata from "../ui/DefaultNodata";
import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";
import { format } from "date-fns";
import useBotPhaiSinhInfoData from "@/hooks/bot-api/useBotPhaiSinhInfoData";
import useBotPhaiSinhMarketPriceData from "@/hooks/bot-api/useBotPhaiSinhMarketPriceData";
import useBotPhaiSinhReturnData from "@/hooks/bot-api/useBotPhaiSinhReturnData";
import useBotPhaiSinhActionData from "@/hooks/bot-api/useBotPhaiSinhActionData";
import useBotPhaiSinhHistory from "@/hooks/bot-api/useBotPhaiSinhHistory";
echarts.use([
  CanvasRenderer,
  BarChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
]);

export default function HieuSuatBotLineChart({
  timeFrame,
}: {
  timeFrame?: string;
}) {
  const isMobile = useIsMobile();
  const colors = useChartColors();
  const { botName } = useSelectedBotName();
  const { data: botInfo } = useBotPhaiSinhInfoData(botName || undefined);
  const { data: marketPrice } = useBotPhaiSinhMarketPriceData(
    botName || undefined,
  );
  const isPhaiSinh = botInfo?.symbol.startsWith("VN30");

  const { data: returnData } = useBotPhaiSinhReturnData(botName || undefined);

  const { history } = useBotPhaiSinhHistory(botName || undefined);

  const timeData = useMemo(() => {
    if (!marketPrice) return [];
    return marketPrice.time;
  }, [marketPrice]);

  const start = useMemo(() => {
    if (timeFrame === "tatca" || !timeData) return 0;
    const min = Math.min(
      ...timeData.filter((value) => {
        if (timeFrame === "1W") {
          return value > Date.now() / 1000 - 7 * 24 * 60 * 60;
        }
        if (timeFrame === "1M") {
          return value > Date.now() / 1000 - 30 * 24 * 60 * 60;
        }
        return true;
      }),
    );
    const minIndex = timeData.indexOf(min);
    return (minIndex / timeData.length) * 100;
  }, [timeFrame, timeData]);

  const chisoVN30Data = useMemo(() => {
    if (!marketPrice) return [];
    return marketPrice.value;
  }, [marketPrice]);

  const maxPrice = useMemo(() => {
    if (!marketPrice) return 0;
    return Math.max(...marketPrice.value);
  }, [marketPrice]);
  const minPrice = useMemo(() => {
    if (!marketPrice) return 0;
    return Math.min(...marketPrice.value);
  }, [marketPrice]);

  const botXNOData = useMemo(() => {
    if (!returnData) return [];
    return returnData.value.map((v) => +(v * 100));
  }, [returnData]);

  const minBotXNOData = useMemo(() => {
    if (!returnData) return 0;
    return Math.min(...returnData.value) * 100 * 1.06;
  }, [returnData]);
  const maxBotXNOData = useMemo(() => {
    if (!returnData) return 0;
    return Math.max(...returnData.value) * 100 * 0.95;
  }, [returnData]);

  const scatterData = useMemo(() => {
    const range = maxPrice - minPrice;
    return history?.map((item: any, index: number) => ({
      value: [
        item.open_time.toString(),
        (item.signal_price || 0) +
          (item.type === "Long"
            ? -range * 0.03
            : item.type === (isPhaiSinh ? "Short" : "Cover")
              ? +range * 0.03
              : 0),
      ],
      itemStyle: {
        color:
          item.type === "Long"
            ? colors.green
            : item.type === (isPhaiSinh ? "Short" : "Cover")
              ? colors.red
              : colors.yellow,
      },
      data: {
        type: item.type,
        price: item.signal_price,
        change: item.change,
      },
    }));
  }, [history, maxPrice, minPrice]);

  const calculatePercent = (value: number) => {
    if (!botInfo) return 0;
    return formatNumber(Math.abs(value / botInfo.max_position) * 100, 0);
  };

  if (!botName) return <DefaultNodata text="Không có tên bot" />;

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          dataZoom: [
            {
              type: "inside",
              start: start,
            },
          ],
          tooltip: {
            confine: true,
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[14px] flex flex-col gap-[4px] text-white font-semibold">
                <div class="text-sm font-semibold">${format(new Date(+params[0].name * 1000), "dd/MM/yyyy hh:mm")}</div>
                <div class="flex items-center text-xs font-normal justify-between gap-4"><div class="text-muted">${params[1]?.marker} ${params[1].seriesName}</div> <div class="text-foreground font-semibold">${formatNumber(params[1].value, 1)}</div></div>
                <div class="flex items-center text-xs font-normal justify-between gap-4"><div  class="text-muted">${params[0]?.marker} ${params[0].seriesName}</div> <div class="text-foreground font-semibold">${formatNumber(params[0].value, 2)}%</div></div>
              </div>`;
            },
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: 10,
              color: colors.legendTextColor,
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: isMobile ? "70px" : "10px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },

          xAxis: [
            {
              type: "category",
              axisLine: { show: false },
              data: timeData,
              axisLabel: {
                color: colors.axisLabelColor,
                fontSize: 8,

                formatter: function (value: any) {
                  return format(new Date(+value * 1000), "dd/MM/yyyy");
                },
                margin: 15,
                // interval: Math.floor((marketPrice?.time || []).length / 20) - 1,
              },
              axisTick: { show: false },
              splitLine: { show: false },
            },
          ],
          yAxis: [
            {
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
              min: function (value: any) {
                return Math.floor(value.min - (value.max - value.min) * 0.2);
              },
              max: function (value: any) {
                return Math.ceil(value.max + (value.max - value.min) * 0.2);
              },
            },
            {
              type: "value", // Set y-axis to value type
              splitLine: {
                show: false,
              },
              axisLabel: {
                color: colors.axisLabelColor,
                fontSize: 8,
                formatter: function (value: any) {
                  return value === 0 ? "0" : formatNumber(value, 1) + "%";
                },
              },
              position: "right",
              min: function (value: any) {
                return Math.floor(value.min - (value.max - value.min) * 0.05);
              },
              max: function (value: any) {
                return Math.ceil(value.max + (value.max - value.min) * 0.05);
              },
            },
          ],
          series: [
            {
              name: "BotXNO",
              type: "line",
              data: botXNOData,
              smooth: true,
              areaStyle: {
                // Define a linear gradient
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 1,
                    color: "rgba(31, 173, 142, 0.05)",
                  },
                  {
                    offset:
                      maxBotXNOData > minBotXNOData
                        ? Math.max(
                            Math.min(
                              -minBotXNOData / (maxBotXNOData - minBotXNOData) +
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
                      maxBotXNOData > minBotXNOData
                        ? Math.max(
                            Math.min(
                              -minBotXNOData / (maxBotXNOData - minBotXNOData),
                              0.99,
                            ),
                            0.001,
                          )
                        : 0.5,
                    color: "rgba(255, 128, 182, 0.6)",
                  }, // Start color (red)
                  { offset: 0, color: "rgba(255, 128, 182, 0.05)" }, // End color (blue)
                ]),
                origin: 0,
              },
              lineStyle: {
                width: 1,
              },
              yAxisIndex: 1,
              symbol: "none",
              z: 1,
            },
            {
              name: isPhaiSinh ? "Chỉ số VN30F1M" : botInfo?.symbol,
              type: "line",
              data: chisoVN30Data,
              smooth: true,
              itemStyle: {
                color: "#FF80B6",
              },
              lineStyle: {
                width: 2,
              },
              symbol: "none",
              connectNulls: true,
              z: 2,
            },
            {
              name: "Mua",
              type: "scatter",
              data: scatterData,
              symbolSize: 8,
              tooltip: {
                trigger: "item", // Item tooltip for this series
                axisPointer: { z: 10 },
                formatter: function (params: any) {
                  return `<div class="text-left text-[14px] flex flex-col gap-[4px] text-white font-semibold">
                            <div class="text-sm font-semibold">${format(new Date(+params.name * 1000), "dd/MM/yyyy hh:mm")}</div>
                            <div class="flex items-center text-xs font-normal justify-between gap-2">
                              <div class="text-sm font-semibold text-foreground">${botInfo?.symbol + " "} <span class="text-xs text-muted">${botInfo?.freq}</span></div><div class="${params.data.data.type === "Long" ? "badge-green" : params.data.data.type === "Short" || !isPhaiSinh ? "badge-red" : "badge-yellow"}">${isPhaiSinh ? params.data.data.type : params.data.data.type === "Long" ? "Buy" : "Sell"} ${calculatePercent(params.data.data.change)}%</div><div class="text-sm"><span class="text-xs text-muted mr-1">Vùng giá </span>${formatNumber(params.data.data.price)}</div>
                            </div>
                          </div>`;
                },
              },
              z: 10,
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
                lte: 0.001,
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
        style={{ minHeight: "340px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
