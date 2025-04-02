import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import * as echarts from "echarts/core";
import useChartColors from "./useChartColors";
echarts.use([CanvasRenderer, BarChart, GridComponent]);

const defaultData = [4124, 3124, 5415, 442, 5313, 7775];

export default function SmallTrendChart({ data }: { data: number[] }) {
  const colors = useChartColors();
  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          grid: {
            top: "0px", // Remove top padding
            bottom: "1px", // Remove bottom padding
            left: "0px", // Optional: Adjust left padding
            right: "0px", // Optional: Adjust right padding
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              formatter: function (value: any) {
                return "29/09";
              },
              color: colors.axisLabelColor,
              fontSize: 8,
              interval: 0,
            },
            axisTick: { show: false },
            splitLine: { show: false },
          },
          yAxis: {
            type: "value", // Set y-axis to value type
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: colors.axisLabelColor,
              fontSize: 10,
            },
            axisLine: {
              lineStyle: { color: colors.legendTextColor },
              onZero: true,
            },
          },
          series: [
            {
              type: "bar",
              data:
                data?.map((value) => {
                  if (value >= 0) return value;
                  if (value < 0)
                    return { value: value, itemStyle: { color: colors.red } };
                }) || defaultData,
              color: colors.green,
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
