import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomInsideComponent,
  DataZoomComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useChartColors from "./useChartColors";
import useGiaoDichNoiBo, {
  IGiaoDichNoiBo,
} from "@/hooks/api-v2/useGiaoDichNoiBo";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useDNSEStockPriceData from "@/hooks/dnse/useDNSEStockPriceData";
import { useMemo } from "react";
import { format } from "date-fns";
import { formatNumber } from "@/lib/utils";
import useClientSize from "@/hooks/useClientSize";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
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
  ["24/09/2019", 33],
  ["10/07/2024", 44],
];

export default function GiaoDichNoiBoLineChart() {
  const colors = useChartColors();
  const { currentSymbol } = useCurrentSymbol();
  const { data: giaoDichNoiBo } = useGiaoDichNoiBo(currentSymbol);
  const { data: stockPriceData } = useDNSEStockPriceData({
    symbol: currentSymbol,
    resolution: "1W",
    range: 2000,
  });

  const [ref, width] = useClientSize<HTMLDivElement>();

  const isSmallScreen = width < 500;

  const timeData = useMemo(() => {
    if (!stockPriceData) return [];
    const { t } = stockPriceData;
    return t
      .map((timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return format(date, "MM/yyyy");
      })
      .filter((item, index, arr) => {
        return arr.indexOf(item) === index;
      });
  }, [stockPriceData]);

  const priceData = useMemo(() => {
    if (!stockPriceData) return [];
    const temp: any = {};
    stockPriceData.t.forEach((timestamp: number, index: number) => {
      const date = new Date(timestamp * 1000);
      const monthString = format(date, "MM/yyyy");
      if (temp[monthString]) {
        temp[monthString].push(stockPriceData.c[index]);
      } else {
        temp[monthString] = [stockPriceData.c[index]];
      }
    });
    const B = Object.values(temp).map((item: any) => {
      const sum = item.reduce((acc: number, value: number) => acc + value, 0);
      const avg = sum / item.length;
      return +formatNumber(avg, 2);
    });
    return B ?? [];
  }, [stockPriceData]);

  const tradeData = useMemo(() => {
    if (!giaoDichNoiBo) return [];
    const temp: any = {};

    return giaoDichNoiBo
      .filter((item) => !!item.averagePrice)
      .map((item) => {
        const timeString = format(new Date(item.tradingTime), "MM/yyyy");
        temp[timeString] = (temp[timeString] || 0) + 1;
        const index = timeData.indexOf(timeString);
        const price = priceData[index] ?? 0;
        return {
          value: [timeString, (price ?? 0) * (0.98 - 0.07 * temp[timeString])],
          itemStyle: { color: item.side === "buy" ? colors.green : colors.red },
          item,
        };
      });
  }, [giaoDichNoiBo, priceData, timeData]);

  return (
    <div className="flex-1" ref={ref}>
      <ReactEChartsCore
        echarts={echarts}
        option={{
          color: [colors.purple, colors.green, colors.red],
          dataZoom: [
            {
              type: "inside",
            },
          ],
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          tooltip: {
            confine: true,
            trigger: "axis",
            formatter: function (params: any) {
              const tradeList = params.filter(
                (d: any) => d.seriesType === "scatter",
              );
              if (!tradeList.length) return null;

              return `<div class="flex items-stretch">
            ${
              !isSmallScreen
                ? `<div class="relative h-full self-stretch bg-red w-[2px] px-2">
                  <div class="absolute w-[2px] bg-lineargreen" style="height:${(tradeList.length - 1) * 46}px; top:23px;"> </div>
                  ${tradeList
                    .map((_: any, index: number) => {
                      return `
                      <div class="absolute w-1 h-1 rounded-full bg-lineargreen -translate-x-[1px] -translate-y-0.5" style="top:${23 + index * 46}px;"></div>
                    `;
                    })
                    .join("")}
              </div>`
                : ""
            }
            <div class="flex flex-col px-2">
              ${tradeList
                .map((trade: any) => trade.data.item)
                .map((item: IGiaoDichNoiBo) => {
                  const isBuy = item.side === "buy";
                  return `<div class="h-[46px] py-1 grid items-center gap-2 text-nowrap ${isSmallScreen ? "text-xs grid-cols-[1fr_2fr_1.4fr]" : "text-sm grid-cols-[1fr_2fr_1.4fr_1fr]"} font-medium text-muted border-[#151A24] not-last:border-b-1">
                    <div>${format(item.tradingTime, "dd/MM/yyyy")}</div>
                    <div class="text-wrap line-clamp-2 truncate text-foreground">${item.insiderName}</div>
                    <div class="${isSmallScreen ? "flex flex-col items-start" : "contents"}">
                      <div class="flex items-center gap-2 shrink-0"><div class="shrink-0">${isBuy ? BuyIcon({ isSmall: isSmallScreen }) : SellIcon({ isSmall: isSmallScreen })}</div> <div class="shrink-0 text-foreground">${formatNumber(Math.abs(item.volume))}<span class="text-muted"> cp</span></div></div>
                      <div class="flex justify-end gap-2 ${isBuy ? "text-green-main dark:text-lineargreen" : "text-linearred"}"><div>${isSmallScreen ? "Giá" : isBuy ? "Giá mua" : "Giá bán"}</div><div class="text-foreground">${item.averagePrice ? formatNumber(item.averagePrice / 1000, 2) : ""}</div></div>
                    </div>
                  </div>`;
                })
                .join("")}
            </div></div>`;
            },
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
            },
            padding: isSmallScreen ? 0 : 5,
          },
          grid: {
            top: "5px", // Remove top padding
            bottom: "25px", // Remove bottom padding
            left: "5px", // Optional: Adjust left padding
            right: "5px", // Optional: Adjust right padding
            containLabel: true,
          },
          legend: {
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 25,
            textStyle: {
              color: colors.legendTextColor,
            },
            bottom: "bottom",
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              // formatter: function (value: any) {
              //   return value.split("/")[0]; // Remove year from x-axis
              // },
              color: colors.axisLabelColor,
              fontSize: 8,
            },
            data: timeData,
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
            max: function (value: any) {
              const range = value.max - value.min;
              return Math.round(Math.floor(value.max + range * 0.25) / 5) * 5;
            },
            min: function (value: any) {
              const range = value.max - value.min;
              return Math.max(
                Math.round(Math.floor(value.min - range * 0.25) / 5) * 5,
                0,
              );
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
                color: colors.purple,
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
              data: priceData,
            },
            {
              type: "scatter",
              data: tradeData.filter((trade) => trade.item.side === "buy"),
              name: "Mua",
              itemStyle: { color: colors.green },
            },
            {
              type: "scatter",
              data: tradeData.filter((trade) => trade.item.side === "sell"),
              name: "Bán",
              itemStyle: { color: colors.red },
            },
            // {
            //   type: "scatter",
            //   data: sellData,
            //   itemStyle: { color: colors.red },
            //   name: "Bán",
            // },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ minHeight: "200px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}

function BuyIcon({ isSmall }: { isSmall?: boolean }) {
  return `<svg
      width="${isSmall ? "16" : "26"}"
      height="${isSmall ? "16" : "27"}"
      viewBox="0 0 26 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        y="0.5"
        width="26"
        height="26"
        rx="8"
        fill="url(#paint0_linear_32825_419936)"
      />
      <path
        d="M8.73648 18.5V9.86H9.87048L13.0025 16.358L16.1165 9.86H17.2625V18.494H16.0745V12.584L13.2845 18.5H12.7145L9.91848 12.584V18.5H8.73648Z"
        fill="#0D0D0D"
      />
      <defs>
        <linearGradient
          id="paint0_linear_32825_419936"
          x1="0"
          y1="0.5"
          x2="26"
          y2="26.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#CFF8EA" />
          <stop offset="1" stop-color="#67E1C0" />
        </linearGradient>
      </defs>
    </svg>`;
}
function SellIcon({ isSmall }: { isSmall?: boolean }) {
  return `<svg
      width="${isSmall ? "16" : "26"}"
      height="${isSmall ? "16" : "27"}"
      viewBox="0 0 26 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        y="0.5"
        width="26"
        height="26"
        rx="8"
        fill="url(#paint0_linear_32825_419964)"
      />
      <path
        d="M10.09 18.5V9.86H13.486C14.034 9.86 14.494 9.972 14.866 10.196C15.238 10.42 15.518 10.71 15.706 11.066C15.894 11.418 15.988 11.79 15.988 12.182C15.988 12.658 15.87 13.066 15.634 13.406C15.402 13.746 15.088 13.978 14.692 14.102L14.68 13.808C15.232 13.944 15.656 14.21 15.952 14.606C16.248 14.998 16.396 15.456 16.396 15.98C16.396 16.488 16.294 16.93 16.09 17.306C15.89 17.682 15.596 17.976 15.208 18.188C14.824 18.396 14.358 18.5 13.81 18.5H10.09ZM11.362 17.306H13.618C13.902 17.306 14.156 17.252 14.38 17.144C14.608 17.036 14.786 16.882 14.914 16.682C15.046 16.478 15.112 16.236 15.112 15.956C15.112 15.696 15.054 15.462 14.938 15.254C14.826 15.042 14.662 14.876 14.446 14.756C14.234 14.632 13.984 14.57 13.696 14.57H11.362V17.306ZM11.362 13.388H13.468C13.7 13.388 13.908 13.342 14.092 13.25C14.28 13.154 14.428 13.018 14.536 12.842C14.648 12.662 14.704 12.446 14.704 12.194C14.704 11.858 14.592 11.582 14.368 11.366C14.144 11.15 13.844 11.042 13.468 11.042H11.362V13.388Z"
        fill="#0D0D0D"
      />
      <defs>
        <linearGradient
          id="paint0_linear_32825_419964"
          x1="0"
          y1="0.5"
          x2="26"
          y2="26.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFCCE2" />
          <stop offset="1" stop-color="#FF135B" />
        </linearGradient>
      </defs>
    </svg>`;
}
