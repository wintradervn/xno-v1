import React, { use, useMemo } from "react";
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
import useNuocNgoaiData, {
  INuocNgoaiSymbolData,
} from "@/hooks/useNuocNgoaiData";
import useTuDoanhData, { ITuDoanhSymbolData } from "@/hooks/useTuDoanhData";
import DefaultLoader from "../ui/DefaultLoader";
import DefaultNodata from "../ui/DefaultNodata";
import useChartColors from "./useChartColors";

echarts.use([
  TitleComponent,
  TreemapChart,
  TooltipComponent,
  CanvasRenderer,
  DataZoomComponent,
]);

export default function TuDoanhTreeChart({
  data: dataProp,
}: {
  data?: ITuDoanhSymbolData[];
}) {
  const { setChiTietMaCK } = useChiTietMaCK();
  const { data: dataStore, isLoading } = useTuDoanhData();
  const data = dataProp || dataStore;
  const colors = useChartColors();

  const groupedData = useMemo(() => {
    if (!data) return [];
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const newItem = {
        name: item.code,
        stockName: item.symbolName,
        value: Math.abs(item.netProprietaryValue),
        itemStyle: {
          color: item.netProprietaryValue
            ? item.netProprietaryValue > 0
              ? "#10B969"
              : item.netProprietaryValue < 0
                ? colors.red
                : colors.yellow
            : colors.yellow,
        },
      };
      newData.push(newItem);
    }
    return newData;
  }, [data]);

  const isNoData = useMemo(
    () =>
      groupedData.length === 0 || groupedData.every((item: any) => !item.value),
    [groupedData],
  );

  return (
    <div className="flex-1">
      {isLoading ? (
        <div className="flex-1">
          <DefaultLoader />
        </div>
      ) : isNoData ? (
        <>
          <DefaultNodata />
        </>
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
                return `
                  <div class="text-muted text-left text-[11px] font-thin flex flex-col gap-[1px]">
                      <strong class="w-44 text-wrap font-semibold text-white">${params.name} - ${
                        params.data.stockName
                      }</strong>
                      <div>Giá trị mua ròng: <strong class="text-white font-semibold">${(
                        +params.data.value / 1000000000
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}</strong>tỷ</div>
                  </>
              `;
              },
              confine: true,
              backgroundColor: colors.tooltipBackground, // Tooltip background color
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
                  borderColor: colors.backgroundColor,
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
                    return `${params.name}\n ${(params.data.value / 1000_000_000).toFixed(2)} tỷ`; // Custom label format
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
          className="min-h-[400px] sm:min-h-[250px]"
          style={{ height: "100%", width: "100%" }}
        />
      )}
    </div>
  );
}
