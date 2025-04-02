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
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import React, { useMemo } from "react";
import { format } from "date-fns";
import { formatNumber, formatVeryLargeNumber } from "@/lib/utils";
import useYTDIndexData from "@/hooks/useYTDIndexData";
import useChartColors from "./useChartColors";
echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
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

const upArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="15.166666666666666" height="14" viewBox="0 0 13 12" fill="none" style="transform: rotate(0deg);"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4637 6.10882C8.87085 6.19546 9.24105 6.11274 9.57039 5.85817C9.61674 5.82235 9.65287 5.7714 9.6742 5.71179C9.69554 5.65218 9.70111 5.58658 9.69023 5.5233C9.67935 5.46001 9.65249 5.40189 9.61306 5.35629L6.79706 2.09563C6.77091 2.06531 6.73985 2.04126 6.70566 2.02485C6.67148 2.00845 6.63483 2 6.59783 2C6.56082 2 6.52418 2.00845 6.48999 2.02485C6.4558 2.04126 6.42475 2.06531 6.39859 2.09563L3.58259 5.35629C3.54316 5.40189 3.51631 5.46001 3.50542 5.52329C3.49454 5.58658 3.50012 5.65218 3.52145 5.71179C3.54278 5.7714 3.57891 5.82235 3.62526 5.85817C3.9546 6.11273 4.32481 6.19546 4.73195 6.10882L4.94274 6.06397L6.39859 4.37824C6.42475 4.34792 6.4558 4.32387 6.48999 4.30746C6.52418 4.29105 6.56082 4.28261 6.59783 4.28261C6.63483 4.28261 6.67148 4.29105 6.70566 4.30746C6.73985 4.32387 6.77091 4.34792 6.79706 4.37824L8.25291 6.06397L8.4637 6.10882Z" fill="currentColor"></path><path d="M9.57005 9.11892C9.24434 9.37067 8.8843 9.40331 8.51673 9.21792L7.77229 8.84243C7.03342 8.46976 6.16155 8.46976 5.42268 8.84243L4.67824 9.21792C4.31067 9.40331 3.95064 9.37067 3.62492 9.11892C3.57857 9.08309 3.54244 9.03215 3.52111 8.97253C3.49978 8.91292 3.4942 8.84732 3.50508 8.78404C3.51597 8.72075 3.54282 8.66263 3.58225 8.61703L6.39825 5.35637C6.42441 5.32606 6.45546 5.30201 6.48965 5.2856C6.52384 5.26919 6.56048 5.26074 6.59749 5.26074C6.63449 5.26074 6.67114 5.26919 6.70532 5.2856C6.73951 5.30201 6.77057 5.32606 6.79672 5.35637L9.61272 8.61703C9.65215 8.66263 9.67901 8.72075 9.68989 8.78404C9.70077 8.84732 9.6952 8.91292 9.67386 8.97253C9.65253 9.03215 9.6164 9.08309 9.57005 9.11892Z" fill="currentColor"></path></svg>`;
const downArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="15.166666666666666" height="14" viewBox="0 0 13 12" fill="none" style="transform: rotate(180deg);"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4637 6.10882C8.87085 6.19546 9.24105 6.11274 9.57039 5.85817C9.61674 5.82235 9.65287 5.7714 9.6742 5.71179C9.69554 5.65218 9.70111 5.58658 9.69023 5.5233C9.67935 5.46001 9.65249 5.40189 9.61306 5.35629L6.79706 2.09563C6.77091 2.06531 6.73985 2.04126 6.70566 2.02485C6.67148 2.00845 6.63483 2 6.59783 2C6.56082 2 6.52418 2.00845 6.48999 2.02485C6.4558 2.04126 6.42475 2.06531 6.39859 2.09563L3.58259 5.35629C3.54316 5.40189 3.51631 5.46001 3.50542 5.52329C3.49454 5.58658 3.50012 5.65218 3.52145 5.71179C3.54278 5.7714 3.57891 5.82235 3.62526 5.85817C3.9546 6.11273 4.32481 6.19546 4.73195 6.10882L4.94274 6.06397L6.39859 4.37824C6.42475 4.34792 6.4558 4.32387 6.48999 4.30746C6.52418 4.29105 6.56082 4.28261 6.59783 4.28261C6.63483 4.28261 6.67148 4.29105 6.70566 4.30746C6.73985 4.32387 6.77091 4.34792 6.79706 4.37824L8.25291 6.06397L8.4637 6.10882Z" fill="currentColor"></path><path d="M9.57005 9.11892C9.24434 9.37067 8.8843 9.40331 8.51673 9.21792L7.77229 8.84243C7.03342 8.46976 6.16155 8.46976 5.42268 8.84243L4.67824 9.21792C4.31067 9.40331 3.95064 9.37067 3.62492 9.11892C3.57857 9.08309 3.54244 9.03215 3.52111 8.97253C3.49978 8.91292 3.4942 8.84732 3.50508 8.78404C3.51597 8.72075 3.54282 8.66263 3.58225 8.61703L6.39825 5.35637C6.42441 5.32606 6.45546 5.30201 6.48965 5.2856C6.52384 5.26919 6.56048 5.26074 6.59749 5.26074C6.63449 5.26074 6.67114 5.26919 6.70532 5.2856C6.73951 5.30201 6.77057 5.32606 6.79672 5.35637L9.61272 8.61703C9.65215 8.66263 9.67901 8.72075 9.68989 8.78404C9.70077 8.84732 9.6952 8.91292 9.67386 8.97253C9.65253 9.03215 9.6164 9.08309 9.57005 9.11892Z" fill="currentColor"></path></svg>`;

