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

import { formatPrice } from "@/lib/utils";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useNuocNgoaiData, {
  INuocNgoaiSymbolData,
} from "@/hooks/useNuocNgoaiData";

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

export default function NuocNgoaiTreeChart({
  data: dataProp,
}: {
  data?: INuocNgoaiSymbolData[];
}) {
  const { setChiTietMaCK } = useChiTietMaCK();
  const { data: dataStore, isLoading } = useNuocNgoaiData();
  const data = dataProp || dataStore;
  const groupedData = useMemo(() => {
    if (!data) return [];
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const newItem = {
        name: item.code,
        stockName: item.symbolName,
        value: Math.abs(item.dayNetVal),
        change: item.dayChangePercent,
        volume: item.dayTotalVol,
        liquidity: item.dayNetVal,
        price: item.price,
        itemStyle: {
          color: item.dayNetVal
            ? item.dayNetVal > 0
              ? colors.green
              : item.dayNetVal < 0
                ? colors.red
                : colors.yellow
            : colors.yellow,
        },
      };
      newData.push(newItem);
    }
    return newData;
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
                        .data.volume).toLocaleString()}</strong></div>
                      <div>Giá trị mua ròng: <strong class="text-white font-semibold">${(
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
                  borderColor: "#151A24",
                  borderWidth: 0,
                  gapWidth: 1,
                },
                select: {
                  disabled: true,
                },
                nodeClick: false,
                visibleMin: 2000,
                label: {
                  formatter: function (params: any) {
                    return `${params.name}\n ${(params.data.liquidity / 1000_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })} tỷ`; // Custom label format
                  },
                  fontWeight: "bold",
                  fontSize: 12,
                  textStyle: {
                    color: "white",
                    fontFamily: "Manrope, Manrope Fallback",
                  },
                },
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