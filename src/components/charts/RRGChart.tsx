"use client";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  TitleComponent,
  GridComponent,
  GraphicComponent,
  MarkAreaComponent,
  DataZoomComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useRRGData from "@/hooks/useRRGData";
import { Tab } from "@heroui/react";
import Tabs from "../ui/Tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import Button from "../ui/Button";
import ThemMaCKModal from "@/app/(main-layout)/(customable-layout)/bang-gia/ThemMaCKModal";
import { formatNumber, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useIsMobile from "@/hooks/useIsMobile";
import useChartColors from "./useChartColors";
import useTheme from "@/hooks/useTheme";

echarts.use([
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
  MarkAreaComponent,
  LineChart,
  DataZoomComponent,
  GridComponent,
  GraphicComponent,
]);

const colors = [
  "#ff2121",
  "rgb(255, 250, 255)",
  "#1b0bff",
  "#00ff0d",
  "#ff19b7",
  "#ffeb00",
  "#ff9b00",
  "#00ffeb",
  "#fd00ff",
];

export default function RRGChart() {
  const { currentSymbol } = useCurrentSymbol();
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState(70);
  const [isOpenThemMaCK, setOpenThemMaCK] = useState(false);
  const listSymbol = useMemo(
    () => [currentSymbol, ...selectedSymbols],
    [selectedSymbols, currentSymbol],
  );
  const ref = useRef<any>(null);
  const { data } = useRRGData(listSymbol, selectedTime);
  const { data: marketOverViewData } = useMarketOverviewData();

  const isMobile = useIsMobile();
  const { isLightMode } = useTheme();
  const colorsConfig = useChartColors();

  const formattedData = useMemo(
    () =>
      data?.map((item: any, index: number) => ({
        type: "line",
        name: listSymbol[index],
        smooth: false,
        lineStyle: {
          width: 3,
          color: colors[index % colors.length],
        },

        itemStyle: {
          color: colors[index % colors.length],
          width: 4,
        },
        tooltip: {
          formatter: function (params: any) {
            const price =
              marketOverViewData?.find((x) => x.code === listSymbol[index])
                ?.price || 0;
            return `<div class="flex flex-col gap-2 rounded-[4px] text-sm text-muted">
            <div class="flex gap-2 items-center">
              <div class="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white">
                <img class="h-full w-full object-contain" src="https://finance.vietstock.vn/image/${listSymbol[index]}"></div>
                <div class="text-white text-md font-semibold">${listSymbol[index]}</div>
              </div>
              <div class="flex justify-between">
                <div>Giá: <span class="text-white">${formatPrice(price)}</span></div>
                <div>Ngày: <span class="text-white">${format(new Date(item[params.dataIndex].date), "dd/MM/yyyy")}</span></div></div>
              <div class="bg-linearpurple relative h-[1px] w-full"><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-background px-2"><div class="bg-lineargreen h-1.5 w-1.5 rotate-45"></div></div></div>
              <div class="flex shrink-0 items-center justify-between gap-2"><div class="flex flex-col gap-1"><div class="font-bold text-white">S-Trend</div>
              <div>Hiện tại: <span class="${params.data.value[1] > 100 ? "text-green" : "text-red"}">${formatNumber(params.data.value[1], 2)}</span></div>
              <div>Đầu kỳ: <span class="${item[item.length - 1].rm > 100 ? "text-green" : "text-red"}">${formatNumber(item[item.length - 1].rm, 2)}</span></div></div>
              <div class="bg-linearpurple h-[58px] w-[1.5px]"></div>
              <div class="flex flex-col gap-1">
              <div class="font-bold text-white">S-Strength</div>
              <div>Hiện tại: <span class="${params.data.value[0] > 100 ? "text-green" : "text-red"}">${formatNumber(params.data.value[0], 2)}</span></div>
              <div>Đầu kỳ: <span class="${item[item.length - 1].rs > 100 ? "text-green" : "text-red"}">${formatNumber(item[item.length - 1].rs, 2)}</span></div></div></div></div>`;
          },
          confine: true,
          backgroundColor: colorsConfig.tooltipBackground,
          padding: 8,
          borderWidth: 0,
        },

        data: item.map((j: any, index: number) => ({
          value: [j.rs, j.rm],
          symbol: index === 0 ? "square" : "circle",
          symbolSize: index === 0 ? 16 : 8,
          symbolRotate: 45,
          label: {
            show: index === 0,
            position: "top", // Position the label at the end of the line
            formatter: "{a}", // Display the value
            fontSize: 16,
            fontWeight: 600,
            color: "black",
            distance: 5,
          },
          itemStyle:
            index === 0
              ? {
                  borderColor: "white",
                  borderWidth: 2,
                }
              : {},
        })),
      })) || [],
    [data],
  );

  const options = useMemo(
    () => ({
      animation: false,
      tooltip: { trigger: "item", confine: true },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          filterMode: "none",
          start: 45,
          end: 55,
        },
        {
          type: "inside",
          yAxisIndex: 0,
          filterMode: "none",
          start: 45,
          end: 55,
        },
      ],
      textStyle: {
        fontFamily: "Manrope, Manrope Fallback",
        color: colorsConfig.legendTextColor,
      },
      grid: {
        show: true,
        left: 30,
        right: 10,
        top: 10,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        inverse: true,
        min: 0,
        max: 200,
        name: "SỨC MẠNH (S-Strength)",
        nameLocation: "center",
        nameTextStyle: {
          fontSize: isMobile ? 10 : 14,
          fontWeight: 600,
          color: colorsConfig.legendTextColor,
        },
        nameGap: 30,
        axisLine: { show: false },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        name: "XU HƯỚNG (S-Trend)",
        nameLocation: "middle",
        nameRotate: 90,
        nameTextStyle: {
          fontSize: isMobile ? 10 : 14,
          color: colorsConfig.legendTextColor,
          fontWeight: 600,
        },
        nameGap: 40,
        min: 0,
        max: 200,
        axisLine: { show: false },
        splitLine: {
          show: false,
        },
        axisLabel: {
          position: "bottom",
        },
      },
      series: [
        ...formattedData,
        {
          type: "line",
          markArea: {
            itemStyle: {
              color: "#1FAD8E44",
            },
            data: [
              [
                {
                  coord: [100, 100],
                },
                {
                  coord: [200, 200],
                },
              ],
            ],
          },
          silent: true,
        },
        {
          type: "line",
          markArea: {
            itemStyle: {
              color: "#7B61FF44",
            },
            data: [
              [
                {
                  coord: [100, 100],
                },
                {
                  coord: [0, 200],
                },
              ],
            ],
            silent: true,
          },
        },
        {
          type: "line",
          markArea: {
            itemStyle: {
              color: "#F1C61745",
            },
            data: [
              [
                {
                  coord: [100, 100],
                },
                {
                  coord: [0, 0],
                },
              ],
            ],
            silent: true,
          },
        },
        {
          type: "line",
          markArea: {
            itemStyle: {
              color: "rgba(255, 19, 91, 0.30)",
            },
            data: [
              [
                {
                  coord: [100, 100],
                },
                {
                  coord: [200, 0],
                },
              ],
            ],
            silent: true,
          },
        },
      ],
      graphic: [
        {
          z: 10,
          type: "text",
          left: 80,
          top: 40,
          style: {
            text: "TÍCH LŨY",
            textAlign: "left",
            fontWeight: 600,
            fontSize: isMobile ? 10 : 16,
            fill: isLightMode ? "#1FAD8E" : "#9FF0D7",
          },
        },
        {
          z: 10,
          type: "text",
          left: 80,
          bottom: 70,
          style: {
            text: "GIẢM GIÁ",
            textAlign: "left",
            fontWeight: 600,
            fontSize: isMobile ? 10 : 16,

            fill: isLightMode ? "#FF135B" : "#FDA19B",
          },
        },
        {
          z: 10,
          type: "text",
          right: 20,
          top: 40,
          style: {
            text: "TĂNG GIÁ",
            textAlign: "left",
            fontWeight: 600,
            fontSize: isMobile ? 10 : 16,
            fill: isLightMode ? "#7B61FF" : "#B7B1FF",
          },
        },
        {
          z: 10,
          type: "text",
          right: 20,
          bottom: 70,
          style: {
            text: "SUY YẾU",
            textAlign: "left",
            fontWeight: 600,
            fontSize: isMobile ? 10 : 16,
            fill: isLightMode ? "#F1C617" : "#F1C617",
          },
        },
      ],
    }),
    [formattedData],
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.getEchartsInstance().clear();
      ref.current.getEchartsInstance().setOption(options);
    }
  }, [options]);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex w-full justify-between">
        <div className="flex gap-3">
          <div className="bg-background flex items-center rounded-[4px] px-3 py-1 text-sm!">
            {currentSymbol}
          </div>
          {selectedSymbols.map((symbol) => (
            <div
              key={symbol}
              className="bg-background flex items-center gap-2 rounded-[4px] p-2 px-3 text-sm!"
            >
              {symbol}
              <div
                className="cursor-pointer rounded-full hover:text-neutral-400"
                onClick={() =>
                  setSelectedSymbols(
                    selectedSymbols.filter((s) => s !== symbol),
                  )
                }
              >
                <X size={16} />
              </div>
            </div>
          ))}

          <Button
            className="bg-background flex h-[32px] cursor-pointer gap-2 rounded-[4px] p-1 px-2 text-sm font-semibold"
            onClick={() => setOpenThemMaCK(true)}
          >
            Thêm mã CK <Plus size={16} />
          </Button>
        </div>

        <Tabs
          color="primary"
          className="hidden sm:block"
          defaultSelectedKey={70}
          selectedKey={selectedTime}
          onSelectionChange={(k) => setSelectedTime(k as number)}
        >
          <Tab key={14} title="10"></Tab>
          <Tab key={28} title="20"></Tab>
          <Tab key={42} title="30"></Tab>
          <Tab key={56} title="40"></Tab>
          <Tab key={70} title="50"></Tab>
        </Tabs>
      </div>
      <ReactEChartsCore
        echarts={echarts}
        option={options}
        className="min-h-[300px]"
        style={{ height: "100%", width: "100%" }}
        ref={ref}
      ></ReactEChartsCore>
      <ThemMaCKModal
        isOpen={isOpenThemMaCK}
        onClose={() => {
          setOpenThemMaCK(false);
        }}
        onAdd={(symbols) => {
          setSelectedSymbols([
            ...selectedSymbols,
            ...symbols.filter((s) => s !== currentSymbol),
          ]);
        }}
        ignoreSymbols={[...selectedSymbols, currentSymbol]}
      />
    </div>
  );
}
