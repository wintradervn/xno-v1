import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useIsMobile from "@/hooks/useIsMobile";
import { use, useEffect, useRef, useState } from "react";
import useChartColors from "./useChartColors";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

const label = {
  show: true,
  rotate: 90,
  formatter: function (params: any) {
    return Math.abs(params.value) < 10 ? "" : params.value;
  },
  textStyle: {
    color: "black",
    fontFamily: "Manrope, Manrope Fallback",
    fontSize: 14,
    fontWeight: 700,
  },
};

const series = [
  {
    data: [
      -50, -60, -66, -70, -60, -70, -63, -64, -75, -65, -56, -65, -75, -80, -81,
      -70, -64, -77, -74,
    ],
    type: "bar",
    stack: "a",
    name: "Tự doanh",
    itemStyle: { borderRadius: [0, 0, 6, 6], color: "#FF135B" },
    label: label,
    barWidth: "26px",
  },
  {
    data: [
      50, 20, 32, 60, 20, 30, 33, 34, 35, 36, 36, 38, 29, 30, 31, 40, 21, 32,
      14,
    ],
    type: "bar",
    stack: "a",
    name: "Khối ngoại",
    itemStyle: {
      color: "#1FAD8E",
    },
    label: label,
    barWidth: "26px",
  },
  {
    data: [
      20, 40, 42, 21, 20, 20, 23, 24, 25, 26, 27, 28, 29, 30, 31, 30, 21, 32,
      14,
    ],
    type: "bar",
    stack: "a",
    name: "Cá nhân + Tổ chức",
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: "#b3f7e0",
    },
    label: label,
    barWidth: "26px",
  },
  {
    data: [
      20, 40, 42, 21, 11, 1, -10, -20, -15, 15, 20, -20, -29, -30, -31, -30,
      -21, -32, -54,
    ],
    type: "line",
    name: "KL HĐ mở (OI)",
    lineStyle: {
      // Define the gradient color
      color: {
        type: "radial",
        x: 0,
        y: 0,
        r: 1,
        colorStops: [
          { offset: 0, color: "#CFDBF8" }, // Start color (red)
          { offset: 1, color: "#2D84FF" }, // End color (blue)
        ],
        global: false, // false by default
      },
    },
    barWidth: "26px",
    symbol: "none",
  },
  {
    data: [
      -20, -40, -42, -21, -11, -1, 10, 20, 15, -15, -20, 20, 29, 30, 31, 30, 21,
      32, 54,
    ],
    type: "line",
    name: "Basis",
    color: {
      type: "radial",
      x: 0,
      y: 0,
      r: 1,
      colorStops: [
        { offset: 0, color: "#FFFBD6" }, // Start color (red)
        { offset: 1, color: "#F1C617" }, // End color (blue)
      ],
      global: false, // false by default
    },
    barWidth: "26px",
    symbol: "none",
  },
  {
    data: [
      10, 20, 25, 40, 40, 40, 35, 30, 25, 20, 15, 10, 5, 0, -5, -10, -15, 10,
      -25,
    ],
    type: "line",
    name: "VN30F1M",
    color: {
      type: "radial",
      x: 0,
      y: 0,
      r: 1,
      colorStops: [
        { offset: 0, color: "#FBE5FF" }, // Start color (red)
        { offset: 1, color: "#EC75FF" }, // End color (blue)
      ],
      global: false, // false by default
    },
    barWidth: "26px",
    symbol: "circle",
    symbolSize: 8,
  },
];

export default function ViThePhaiSinhRongBarChart() {
  const [numberOfData, setNumberOfData] = useState(20);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const colors = useChartColors();

  useEffect(() => {
    const handleResize = (entries: Array<any>) => {
      let width = entries[0].contentRect.width;
      let number = 20;

      if (width > 600) {
        number = 20;
      } else if (width > 400) {
        number = 12;
      } else {
        number = 8;
      }
      setNumberOfData(number);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="flex-1"
      ref={wrapperRef}
      onResize={() => console.log("resized")}
    >
      <ReactEChartsCore
        echarts={echarts}
        option={{
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          tooltip: {
            confine: true,
            trigger: "axis",
            formatter: function (params: any) {
              return `
                  <div class="text-white text-left text-xs font-medium flex flex-col gap-1">
                      <div class="flex gap-2 items-center flex-nowrap w-40"><div class="w-2 h-2 bg-red rounded-[2px]"></div> <div>Tự doanh:</div><div class="text-sm font-semibold text-red">${params[0].value}</div></div>
                      <div class="flex gap-2 items-center flex-nowrap w-40"><div class="w-2 h-2 bg-[#1FAD8E] rounded-[2px]"></div> <div>Khối ngoại:</div><div class="text-sm font-semibold text-[#1FAD8E]">${params[1].value}</div></div>
                      <div class="flex gap-2 items-center flex-nowrap w-40"><div class="w-2 h-2 bg-[#b3f7e0] rounded-[2px]"></div> <div>Cá nhân & TCTN:</div><div class="text-sm font-semibold text-[#b3f7e0]">${params[2].value}</div></div>
                      <div class="flex gap-2 items-center flex-nowrap w-40"><div class="w-2 h-2 bg-[#2D84FF] rounded-[2px]"></div> <div>KL HĐ mở (OI):</div><div class="text-sm font-semibold text-[#2D84FF]">${params[3].value}</div></div>
                      <div class="flex gap-2 items-center flex-nowrap w-40"><div class="w-2 h-2 bg-[#F1C617] rounded-[2px]"></div> <div>Basis:</div><div class="text-sm font-semibold text-[#F1C617]">${params[4].value}</div></div>
                      
                  </>
              `;
            },
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
          },
          legend: {
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 10,
            textStyle: {
              color: colors.legendTextColor,
            },
            bottom: "bottom",
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: numberOfData === 20 ? "40px" : "70px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              formatter: function (value: any) {
                return "25/10/2024";
              },
              color: colors.axisLabelColor,
              fontSize: 10,
            },
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
              fontSize: 12,
            },
          },
          series: series.map((item) => ({
            ...item,
            data: item.data.slice(-numberOfData),
          })),
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{
          minHeight: "500px",
          minWidth: "300px",
          height: "100%",
          width: "100%",
        }}
      ></ReactEChartsCore>
    </div>
  );
}
