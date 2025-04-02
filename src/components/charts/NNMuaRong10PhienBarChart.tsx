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
import useSWR from "swr";
import { useMemo } from "react";
import { format } from "date-fns";
import { formatVeryLargeNumber } from "@/lib/utils";
import { DoubleAltArrowDown, DoubleAltArrowUp } from "solar-icon-set";
import useIndexOverview from "@/hooks/useIndexOverview";
import useChartColors from "./useChartColors";
import DefaultNodata from "../ui/DefaultNodata";
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

const data = [
  ["2024-11-01", -200],
  ["2024-11-02", 200],
  ["2024-11-03", 50],
  ["2024-11-04", 180],
  ["2024-11-05", -70],
  ["2024-11-06", -110],
  ["2024-11-07", 130],
  ["2024-11-08", 130],
  ["2024-11-09", 200],
  ["2024-11-10", 250],
];

const dayNowTimestamp = Math.floor(new Date().getTime() / 86400000) * 86400;
const fromTimestamp = dayNowTimestamp - 86400 * 20;

const upArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="15.166666666666666" height="14" viewBox="0 0 13 12" fill="none" style="transform: rotate(0deg);"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4637 6.10882C8.87085 6.19546 9.24105 6.11274 9.57039 5.85817C9.61674 5.82235 9.65287 5.7714 9.6742 5.71179C9.69554 5.65218 9.70111 5.58658 9.69023 5.5233C9.67935 5.46001 9.65249 5.40189 9.61306 5.35629L6.79706 2.09563C6.77091 2.06531 6.73985 2.04126 6.70566 2.02485C6.67148 2.00845 6.63483 2 6.59783 2C6.56082 2 6.52418 2.00845 6.48999 2.02485C6.4558 2.04126 6.42475 2.06531 6.39859 2.09563L3.58259 5.35629C3.54316 5.40189 3.51631 5.46001 3.50542 5.52329C3.49454 5.58658 3.50012 5.65218 3.52145 5.71179C3.54278 5.7714 3.57891 5.82235 3.62526 5.85817C3.9546 6.11273 4.32481 6.19546 4.73195 6.10882L4.94274 6.06397L6.39859 4.37824C6.42475 4.34792 6.4558 4.32387 6.48999 4.30746C6.52418 4.29105 6.56082 4.28261 6.59783 4.28261C6.63483 4.28261 6.67148 4.29105 6.70566 4.30746C6.73985 4.32387 6.77091 4.34792 6.79706 4.37824L8.25291 6.06397L8.4637 6.10882Z" fill="currentColor"></path><path d="M9.57005 9.11892C9.24434 9.37067 8.8843 9.40331 8.51673 9.21792L7.77229 8.84243C7.03342 8.46976 6.16155 8.46976 5.42268 8.84243L4.67824 9.21792C4.31067 9.40331 3.95064 9.37067 3.62492 9.11892C3.57857 9.08309 3.54244 9.03215 3.52111 8.97253C3.49978 8.91292 3.4942 8.84732 3.50508 8.78404C3.51597 8.72075 3.54282 8.66263 3.58225 8.61703L6.39825 5.35637C6.42441 5.32606 6.45546 5.30201 6.48965 5.2856C6.52384 5.26919 6.56048 5.26074 6.59749 5.26074C6.63449 5.26074 6.67114 5.26919 6.70532 5.2856C6.73951 5.30201 6.77057 5.32606 6.79672 5.35637L9.61272 8.61703C9.65215 8.66263 9.67901 8.72075 9.68989 8.78404C9.70077 8.84732 9.6952 8.91292 9.67386 8.97253C9.65253 9.03215 9.6164 9.08309 9.57005 9.11892Z" fill="currentColor"></path></svg>`;
const downArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="15.166666666666666" height="14" viewBox="0 0 13 12" fill="none" style="transform: rotate(180deg);"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4637 6.10882C8.87085 6.19546 9.24105 6.11274 9.57039 5.85817C9.61674 5.82235 9.65287 5.7714 9.6742 5.71179C9.69554 5.65218 9.70111 5.58658 9.69023 5.5233C9.67935 5.46001 9.65249 5.40189 9.61306 5.35629L6.79706 2.09563C6.77091 2.06531 6.73985 2.04126 6.70566 2.02485C6.67148 2.00845 6.63483 2 6.59783 2C6.56082 2 6.52418 2.00845 6.48999 2.02485C6.4558 2.04126 6.42475 2.06531 6.39859 2.09563L3.58259 5.35629C3.54316 5.40189 3.51631 5.46001 3.50542 5.52329C3.49454 5.58658 3.50012 5.65218 3.52145 5.71179C3.54278 5.7714 3.57891 5.82235 3.62526 5.85817C3.9546 6.11273 4.32481 6.19546 4.73195 6.10882L4.94274 6.06397L6.39859 4.37824C6.42475 4.34792 6.4558 4.32387 6.48999 4.30746C6.52418 4.29105 6.56082 4.28261 6.59783 4.28261C6.63483 4.28261 6.67148 4.29105 6.70566 4.30746C6.73985 4.32387 6.77091 4.34792 6.79706 4.37824L8.25291 6.06397L8.4637 6.10882Z" fill="currentColor"></path><path d="M9.57005 9.11892C9.24434 9.37067 8.8843 9.40331 8.51673 9.21792L7.77229 8.84243C7.03342 8.46976 6.16155 8.46976 5.42268 8.84243L4.67824 9.21792C4.31067 9.40331 3.95064 9.37067 3.62492 9.11892C3.57857 9.08309 3.54244 9.03215 3.52111 8.97253C3.49978 8.91292 3.4942 8.84732 3.50508 8.78404C3.51597 8.72075 3.54282 8.66263 3.58225 8.61703L6.39825 5.35637C6.42441 5.32606 6.45546 5.30201 6.48965 5.2856C6.52384 5.26919 6.56048 5.26074 6.59749 5.26074C6.63449 5.26074 6.67114 5.26919 6.70532 5.2856C6.73951 5.30201 6.77057 5.32606 6.79672 5.35637L9.61272 8.61703C9.65215 8.66263 9.67901 8.72075 9.68989 8.78404C9.70077 8.84732 9.6952 8.91292 9.67386 8.97253C9.65253 9.03215 9.6164 9.08309 9.57005 9.11892Z" fill="currentColor"></path></svg>`;

