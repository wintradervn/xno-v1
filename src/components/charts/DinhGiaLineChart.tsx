import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import useDNSEStockPriceData from "@/hooks/dnse/useDNSEStockPriceData";
import { useMemo } from "react";
import { format, min } from "date-fns";
import useChiSoTaiChinhData from "@/hooks/useChiSoTaiChinhData";
import { formatNumber, formatPrice } from "@/lib/utils";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

// const data = [
//   ["2024-10-25", 20.5], // Lower starting value
//   ["2024-10-26", 21.2],
//   ["2024-10-27", 22.8],
//   ["2024-10-28", 23.4],
//   ["2024-10-29", 24.1],
//   ["2024-10-30", 25.7],
//   ["2024-10-31", 26.3],
//   ["2024-11-01", 30.0],
//   ["2024-11-02", 32.5],
//   ["2024-11-03", 31.8], // slight decrease
//   ["2024-11-04", 35.2],
//   ["2024-11-05", 38.3],
//   ["2024-11-06", 37.6], // slight decrease
//   ["2024-11-07", 40.1],
//   ["2024-11-08", 42.4],
//   ["2024-11-09", 41.9], // slight decrease
//   ["2024-11-10", 44.7],
//   ["2024-11-11", 47.2],
//   ["2024-11-12", 49.1],
//   ["2024-11-13", 48.4], // slight decrease
//   ["2024-11-14", 51.3],
//   ["2024-11-15", 53.5],
//   ["2024-11-16", 55.8],
//   ["2024-11-17", 56.2], // slight increase
//   ["2024-11-18", 59.4],
//   ["2024-11-19", 60.0],
//   ["2024-11-20", 63.6],
//   ["2024-11-21", 65.1],
//   ["2024-11-22", 64.8], // slight decrease
//   ["2024-11-23", 66.3],
//   ["2024-11-24", 68.5],
//   ["2024-11-25", 70.2],
//   ["2024-11-26", 72.7],
//   ["2024-11-27", 75.4],
//   ["2024-11-28", 77.1],
//   ["2024-11-29", 76.6], // slight decrease
//   ["2024-11-30", 80.3],
// ];
// const randomData = [
//   ["2024-10-25", 20.0], // Starting point close to 20
//   ["2024-10-26", 22.8],
//   ["2024-10-27", 21.3],
//   ["2024-10-28", 24.5],
//   ["2024-10-29", 21.2],
//   ["2024-10-30", 24.9], // slight decrease
//   ["2024-10-31", 25.5],
//   ["2024-11-01", 29.5],
//   ["2024-11-02", 31.0], // slight decrease
//   ["2024-11-03", 34.5],
//   ["2024-11-04", 31.2],
//   ["2024-11-05", 33.7],
//   ["2024-11-06", 36.8], // slight decrease
//   ["2024-11-07", 43.5],
//   ["2024-11-08", 42.0],
//   ["2024-11-09", 40.3], // slight decrease
//   ["2024-11-10", 40.9],
//   ["2024-11-11", 47.1],
//   ["2024-11-12", 49.0], // slight decrease
//   ["2024-11-13", 51.5],
//   ["2024-11-14", 55.2],
//   ["2024-11-15", 53.4], // slight decrease
//   ["2024-11-16", 54.0],
//   ["2024-11-17", 53.9],
//   ["2024-11-18", 57.5], // slight increase
//   ["2024-11-19", 63.0],
//   ["2024-11-20", 57.7],
//   ["2024-11-21", 62.9], // slight decrease
//   ["2024-11-22", 67.3],
//   ["2024-11-23", 69.1],
//   ["2024-11-24", 65.5],
//   ["2024-11-25", 72.2],
//   ["2024-11-26", 68.5],
//   ["2024-11-27", 73.0], // slight decrease
//   ["2024-11-28", 68.3],
//   ["2024-11-29", 79.7],
//   ["2024-11-30", 79.0],
// ];

// const seriesData = data.map(function (item: any, index: number) {
//   return {
//     name: index,
//     value: item[1],
//   };
// });

// const seriesRandomData = randomData.map(function (item: any, index: number) {
//   return {
//     name: index,
//     value: item[1],
//   };
// });
// const data30 = data.map(function (item: any, index: number) {
//   return +(item[1] * 0.5).toFixed(2);
// });
// const data005 = data.map(function (item: any, index: number) {
//   return +(item[1] * 0.1).toFixed(2);
// });

