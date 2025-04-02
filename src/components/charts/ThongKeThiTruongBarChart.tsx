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
import { useMemo } from "react";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

const label = {
  show: true,
  rotate: 90,
  formatter: function (params: any) {
    return Math.abs(params.value) < 10 ? "" : Math.abs(params.value);
  },
  textStyle: {
    color: "black",
    fontFamily: "Manrope, Manrope Fallback",
    fontSize: 14,
    fontWeight: 700,
  },
};

export default function ThongKeThiTruongBarChart({ data }: { data: any }) {
  const compiledData: any = useMemo(() => {
    if (!data) return [];
    const newData = data.map((item: any) => ({
      ...item,
      percentChangeVsLast20Days:
        item.dayVolume && item.avgDay20Vol
          ? item.dayVolume / item.avgDay20Vol
          : 0,
      pricePercentvsHigh52Week:
        item.price && item.highWeek52Price
          ? item.price / item.highWeek52Price
          : 0,
      pricePercentvsLow52Week:
        item.price && item.lowWeek52Price
          ? item.price / item.lowWeek52Price
          : 0,
    }));
    const a = {
      bungno: [...newData].filter(
        (item) => item.avgDay20Vol && item.percentChangeVsLast20Days > 1.5,
      ).length,
      cancung: [...newData].filter(
        (item) =>
          item.avgDay20Vol &&
          item.percentChangeVsLast20Days < 0.35 &&
          item.percentChangeVsLast20Days > 0,
      ).length,
      vuotdinh: [...newData].filter(
        (item) => item.pricePercentvsHigh52Week >= 0.95,
      ).length,
      phaday: [...newData].filter(
        (item) =>
          item.pricePercentvsLow52Week >= 1 &&
          item.pricePercentvsLow52Week <= 1.05,
      ).length,
      tangManh: [...newData].filter((item) => item.dayChangePercent > 10)
        .length,
      giamManh: [...newData].filter((item) => item.dayChangePercent < -10)
        .length,
      tong: newData.length,
    };
    return a;
  }, [data]);
  const heheData = [
    {
      type: "bar",
      stack: "a",
      name: "tang",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "rgba(207, 248, 234, 1)" },
          { offset: 1, color: "rgba(103, 225, 192, 1)" },
        ]),
        borderRadius: [14, 14, 0, 0],
      },
      data: [
        { value: compiledData.tangManh, name: "Tăng mạnh" },
        { value: compiledData.bungno, name: "Bùng nổ KL" },
        { value: compiledData.vuotdinh, name: "Vượt đỉnh" },
      ],
      barWidth: 50,
      label: label,
    },
    {
      type: "bar",
      stack: "a",
      name: "giam",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "rgba(255, 204, 226, 1)" },
          { offset: 1, color: "rgba(255, 19, 91, 1)" },
        ]),
        borderRadius: [0, 0, 14, 14],
      },
      barWidth: 50,
      data: [
        { value: -compiledData.giamManh, name: "Giảm mạnh" },
        { value: -compiledData.cancung, name: "Cạn cung" },
        { value: -compiledData.phaday, name: "Phá đáy" },
      ],
      label: label,
    },
  ];

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
            formatter: function (params: any) {
              return `
                  <div class="text-white text-left text-xs font-medium flex flex-col gap-1">
                  <div class="flex gap-2 items-center flex-nowrap w-40"><div class="w-2 h-2 bg-[#67E1C0] rounded-[2px]"></div> <div class="text-sm">${params[0].name}:</div><div class="text-sm font-semibold text-[#67E1C0]">${params[0].value}</div></div>
                  <div class="flex gap-2 items-center flex-nowrap w-40"><div class="w-2 h-2 bg-[#FF135B] rounded-[2px]"></div> <div class="text-sm">${params[1].name}:</div><div class="text-sm font-semibold text-red">${Math.abs(params[1].value)}</div></div>
                  
              `;
            },
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "0px", // Remove bottom padding
            left: "0px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: [
              "Thống kê biến động",
              "Thống kê đột biến",
              "Vượt đỉnh/Phá đáy",
            ],
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
          series: heheData,
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
