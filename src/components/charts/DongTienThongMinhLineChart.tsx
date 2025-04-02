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
import useIsMobile from "@/hooks/useIsMobile";
import useChartColors from "./useChartColors";
import useTheme from "@/hooks/useTheme";
import useDongTienThongMinh from "@/hooks/api-v2/useDongTienThongMinh";
import { useMemo } from "react";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import { formatNumber, formatPrice } from "@/lib/utils";
import useDNSEStockPriceData from "@/hooks/dnse/useDNSEStockPriceData";
import DefaultLoader from "../ui/DefaultLoader";
import DefaultNodata from "../ui/DefaultNodata";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

export default function DongTienThongMinhLineChart() {
  const isMobile = useIsMobile();
  const colors = useChartColors();
  const { currentSymbol } = useCurrentSymbol();
  const { isLightMode } = useTheme();

  const { data: dongTienThongMinhData, isLoading: isLoading1 } =
    useDongTienThongMinh(currentSymbol);
  const { data: priceData, isLoading: isLoading2 } = useDNSEStockPriceData({
    symbol: currentSymbol,
    resolution: "30",
    range: 30,
  });

  const dateData = useMemo(() => {
    if (!dongTienThongMinhData) return [];
    return dongTienThongMinhData.NL_arr.map((item) => item.label);
  }, [dongTienThongMinhData]);
  const dongTienNhoLeData = useMemo(() => {
    if (!dongTienThongMinhData) return [];
    return dongTienThongMinhData.NL_arr.map((item) => item.y);
  }, [dongTienThongMinhData]);
  const dongTienDauCoData = useMemo(() => {
    if (!dongTienThongMinhData) return [];
    return dongTienThongMinhData.DC_arr.map((item) => item.y);
  }, [dongTienThongMinhData]);
  const dongTienToChucData = useMemo(() => {
    if (!dongTienThongMinhData) return [];
    return dongTienThongMinhData.TC_arr.map((item) => item.y);
  }, [dongTienThongMinhData]);

  if (isLoading1 || isLoading2) return <DefaultLoader />;
  if (!dongTienThongMinhData || !priceData) return <DefaultNodata />;

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          tooltip: {
            confine: true,
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[14px] flex flex-col gap-[4px] text-white font-semibold">
                <div class="text-md font-semibold">${params[0]?.name}</div>
                <div class="flex items-center text-xs font-normal justify-between gap-4"><div>${params[0]?.marker} ${params[0]?.seriesName}</div> <div>${formatNumber(params[0]?.value)} cp</div></div>
                <div class="flex items-center text-xs font-normal justify-between gap-4"><div>${params[1]?.marker} ${params[1]?.seriesName}</div> <div>${formatNumber(params[1]?.value)} cp</div></div>
                <div class="flex items-center text-xs font-normal justify-between gap-4"><div>${params[2]?.marker} ${params[2]?.seriesName}</div> <div>${formatNumber(params[2]?.value)} cp</div></div>
                <div class="flex items-center text-xs font-normal justify-between gap-4"><div>${params[3]?.marker} ${params[3]?.seriesName}</div> <div>${formatPrice(params[3]?.value * 1000)}</div></div>
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
          legend: {
            bottom: "bottom",
            left: "center",
            itemWidth: 14,
            width: 500,
            textStyle: {
              color: colors.legendTextColor,
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: isMobile ? 10 : 12,
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: isMobile ? "70px" : "60px", // Remove bottom padding
            left: "30px", // Optional: Adjust left padding
            right: "30px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              axisLine: { show: false },
              axisLabel: {
                color: colors.axisLabelColor,
                fontSize: 10,
                formatter: function (value: any) {
                  return value.slice(0, 5);
                },
              },
              data: dateData,
              axisTick: { show: false },
              splitLine: { show: false },
            },
            {
              type: "category",
              axisLine: { show: false },
              axisLabel: {
                show: false,
              },
              axisPointer: {
                show: false, // Disable pointer for this axis
              },
              data: priceData?.t ?? [],
              axisTick: { show: false },
              splitLine: { show: false },
              min: 0,
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
            },
            {
              type: "value", // Set y-axis to value type
              splitLine: {
                show: false,
              },
              axisLabel: {
                color: colors.axisLabelColor,
                fontSize: 10,
              },
              min: priceData ? Math.floor(Math.min(...priceData.c) * 0.99) : 0,
              max: priceData ? Math.ceil(Math.max(...priceData.c) * 1.01) : 0,
            },
          ],
          series: [
            {
              name: "Dòng tiền nhỏ lẻ",
              type: "bar",
              clip: true,
              data: dongTienNhoLeData,
              stack: "a",
              itemStyle: {
                color: "#9385FF",
              },
            },
            {
              name: "Dòng tiền đầu cơ",
              type: "bar",
              clip: true,
              data: dongTienDauCoData,
              stack: "a",
              itemStyle: {
                color: "#1FAD8E",
              },
            },
            {
              name: "Dòng tiền tổ chức",
              type: "bar",
              clip: true,
              data: dongTienToChucData,
              stack: "a",
              itemStyle: {
                color: "#67E1C0",
              },
            },
            {
              name: "Giá cổ phiếu",
              type: "line",
              data: priceData?.c ?? [],
              smooth: true,
              itemStyle: {
                color: isLightMode ? "#000000" : "#ffffff",
              },
              symbol: "none",
              yAxisIndex: 1,
              xAxisIndex: 1,
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ minHeight: "400px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
