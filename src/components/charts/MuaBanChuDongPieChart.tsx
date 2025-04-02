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
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { cn, formatVeryLargeNumber } from "@/lib/utils";
import DoubleArrow from "@/icons/DoubleArrow";
import useChartColors from "./useChartColors";
echarts.use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

export default function MuaBanChuDongPieChart({
  mua,
  ban,
}: {
  mua: number;
  ban: number;
}) {
  const isUp = mua > ban;
  const colors = useChartColors();
  return (
    <div className="relative h-full flex-1">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={cn("flex items-center", isUp ? "text-green" : "text-red")}
        >
          {isUp ? (
            <DoubleArrow />
          ) : (
            <span className="rotate-180">
              <DoubleArrow />
            </span>
          )}
          {formatVeryLargeNumber(mua - ban, true)}
        </div>
      </div>
      <ReactEChartsCore
        echarts={echarts}
        option={{
          grid: {
            top: "5px", // Remove top padding
            bottom: "0px", // Remove bottom padding
            left: "0px", // Optional: Adjust left padding
            right: "5px", // Optional: Adjust right padding
            containLabel: true,
          },

          series: [
            {
              name: "Access From",
              type: "pie",
              radius: ["60%", "90%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 100,
                borderWidth: 4,
              },
              label: {
                show: false,
                position: "center",
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: mua,
                  name: "Search Engine",
                  itemStyle: { color: colors.green },
                },
                {
                  value: ban,
                  name: "Direct",
                  itemStyle: { color: colors.red },
                },
              ],
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ minHeight: "120px", height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
