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
import { GaugeChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
echarts.use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GaugeChart,
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

export default function ChiSoDongTienGauge({ size = 1 }: { size?: number }) {
  const lineWidth = 16 * size;
  const fontSize = 12 * size;
  return (
    <div className="relative flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          series: [
            {
              type: "gauge",
              startAngle: 180,
              endAngle: 0,
              grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
              axisLine: {
                lineStyle: {
                  width: lineWidth,
                  color: [
                    [0.2, "#0FDEE6"],
                    [0.4, "#FF135B"],
                    [0.6, "#F1C617"],
                    [0.8, "#1DF81F"],
                    [1, "#DC6BDE"],
                  ],
                },
              },
              pointer: {
                itemStyle: {
                  color: "#9385FF",
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                distance: -lineWidth - 2,
                length: lineWidth + 2,
                lineStyle: {
                  color: "#ffffff70",
                  width: 1,
                },
              },
              axisLabel: {
                color: "#98A2B3",
                fontSize: fontSize,
                distance: -lineWidth,
                rotate: "tangential",
                formatter: function (value: any) {
                  if (value === 10) {
                    return "Bán mạnh";
                  } else if (value === 30) {
                    return "Bán";
                  } else if (value === 50) {
                    return "Trung lập";
                  } else if (value === 70) {
                    return "Mua";
                  } else if (value === 90) {
                    return "Mua mạnh";
                  }
                  return "";
                },
                textStyle: {
                  fontFamily: "Manrope, Manrope Fallback",
                },
              },
              detail: {
                show: false,
              },
              data: [
                {
                  value: 45,
                },
              ],
              anchor: {
                show: true,
                showAbove: true,
                size: (lineWidth * 5) / 6,
                itemStyle: {
                  borderWidth: lineWidth / 3,
                  color: "white",
                  borderColor: "#7B61FF",
                  shadowColor: "#7B61FF",
                  shadowBlur: (lineWidth * 5) / 6,
                },
              },
              itemStyle: {
                color: "#58D9F9",
              },
              
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: "180%", width: "100%" }}
        className="absolute left-0 top-0"
      ></ReactEChartsCore>
    </div>
  );
}
