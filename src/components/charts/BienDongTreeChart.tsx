import React, { useMemo } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import * as echarts from "echarts/core";
import { TreemapChart } from "echarts/charts";
import {
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
} from "echarts/components";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import { formatPrice } from "@/lib/utils";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";

const colors = {
  red: "#E51152",
  green: "#10B969",
  yellow: "#F1C617",
  purple: "#DC6BDE",
  cyan: "#0FDEE6",
};
echarts.use([
  TitleComponent,
  TreemapChart,
  TooltipComponent,
  CanvasRenderer,
  DataZoomComponent,
]);

const labelMap: { [key: string]: string } = {
  consumer: "Tiêu dùng",
  realEstate: "Bất động sản",
  stock: "Chứng khoán",
  bank: "Ngân hàng",
  defensive: "Phòng thủ",
  oilGas: "Dầu khí",
  logistics: "Vận chuyển",
};

export default function BienDongTreeChart({
  data: dataProp,
}: {
  data?: TSymbolOverviewData[];
}) {
  const { setChiTietMaCK } = useChiTietMaCK();
  const { data: dataStore, isLoading } = useMarketOverviewData();
  const data = dataProp || dataStore;
  const groupedData = useMemo(() => {
    const grouped: any = [];
    if (!data) return [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.sectors && !!item.exchange && item) {
        for (let j = 0; j < item.sectors.length; j++) {
          const sector = item.sectors[j];
          const found = grouped.find((x: any) => x.name === sector);
          let color = item.dayChange
            ? item.dayChange > 0
              ? colors.green
              : item.dayChange < 0
                ? colors.red
                : colors.yellow
            : colors.yellow;

          if (item.price === item.ceiling) {
            color = colors.purple;
          }
          if (item.price === item.floor) {
            color = colors.cyan;
          }

          const newItem = {
            name: item.code,
            stockName: item.symbolName,
            value: item.dayVolume,
            change: item.dayChangePercent,
            liquidity: item.dayValue,
            price: item.price,
            itemStyle: {
              color: color,
            },
          };
          if (found) {
            found.children.push(newItem);
            found.value += newItem.value;
          } else {
            grouped.push({
              name: sector,
              children: [newItem],
              value: item.dayVolume,
              path: sector,
              label: { show: true, formatter: labelMap[sector] || "" },
            });
          }
        }
      }
    }
    return grouped;
  }, [data]);

  return (
    <div className="flex-1">
      {isLoading || !data ? (
        <div className="flex-1"></div>
      ) : (
        <ReactEChartsCore
          echarts={echarts}
          onEvents={{
            click: function (params: any) {
              if (params.data.name) {
                setChiTietMaCK(params.data.name);
              }
            },
          }}
          option={{
            dataZoom: [],
            tooltip: {
              trigger: "item", // Trigger tooltip on item hover
              formatter: function (params: any) {
                // Custom tooltip content
                const textColor =
                  params.data.change > 0
                    ? "text-green"
                    : params.data.change < 0
                      ? "text-red"
                      : "text-yellow";
                return `
                  <div class="text-muted text-left text-[11px] font-thin flex flex-col gap-[1px]">
                      <strong class="w-44 text-wrap font-semibold text-white">${params.name} - ${
                        params.data.stockName
                      }</strong>
                      <div>Giá: <strong class="${textColor} font-semibold">${formatPrice(
                        params.data.price,
                      )}</strong></div>
                      <div>Thay đổi: <strong class="${textColor} font-semibold">${params.data.change?.toFixed(
                        2,
                      )}%</strong></div>
                      <div>Khối lượng GD: <strong class="text-white font-semibold">${(+params
                        .data.value).toLocaleString()}</strong></div>
                      <div>Giá trị giao dịch: <strong class="text-white font-semibold">${(
                        +params.data.liquidity / 1000000000
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}</strong>tỷ</div>
                  </>
              `;
              },
              backgroundColor: "#0A0E14", // Tooltip background color
              borderWidth: 0, // Tooltip border width
              padding: 10, // Tooltip padding
              textStyle: {
                fontFamily: "Manrope, Manrope Fallback",
                fontSize: 10,
              },
            },
            series: [
              {
                type: "treemap",
                breadcrumb: {
                  show: false,
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                roam: false,
                upperLabel: {},
                itemStyle: {
                  borderColor: "#fff",
                },
                select: {
                  disabled: true,
                },
                nodeClick: false,
                visibleMin: 1000,
                levels: [
                  {
                    itemStyle: {
                      borderColor: "#151A24",
                      borderWidth: 0,
                      gapWidth: 1,
                    },
                  },
                  {
                    itemStyle: {
                      borderColor: "#1F2533",
                      borderWidth: 1,
                      gapWidth: 1,
                    },
                    upperLabel: {
                      show: true,
                      height: 20,
                      color: "#ddd",
                      fontFamily: "Manrope, Manrope Fallback",
                      fontSize: 10,
                    },
                    tooltip: {
                      show: false,
                    },
                  },
                  {
                    label: {
                      formatter: function (params: any) {
                        return `${params.name}\n ${`${params.data.change > 0 ? "+" : ""}${params.data.change?.toFixed(
                          2,
                        )}`}%`; // Custom label format
                      },
                      fontWeight: "bold",
                      fontSize: 12,
                    },
                  },
                ],
                data: groupedData,
              },
            ],
          }}
          notMerge={true}
          lazyUpdate={true}
          className="min-h-[250px]"
          style={{ height: "100%", width: "100%" }}
        />
      )}
    </div>
  );
}