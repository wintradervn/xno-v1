import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { text } from "stream/consumers";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useKetQuaKinhDoanhData from "@/hooks/useKetQuaKinhDoanhData";
import { useMemo } from "react";
import { formatNumber } from "@/lib/utils";
import useCanDoiKeToanData from "@/hooks/useCanDoiKeToanData";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

const label = {};

const series = [
  {
    data: [50, 60, 66, 70, 60, 70, 63, 64, 75, 65, 56, 65],
    type: "bar",
    stack: "a",
    name: "Góp vốn đầu tư",
    itemStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          { offset: 0, color: "#CFF8EA" },
          { offset: 1, color: "#67E1C0" },
        ],
      },
    },
    label: label,
    barWidth: "22px",
  },
  {
    data: [50, 20, 32, 60, 20, 30, 33, 34, 35, 36, 36, 38],
    type: "bar",
    stack: "a",
    name: "Tài sản cố định",
    itemStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          { offset: 0, color: "#CFDBF8" },
          { offset: 1, color: "#2D84FF" },
        ],
      },
    },
    label: label,
    barWidth: "22px",
  },
  {
    data: [20, 40, 42, 21, 20, 20, 23, 24, 25, 26, 27, 28],
    type: "bar",
    stack: "a",
    name: "Tiền mặt và tương đương tiền",
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          { offset: 0, color: "#FFCCE2" },
          { offset: 1, color: "#FF80B6" },
        ],
      },
    },
    label: label,
    barWidth: "22px",
  },
  {
    data: [120, 140, 142, 51, 71, 71, 70, 90, 45, 65, 70, 120],
    type: "line",
    color: "#F5B763",
    symbolSize: 5,
  },
  {
    data: [120, 140, 142, 121, 91, 111, 110, 70, 85, 45, 110, 120],
    type: "line",
    color: "#3673E8",
    symbolSize: 5,
  },
  {
    data: [120, 30, 42, 21, 41, 61, 40, 50, 65, 85, 60, 90],
    type: "line",
    color: "#61B8FF",
    symbolSize: 5,
  },
];
const tangtruongketquakinhdoanh = [
  {
    key: "revenue",
    name: "Doanh thu thuần",
    type: "bar",
  },
  {
    key: "grossProfit",
    name: "Lợi nhuận gộp",
    type: "bar",
  },
  {
    key: "postTaxProfit",
    name: "LNST",
    type: "bar",
  },
  {
    key: "yearRevenueGrowth",
    name: "Tăng trưởng Doanh thu YoY",
    type: "line",
    formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
  },
  {
    key: "yearShareHolderIncomeGrowth",
    name: "Tăng trưởng LNST YoY",
    type: "line",
    formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
  },
  {
    key: "grossProfit/revenue",
    name: "Biên lợi nhuận gộp",
    type: "line",
    getData: (item: any) => (100 * item["grossProfit"]) / item["revenue"],
    formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
  },
  {
    key: "postTaxProfit/revenue",
    name: "Biên lợi nhuận ròng",
    type: "line",
    getData: (item: any) => (100 * item["postTaxProfit"]) / item["revenue"],
    formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
  },
];

const phantichnguonvon = [
  {
    key: "shortDebt+longDebt",
    name: "Nợ vay",
    type: "bar",
    stack: "a",
    getData: (item: any) => item["shortDebt"] + item["longDebt"],
  },
  {
    key: "capital",
    name: "Vốn góp",
    type: "bar",
    stack: "a",
  },
  {
    key: "unDistributedIncome",
    name: "LN chưa phân phối",
    type: "bar",
    stack: "a",
  },
  {
    key: "debt-shortDebt-longDebt",
    name: "Nợ chiếm dụng",
    type: "bar",
    stack: "a",
    getData: (item: any) => item["debt"] - item["shortDebt"] - item["longDebt"],
  },
  {
    key: "minorShareHolderProfit",
    name: "LN cổ đông không kiểm soát",
    type: "bar",
    stack: "a",
  },
  {
    key: "shortDebt+longDebt/asset",
    name: "Nợ vay/Tổng nguồn vốn (%)",
    type: "line",
    getData: (item: any) =>
      ((item["shortDebt"] + item["longDebt"]) * 100) / item["asset"],
    formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
  },
];