const exchangeMapToParam: Record<string, string> = {
  HOSE: "VNINDEX",
  HNX: "HNXINDEX",
  UPCOM: "UPINDEX",
};

export default function NNMuaRong10PhienBarChart({
  symbol,
}: {
  symbol?: string;
}) {
  const { data } = useSWR(
    `/api/index-datafeed?type=NnmbVal&from=${fromTimestamp}&to=${dayNowTimestamp}&symbol=${symbol ? exchangeMapToParam[symbol] || symbol : "VNINDEX"}`,
    async (url: string) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    },
    { refreshInterval: 10000 },
  );

  const { data: indexOverview } = useIndexOverview();
  const indexData = useMemo(() => {
    return indexOverview?.find(
      (item) => item.code === exchangeMapToParam[symbol || "HOSE"],
    );
  }, [indexOverview]);

  const compiledData = useMemo(() => {
    if (!data || !data.t) return [];
    let result = [];

    for (let i = 0; i < data.t.length; i++) {
      result.push([data.t[i], data.o[i] - data.h[i]]);
    }
    result = result.slice(-10);
    if (indexData) {
      result[result.length - 1] = [
        result[result.length - 1][0],
        indexData.foreignBuyVal - indexData.foreignSellVal,
      ];
    }

    return result;
  }, [data, indexData]);

  const colors = useChartColors();
  if (!compiledData) return <DefaultNodata />;

  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          textStyle: { fontFamily: "Manrope, Manrope Fallback" },
          tooltip: {
            confine: true,
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[12px] flex gap-[1px] text-white font-semibold items-center">${format(new Date(+params[0].name * 1000), "dd/MM")}: <span class="inline-flex ${params[0].value > 0 ? "text-green" : "text-red"}">${params[0].value > 0 ? upArrow : downArrow}${formatVeryLargeNumber(params[0].value)}</span></div>`;
            },
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: 10,
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "10px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              formatter: function (value: any) {
                return format(new Date(value * 1000), "dd/MM");
              },
              color: "#98A2B3",
              fontSize: 8,
              interval: 0,
            },
            data: compiledData.map((item: any) => item[0]),
            axisTick: { show: false },
            splitLine: { show: false },
          },
          yAxis: {
            type: "value", // Set y-axis to value type
            splitLine: {
              lineStyle: {
                color: colors.splitLineColor,
              },
            },
            axisLabel: {
              color: colors.axisLabelColor,
              fontSize: 10,
              formatter: function (value: any) {
                return (value / 1000_000_000).toFixed(0);
              },
            },
          },
          series: [
            {
              type: "bar",
              legend: { show: false },
              barCategoryGap: "10%",
              data: compiledData.map(function (item: any) {
                return {
                  name: item[0],
                  value: item[1],
                  itemStyle: {
                    color: item[1] > 0 ? colors.green : colors.red, // Conditional color based on value
                    borderRadius: item[1] > 0 ? [5, 5, 0, 0] : [0, 0, 5, 5], // Set border radius
                  },
                };
              }),
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{
          minHeight: "300px",
          height: "100%",
          width: "100%",
        }}
      ></ReactEChartsCore>
    </div>
  );
}
