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
    formatLabel: (value: any) => `${formatNumber(value * 100, 2)}%`,
  },
  {
    key: "yearShareHolderIncomeGrowth",
    name: "Tăng trưởng LNST YoY",
    type: "line",
    formatLabel: (value: any) => `${formatNumber(value * 100, 2)}%`,
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
    key: "asset",
    name: "Tổng nguồn vốn",
    type: "bar",
    stack: "a",
  },
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
    key: "asset",
    name: "Tổng nguồn vốn",
    type: "bar",
    stack: "a",
  },
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
    selectedChart === "tangtruongketquakinhdoanh"
      ? data?.slice(yearly ? -10 : -16)
      : data2?.slice(yearly ? -10 : -16);

  const series = useMemo(() => {
    if (!selectedData) return [];

    const config: any =
      selectedChart === "tangtruongketquakinhdoanh"
        ? tangtruongketquakinhdoanh
        : selectedChart === "phantichtaisan"
          ? phantichtaisan
          : phantichnguonvon;

    const sortedData = selectedData
      .sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.quarter - b.quarter,
      )
      .slice(yearly ? -10 : -16);

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
        smooth: true,
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
            // formatter: function (params: any) {
            //   return `<div class="flex flex-col gap-1">
            // <div class="text-[12px] flex flex-col gap-[1px] !text-white">${params[0].name}</div>
            // ${params.map((item: any) => `<div class="flex items-center gap-1"><span>${item.marker}</span><span class="!text-muted">${item.seriesName}:</span> <span class="!text-white">${configItem.formatLabel ? configItem.formatLabel(item.value) : formatNumber(item.value)}</span></div>`)}
            // </div>`;
            // },
          },
          legend: {
            width: 530,
            align: "auto",
            itemWidth: 18,
            itemHeight: 12,
            itemGap: 16,
            textStyle: {
              color: "white",
            },
            bottom: "bottom",
            left: "center",
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "64px", // Remove bottom padding
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
              ? selectedData?.map((item) => item.year).slice(-10)
              : selectedData
                  ?.map((item) => `Q${item.quarter}/${item.year}`)
                  .slice(-16),
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