const phantichtaisan = [
  {
    key: "cash+longDebt",
    name: "Tiền + Gửi bank",
    type: "bar",
    stack: "a",
    getData: (item: any) => item["cash"] + item["shortInvest"],
  },
  {
    key: "shortRecaivable",
    name: "Phải thu ngắn hạn",
    type: "bar",
    stack: "a",
  },
  {
    key: "inventory",
    name: "Tồn kho",
    type: "bar",
    stack: "a",
  },
  {
    key: "fixedAsset",
    name: "Tài sản cố định",
    type: "bar",
    stack: "a",
  },
  {
    key: "longAsset",
    name: "Tài sản dài hạn",
    type: "bar",
    stack: "a",
  },
  {
    key: "stockInvest",
    name: "Đầu tư chứng khoán",
    type: "bar",
    stack: "a",
  },
  {
    key: "otherAsset",
    name: "Tài sản khác",
    type: "bar",
    stack: "a",
  },
  {
    key: "cash+shortInvest/asset",
    name: "Tiền/Tổng tài sản",
    type: "line",
    getData: (item: any) =>
      ((item["cash"] + item["shortInvest"]) * 100) / item["asset"],
    formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
  },
];

export default function ChiSoTaiChinhComplexChart({
  yearly,
  selectedChart,
}: {
  yearly: boolean;
  selectedChart: string;
}) {
  const { symbol } = useChiTietMaCK();
  const { data } = useKetQuaKinhDoanhData(symbol, yearly);
  const { data: data2 } = useCanDoiKeToanData(symbol, yearly);
  const selectedData =
    selectedChart === "tangtruongketquakinhdoanh" ? data : data2;

  const series = useMemo(() => {
    if (!selectedData) return [];

    const config: any =
      selectedChart === "tangtruongketquakinhdoanh"
        ? tangtruongketquakinhdoanh
        : selectedChart === "phantichtaisan"
          ? phantichtaisan
          : phantichnguonvon;

    const sortedData = selectedData.sort((a, b) =>
      a.year !== b.year ? a.year - b.year : a.quarter - b.quarter,
    );

    return config.map((configItem: any) => {
      return {
        data: sortedData.map(
          configItem.getData ||
            ((item: any) => ({ value: item[configItem.key] })),
        ),
        type: configItem.type,
        name: configItem.name,
        stack: configItem.stack || "",
        yAxisIndex: configItem.type === "line" ? 1 : 0,
        tooltip: {
          valueFormatter: (value: any) =>
            configItem.formatLabel
              ? configItem.formatLabel(value)
              : formatNumber(value),
        },
      };
    });
  }, [selectedData, selectedChart]);

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
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
            // formatter: function (params: any) {
            //   return `<div class="flex flex-col gap-1">
            // <div class="text-[12px] flex flex-col gap-[1px] !text-white">${params[0].name}</div>
            // ${params.map((item: any) => `<div class="flex items-center gap-1"><span>${item.marker}</span><span class="!text-muted">${item.seriesName}:</span> <span class="!text-white">${configItem.formatLabel ? configItem.formatLabel(item.value) : formatNumber(item.value)}</span></div>`)}
            // </div>`;
            // },
          },
          legend: {
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 25,
            textStyle: {
              color: "white",
            },
            bottom: "bottom",
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "40px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              color: "#98A2B3",
              fontSize: 10,
            },
            axisTick: { show: false },
            splitLine: { show: false },
            data: yearly
              ? selectedData?.map((item) => item.year)
              : selectedData?.map((item) => `Q${item.quarter}/${item.year}`),
          },
          yAxis: [
            {
              type: "value", // Set y-axis to value type
              splitLine: {
                lineStyle: {
                  color: "#1D2939",
                },
              },
              axisLabel: {
                color: "#98A2B3",
                fontSize: 12,
              },
            },
            {
              type: "value", // Set y-axis to value type
              splitLine: {
                show: false,
              },
              axisLabel: {
                color: "#98A2B3",
                fontSize: 12,
                formatter: (value: any) => `${value}%`,
              },
            },
          ],

          series: series,
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
