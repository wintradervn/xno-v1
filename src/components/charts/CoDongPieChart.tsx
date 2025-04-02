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
import useChartColors from "./useChartColors";
echarts.use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

export default function CoDongPieChart() {
  const colors = useChartColors();
  return (
    <div className="flex w-full gap-2">
      <div className="relative flex flex-1">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-2 text-sm font-bold">Cổ đông</div>
        </div>
        <div className="flex-1">
          <ReactEChartsCore
            echarts={echarts}
            option={{
              grid: {
                top: "10px", // Remove top padding
                bottom: "0px", // Remove bottom padding
                left: "0px", // Optional: Adjust left padding
                right: "10px", // Optional: Adjust right padding
                containLabel: true,
              },

              series: [
                {
                  name: "Access From",
                  type: "pie",
                  radius: ["55%", "85%"],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 4,
                    borderWidth: 5,
                    borderColor: "transparent",
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
                      value: 1048,
                      name: "Nước ngoài",
                      itemStyle: { color: colors.green },
                    },
                    {
                      value: 735,
                      name: "Direct",
                      itemStyle: { color: colors.red },
                    },
                    {
                      value: 2735,
                      name: "Nhà nước",
                      itemStyle: { color: colors.yellow },
                    },
                  ],
                },
              ],
            }}
            notMerge={true}
            lazyUpdate={true}
            style={{ height: "100%", width: "100%" }}
          ></ReactEChartsCore>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 text-sm">
        <div className="flex w-[150px] items-center gap-2">
          <div className="bg-green h-2 w-2 rounded-full"></div>
          <div className="flex-1 font-bold">Nước ngoài:</div>
          <div className="">23.32%</div>
        </div>
        <div className="flex w-[150px] items-center gap-2">
          <div className="bg-yellow h-2 w-2 rounded-full"></div>
          <div className="flex-1 font-bold">Nhà nước:</div>
          <div className="">74.80%</div>
        </div>
        <div className="flex w-[150px] items-center gap-2">
          <div className="bg-red h-2 w-2 rounded-full"></div>
          <div className="flex-1 font-bold">Khác:</div>
          <div className="">1.86%</div>
        </div>
      </div>
    </div>
  );
}
