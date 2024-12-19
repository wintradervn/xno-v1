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
echarts.use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

const data = [900, 750, 460, 500, 420];
const data2 = [800, 450, 560, 400, 440];
const data3 = [430, 650, 500, 300, 400];

export default function DongTienThongMinhLineChart() {
  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          tooltip: {
            trigger: "axis",
            formatter: function (params: any) {
              return `<div class="text-left text-[14px] flex flex-col gap-[1px] text-white font-semibold">
                19/11/24 14:30<br/>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 w-[140px]">
                    <div class="h-[7px] w-[7px] bg-[#1FAD8E] rounded-full"></div>
                    <div class="text-xs font-normal">Dòng tiền ròng nhỏ lẻ</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-sm">${params[2].value} cp</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 w-[140px]">
                    <div class="h-[7px] w-[7px] bg-[#7B61FF] rounded-full"></div>
                    <div class="text-xs font-normal">Dòng tiền ròng đầu cơ</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-sm">${params[1].value} cp</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 w-[140px]">
                    <div class="h-[7px] w-[7px] bg-[#FF80B6] rounded-full"></div>
                    <div class="text-xs font-normal">Dòng tiền ròng tổ chức</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-sm">${params[0].value} cp</div>
                  </div>
                </div>
              </div>`;
            },
            backgroundColor: "#0A0E14", // Tooltip background color
            borderWidth: 0, // Tooltip border width
            padding: 10, // Tooltip padding
            textStyle: {
              fontFamily: "Manrope, Manrope Fallback",
              fontSize: 10,
            },
          },
          legend: {
            bottom: "bottom",
            left: "center",
            textStyle: {
              color: "white",
              fontFamily: "Manrope, Manrope Fallback",
            },
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "30px", // Remove bottom padding
            left: "0px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          emphasis: {
            focus: "series",
          },
          xAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: {
              color: "#98A2B3",
              fontSize: 12,
              interval: 0,
            },
            data: ["Feb", "Mar", "Apr", "May", "Jun"],
            axisTick: { show: false },
            splitLine: { show: false },
            boundaryGap: false,
          },
          yAxis: {
            type: "value", // Set y-axis to value type
            splitLine: {
              lineStyle: {
                color: "#1D2939",
              },
            },
            axisLabel: {
              color: "#98A2B3",
              fontSize: 10,
            },
          },
          series: [
            {
              name: "Dòng tiền ròng tổ chức",
              type: "line",

              data: data,
              itemStyle: { color: "#FF80B6" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(255, 128, 182, 0.6)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255, 128, 182, 0)",
                  },
                ]),
              },
            },
            {
              name: "Dòng tiền ròng đầu cơ",
              type: "line",
              data: data2,
              itemStyle: { color: "#7B61FF" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(123, 97, 255, 0.6)",
                  },
                  {
                    offset: 1,
                    color: "rgba(123, 97, 255, 0)",
                  },
                ]),
              },
            },
            {
              name: "Dòng tiền ròng nhỏ lẻ",
              type: "line",
              data: data3,
              itemStyle: { color: "#1FAD8E" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(31, 173, 142, 0.6)",
                  },
                  {
                    offset: 1,
                    color: "rgba(31, 173, 142, 0)",
                  },
                ]),
              },
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
