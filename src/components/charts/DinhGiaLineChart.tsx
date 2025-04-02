import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { useMemo, useState } from "react";
import { cn, formatNumber } from "@/lib/utils";
import useChartColors from "./useChartColors";
import useTCBSPePbData from "@/hooks/useTCBSPePbData";
import { Select, SelectItem } from "../ui/Select";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

export default function DinhGiaLineChart({ symbol }: { symbol?: string }) {
  const [selectedTab, setSelectedTab] = useState("pe");
  const { data } = useTCBSPePbData(symbol);

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
      value: item[selectedTab],
    }));
  }, [data, selectedTab]);

  const giaHopLyData = useMemo(() => {
    if (!data) return [];
    return data?.map((item: any) => ({
      name: item.from.split("-").reverse().join("/"),
      value: selectedTab === "pe" ? item.industryPe : item.industryPb,
    }));
  }, [data, selectedTab]);

  const giaHopLyData10 = useMemo(() => {
    return giaHopLyData?.map((item: any) => ({
      ...item,
      value: item.value ? item.value * 0.1 : null,
    }));
  }, [giaHopLyData]);
  const giaHopLyData50 = useMemo(() => {
    return giaHopLyData?.map((item: any) => ({
      ...item,
      value: item.value ? item.value * 0.5 : null,
    }));
  }, [giaHopLyData]);

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

  const lastValue = formattedData[formattedData.length - 1]?.value || 0;
  const lastHopLyValue = giaHopLyData[giaHopLyData.length - 1]?.value || 0;
  const chenhLech = lastHopLyValue
    ? ((lastHopLyValue - lastValue) * 100) / lastHopLyValue
    : 0;

  return (
    <div className="border-border flex max-h-[600px] flex-1 flex-col gap-1 overflow-hidden rounded-[6px] border-1 p-2 pb-3">
      <div className="flex justify-between">
        <div className="text-sm">Định giá</div>
        {chenhLech ? (
          <div
            className={cn(
              "flex items-center rounded-full px-2 py-1 text-sm font-semibold text-black",
              chenhLech > 0 ? "bg-lineargreen" : "bg-linearred",
            )}
          >
            {selectedTab === "pe" ? "P/E" : "P/B"}{" "}
            {chenhLech > 0 ? "thấp hơn" : "cao hơn"} so với trung bình ngành{" "}
            {formatNumber(chenhLech as number, 2)}%
          </div>
        ) : null}
      </div>
      <ReactEChartsCore
        echarts={echarts}
        option={{
          animation: false,
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          tooltip: {
            confine: true,
            trigger: "axis",
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            formatter: function (params: any) {
              if (!params[0].data) return;
              const chenhlech =
                ((params[0].data.value - params[1].data.value) * 100) /
                params[0].data.value;
              return `<div class="flex flex-col gap-1 rounded-[4px] text-sm text-foreground">
                <div class="flex justify-between">
                  <div>So sánh ${selectedTab === "pe" ? "P/E" : "P/B"}</div>
                  <div>${params[0].data.name}</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-xs">${selectedTab === "pe" ? "P/E" : "P/B"}</div>
                  <div class="text-sm">${params[1].data.value}</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-xs">${selectedTab === "pe" ? "P/E" : "P/B"} trung bình ngành</div>
                  <div class="text-sm">${params[0].data.value}</div>
                </div>
                <div class="flex justify-between gap-2">
                  <div class="text-xs">Chênh lệch so với trung bình ngành</div>
                  <div class="text-sm">${formatNumber(chenhlech as number, 2)}%</div>
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
              name: "PE thị trường",
              type: "line",
              smooth: true,
              symbol: "none",
              lineStyle: {
                width: 2,
                color: "#1FAD8E",
              },
              data: giaHopLyData,
            },
            {
              type: "line",
              symbol: "none",
              name: "PE",
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
        style={{ minHeight: "350px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
      <div className="flex justify-center gap-5">
        <div>
          <Select
            variant="bordered"
            selectedKeys={[selectedTab]}
            onChange={(e) => setSelectedTab(e.target.value)}
            classNames={{
              value: "w-[60px]",
            }}
            size="sm"
          >
            <SelectItem key="pe">P/E</SelectItem>
            <SelectItem key="pb">P/B</SelectItem>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-1.5 w-3 rounded-[2px] bg-[#7B61FF]"></div>
          <div>{selectedTab === "pe" ? "P/E" : "P/B"}</div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-green-primary h-1.5 w-3 rounded-[2px]"></div>
          <div>
            {selectedTab === "pe"
              ? "P/E trung bình ngành"
              : "P/B trung bình ngành"}
          </div>
        </div>
      </div>
    </div>
  );
}
