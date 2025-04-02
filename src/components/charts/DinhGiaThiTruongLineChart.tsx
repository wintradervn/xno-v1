import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { useMemo, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";
import useChartColors from "./useChartColors";
import useTCBSPePbData from "@/hooks/useTCBSPePbData";
import Checkbox from "../ui/Checkbox";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  MarkLineComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
]);

const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day).getTime() / 1000;
};

export default function DinhGiaThiTruongLineChart({
  symbol,
  timeframe,
}: {
  symbol?: string;
  timeframe?: string;
}) {
  const [selectedTab, setSelectedTab] = useState("pe");
  const { data, rootData } = useTCBSPePbData(symbol);

  const colors = useChartColors();

  const timeData = useMemo(() => {
    return data
      ?.map((item: any) => item.from)
      .map((time: string) => time.split("-").reverse().join("/"));
  }, [data]);

  const formattedData = useMemo(() => {
    if (!data) return [];
    return data?.map((item: any) => ({
      name: item.from.split("-").reverse().join("/"),
      value: selectedTab === "pe" ? item.indexPe : item.indexPb,
    }));
  }, [data, selectedTab]);

  const giaHopLyData10 = useMemo(() => {
    return formattedData?.map((item: any) => ({
      ...item,
      value: item.value ? item.value * 0.1 : null,
    }));
  }, [formattedData]);
  const giaHopLyData50 = useMemo(() => {
    return formattedData?.map((item: any) => ({
      ...item,
      value: item.value ? item.value * 0.5 : null,
    }));
  }, [formattedData]);

  const min = useMemo(
    () =>
      Math.min(
        // ...giaHopLyData50.map((i) => i.value).filter((i) => i !== null),
        ...formattedData
          .map((i: any) => i.value)
          .filter((i: any) => i !== null),
      ),
    [giaHopLyData50],
  );

  const start = useMemo(() => {
    if (!timeData || !timeframe) return 0;
    let minDate = "";
    timeData.forEach((item: string) => {
      const date = parseDate(item);
      const timestamp =
        new Date().getTime() / 1000 - 86400 * 365 * +timeframe[0]; //
      if (date < timestamp) {
        minDate = item;
      }
    });

    return (timeData.indexOf(minDate) / (timeData.length - 1)) * 100 || 0;
  }, [timeframe, timeData]);

  const lastValue = formattedData[formattedData.length - 1]?.value || 0;
  const trungVi =
    selectedTab === "pe" ? rootData?.medianIndexPe : rootData?.medianIndexPb;
  const chenhLech =
    lastValue && trungVi ? ((trungVi - lastValue) * 100) / trungVi : 0;

  return (
    <div className="border-border flex max-h-[600px] flex-1 flex-col gap-1 overflow-hidden rounded-[6px] border-1 p-2 pb-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex w-[66px] justify-center rounded-[4px] border-1 p-1.5">
            <Checkbox
              classNames={{ base: "!bg-transparent" }}
              radius="full"
              isSelected={selectedTab === "pe"}
              onChange={() => setSelectedTab("pe")}
            >
              P/E
            </Checkbox>{" "}
          </div>
          <div className="flex w-[66px] justify-center rounded-[4px] border-1 p-1.5">
            <Checkbox
              classNames={{ base: "!bg-transparent" }}
              radius="full"
              isSelected={selectedTab === "pb"}
              onChange={() => setSelectedTab("pb")}
            >
              P/B
            </Checkbox>{" "}
          </div>
          <div className="">Thị trường Việt Nam</div>
        </div>
        {chenhLech !== undefined ? (
          <div
            className={cn(
              "flex items-center rounded-full px-2 py-1 text-sm font-semibold text-black",
              chenhLech > 0
                ? "bg-lineargreen"
                : chenhLech < 0
                  ? "bg-linearred"
                  : "bg-linearyellow",
            )}
          >
            {selectedTab === "pe" ? "P/E" : "P/B"}{" "}
            {chenhLech > 0
              ? "thấp hơn so"
              : chenhLech < 0
                ? "cao hơn so"
                : "bằng"}
            với trung vị {chenhLech ? formatNumber(chenhLech as number, 2) : 0}%
          </div>
        ) : null}
      </div>
      <ReactEChartsCore
        echarts={echarts}
        option={{
          dataZoom: {
            type: "inside",
            start: start,
          },
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          tooltip: {
            confine: true,
            trigger: "axis",
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            formatter: function (params: any) {
              if (!params[0].data) return;

              return `<div class="flex flex-col gap-1 rounded-[4px] text-sm text-foreground">
                <div class="flex justify-between">
                  <div>${params[0].data.name}</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-xs"><span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${colors.legendTextColor};\"></span>${params[0].seriesName}</div>
                  <div class="text-sm">${params[0].data.value}</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-xs"><span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${colors.yellow};\"></span> ${selectedTab === "pe" ? "P/E" : "P/B"} trung vị</div>
                  <div class="text-sm">${trungVi}</div>
                </div>
              </div>`;
            },
          },
          grid: {
            top: "10px",
            bottom: "10px",
            left: "10px",
            right: "10px",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: timeData,
            axisLine: { show: false },
            axisLabel: {
              color: colors.axisLabelColor,
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
                color: colors.splitLineColor,
                show: false,
              },
            },
            axisLabel: {
              color: colors.axisLabelColor,
              fontSize: 10,
              formatter: (value: any) => formatNumber(value, 1),
            },
            min: Math.floor(min - 5 - ((min - 5) % 10)),
          },

          series: [
            {
              type: "line",
              symbol: "none",
              name: selectedTab === "pe" ? "Chỉ số P/E" : "Chỉ số P/B",
              lineStyle: {
                width: 2,
                color: colors.legendTextColor,
              },
              data: formattedData,
              markLine: rootData
                ? {
                    animation: false,
                    silent: true,
                    symbol: "none",
                    lineStyle: {
                      color: colors.yellow,
                      dash: [10, 10],
                      width: 2,
                    },
                    label: {
                      show: false,
                    },
                    data: [
                      {
                        yAxis: rootData
                          ? selectedTab === "pe"
                            ? rootData.medianIndexPe
                            : rootData.medianIndexPb
                          : 0,
                      },
                    ],
                  }
                : undefined,
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
                color: colors.legendTextColor,
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
                color: colors.legendTextColor,
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
                color: colors.legendTextColor,
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
                color: colors.legendTextColor,
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
                color: colors.legendTextColor,
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
                color: colors.legendTextColor,
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
                color: colors.legendTextColor,
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
        style={{ minHeight: "400px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
      <div className="flex justify-center gap-5">
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-foreground h-1.5 w-3 rounded-[2px]"></div>
          <div>{selectedTab === "pe" ? "Chỉ số P/E" : "Chỉ số P/B"}</div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-yellow h-1.5 w-3 rounded-[2px]"></div>
          <div>{selectedTab === "pe" ? "P/E trung vị" : "P/B trung vị"}</div>
        </div>
      </div>
    </div>
  );
}