export default function DinhGiaLineChart({ symbol }: { symbol?: string }) {
  const { data } = useDNSEStockPriceData(symbol);
  const { data: data2 } = useChiSoTaiChinhData(symbol, false);
  // const { data: data3 } = useChiSoTaiChinhData(symbol, true);

  const timeData = useMemo(() => {
    return data?.t?.map((time: number, index: number) => time * 1000);
  }, [data]);

  const formattedData = useMemo(() => {
    if (!data?.t) return [];
    return data?.t?.map((time: number, index: number) => ({
      name: time,
      value: data.c[index],
    }));
  }, [data]);

  // const EPSTTMData: Record<string, number | undefined> = useMemo(() => {
  //   if (!data2) return {};
  //   return {
  //     "0": data2.find((item) => item.year === 2023 && item.quarter === 4)
  //       ?.earningPerShare,
  //     "1": data2.find((item) => item.year === 2023 && item.quarter === 4)
  //       ?.earningPerShare,
  //     "2": data2.find((item) => item.year === 2023 && item.quarter === 4)
  //       ?.earningPerShare,
  //     "3": data2.find((item) => item.year === 2024 && item.quarter === 1)
  //       ?.earningPerShare,
  //     "4": data2.find((item) => item.year === 2024 && item.quarter === 1)
  //       ?.earningPerShare,
  //     "5": data2.find((item) => item.year === 2024 && item.quarter === 1)
  //       ?.earningPerShare,
  //     "6": data2.find((item) => item.year === 2024 && item.quarter === 2)
  //       ?.earningPerShare,
  //     "7": data2.find((item) => item.year === 2024 && item.quarter === 2)
  //       ?.earningPerShare,
  //     "8": data2.find((item) => item.year === 2024 && item.quarter === 2)
  //       ?.earningPerShare,
  //     "9": data2.find((item) => item.year === 2024 && item.quarter === 3)
  //       ?.earningPerShare,
  //     "10": data2.find((item) => item.year === 2024 && item.quarter === 3)
  //       ?.earningPerShare,
  //     "11": data2.find((item) => item.year === 2024 && item.quarter === 3)
  //       ?.earningPerShare,
  //   };
  // }, [data2]);

  // const EPSAvg5years = useMemo(() => {
  //   if (!data3) return 0;

  //   return (
  //     data3.slice(0, 5).reduce((acc, item) => item.earningPerShare + acc, 0) / 5
  //   );
  // }, [data3]);

  const giaHopLyData = useMemo(() => {
    if (!data || !data2) return [];
    return data?.t?.map((time: number, index: number) => {
      const date = new Date(time * 1000);
      let quarter = Math.floor(date.getMonth() / 3 + 1) - 1;
      let year = date.getFullYear();
      if (quarter === 0) {
        quarter = 4;
        year -= 1;
      }
      const lastQuaterIndex = data2.findIndex(
        (item) => item.year === year && item.quarter === quarter,
      );

      const EPSTTM = data2[lastQuaterIndex]?.earningPerShare;

      const EPSAvg5years =
        data2
          .slice(lastQuaterIndex, lastQuaterIndex + 5)
          .reduce((acc, item) => item.earningPerShare + acc, 0) / 5;

      if (!EPSTTM) return { name: time, value: null };
      return {
        name: time,
        value: (data.c[index] * EPSTTM) / EPSAvg5years,
      };
    });
  }, [data, data2]);

  const giaHopLyData10 = useMemo(() => {
    return giaHopLyData?.map((item) => ({
      ...item,
      value: item.value ? item.value * 0.1 : null,
    }));
  }, [giaHopLyData]);
  const giaHopLyData50 = useMemo(() => {
    return giaHopLyData?.map((item) => ({
      ...item,
      value: item.value ? item.value * 0.5 : null,
    }));
  }, [giaHopLyData]);

  const min = useMemo(
    () =>
      Math.min(
        ...giaHopLyData50.map((i) => i.value).filter((i) => i !== null),
        ...formattedData.map((i) => i.value).filter((i) => i !== null),
      ),
    [giaHopLyData50],
  );

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          animation: false,
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          tooltip: {
            trigger: "axis",
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontSize: 12,
              color: "white",
            },
            formatter: function (params: any) {
              const chenhlech =
                ((params[0].value - params[1].value) * 100) / params[1].value;
              return `<div class="flex flex-col gap-2 rounded-[4px] text-sm">
                <div>${format(+params[0].axisValue, "dd/MM/yyyy")}</div>
                <div>Giá thị trường: ${formatNumber(params[1].value, 2)}</div>
                <div>Giá hợp lý: ${formatNumber(params[0].value, 2)}</div>
                <div>Chênh lệch Upside: ${formatNumber(chenhlech, 2)}%</div>
              </div>`;
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "20px", // Remove bottom padding
            left: "40px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: timeData,
            axisLine: { show: false },
            axisLabel: {
              formatter: function (value: any) {
                return format(new Date(+value), "dd/MM");
              },
              color: "#98A2B3",
              fontSize: 8,
            },
            axisTick: { show: false },
            splitLine: { show: false },
          },
          yAxis: {
            position: "right",
            type: "value", // Set y-axis to value type
            splitLine: {
              lineStyle: {
                color: "#1D2939",
                show: false,
              },
            },
            axisLabel: {
              color: "#98A2B3",
              fontSize: 10,
            },
            min: Math.floor(min - 5 - ((min - 5) % 10)),
          },

          series: [
            {
              type: "line",
              smooth: true,
              symbol: "none",
              lineStyle: {
                width: 2,
                color: "black",
              },
              data: giaHopLyData,
            },
            {
              type: "line",
              symbol: "none",
              lineStyle: {
                width: 4,
                color: "#7B61FF",
              },
              data: formattedData,
            },
            // { type: "themeRiver", data: data2 },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              smooth: true,
              data: giaHopLyData50,
              symbol: "none",
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: {
                color: "#38C9A7",
                opacity: 0.7,
              },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#67E1C1", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "-30%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#9FF0D7", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "-20%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#CFF8EB", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "-10%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
                color: "transparent",
              },
              areaStyle: { color: "#F1FCF9", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "0%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },

            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FFFAFA", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "10%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FEF3F2", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "20%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FEE4E2", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
              endLabel: {
                show: true,
                formatter: () => "30%",
                color: "white",
                fontSize: 10,
                distance: -25,
              },
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FECDC9", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
            },
            {
              type: "line",
              stack: "Total",
              lineStyle: {
                width: 0,
              },
              areaStyle: { color: "#FDA19B", opacity: 0.7 },
              smooth: true,
              data: giaHopLyData10,
              symbol: "none",
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