const exchangeMapToParam: Record<string, string> = {
  HOSE: "VNINDEX",
  HNX: "HNXINDEX",
  UPCOM: "UPINDEX",
};

const TuDoanhYTDBarChart = ({ symbol }: { symbol?: string }) => {
  const { data } = useYTDIndexData(exchangeMapToParam[symbol || "HOSE"]);

  const colors = useChartColors();
  const compiledData = useMemo(() => {
    if (!data) return [];
    const result = data.reduce((acc: any, item: any) => {
      const date = new Date(item.date);
      const month = format(date, "MM-yyyy"); // Format: YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          mua: 0,
          ban: 0,
          net: 0,
        };
      }
      acc[month].net += item.propTradingNetDealValue || 0;
      return acc;
    }, {});
    return Object.entries(result).map(([key, value]: any) => ({
      name: key,
      value: value.net,
      itemStyle: {
        color: value.net > 0 ? colors.green : colors.red, // Conditional color based on value
        borderRadius: value.net > 0 ? [5, 5, 0, 0] : [0, 0, 5, 5], // Set border radius
      },
    }));
  }, [data]);

  const accumulatedData = useMemo(
    () =>
      compiledData.reduce((acc: any, item: any) => {
        if (acc.length === 0) {
          acc.push(item.value);
        } else {
          acc.push(acc[acc.length - 1] + item.value);
        }
        return acc;
      }, []),
    [compiledData],
  );

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
              return `<div class="text-left text-[12px] flex flex-col gap-[1px] text-white font-semibold ">${params[0].name}: 
              <div class="flex items-center ${params[0].value > 0 ? "text-green" : "text-red"}"><span class="text-white">Mua ròng:</span> ${params[0].value > 0 ? upArrow : downArrow}${formatVeryLargeNumber(params[0].value)}</div>
              <div class="flex items-center ${params[1].value > 0 ? "text-green" : "text-red"}"><span class="text-white">Lũy kế:</span> ${params[1].value > 0 ? upArrow : downArrow}${formatVeryLargeNumber(params[1].value)}</div>
              
              </div>`;
            },
            backgroundColor: colors.tooltipBackground, // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              color: "white",
              fontSize: 12,
            },
          },
          grid: {
            top: "15px", // Remove top padding
            bottom: "0px", // Remove bottom padding
            left: "5px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              color: colors.axisLabelColor,
              fontSize: 10,
              interval: 0,
              rotate: 45, // Rotate labels by 45 degrees
            },

            data: compiledData.map((item: any) => item.name),
            axisTick: { show: false },
            splitLine: { show: false },
          },
          yAxis: [
            {
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
                  return value ? formatNumber(value / 1000_000_000) : 0;
                },
              },
            },
            {
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
                  return value ? formatNumber(value / 1000_000_000) : 0;
                },
              },
            },
          ],
          series: [
            {
              type: "bar",
              legend: { show: false },
              barCategoryGap: "10%",
              data: compiledData,
            },
            {
              type: "line",
              legend: { show: false },
              data: accumulatedData,
              yAxisIndex: 1,
              color: "#b7b1ff",
              symbolSize: 3,
              lineStyle: {
                color: "#b7b1ff",
              },
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ minHeight: "250px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
};

export default React.memo(TuDoanhYTDBarChart);
