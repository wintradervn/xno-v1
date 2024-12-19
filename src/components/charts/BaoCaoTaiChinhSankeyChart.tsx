import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { SankeyChart } from "echarts/charts";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
echarts.use([CanvasRenderer, SankeyChart, GridComponent]);

const leftLabel = {
  position: "left",
  color: "#1FAD8E",
  fontWeight: "600",
  distance: 20,
  lineHeight: 18,
};

const topLabel = {
  position: "top",
  fontWeight: "600",
  distance: 5,
  lineHeight: 18,
};

const rightLabel = {
  position: "right",
  color: "#1FAD8E",
  fontWeight: "600",
  distance: 20,
  lineHeight: 18,
};

const colorLinearGreen = {
  color: {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: "#CFF8EA" }, // Start color
      { offset: 1, color: "#67E1C0" }, // End color
    ],
  },
};

const colorLinearBlue = {
  color: {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: "#CFDBF8" }, // Start color
      { offset: 1, color: "#2D84FF" }, // End color
    ],
  },
};
const colorLinearPurple = {
  color: {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      { offset: 0, color: "#E9E8FF" }, // Start color
      { offset: 1, color: "#B7B1FF" }, // End color
    ],
  },
};

export default function BaoCaoTaiChinhSankeyChart() {
  return (
    <div className="flex-1">
      <ReactEChartsCore
        echarts={echarts}
        option={{
          series: {
            type: "sankey",
            layout: "none",
            emphasis: {
              focus: "adjacency",
            },
            nodeGap: 50,
            left: "150px",
            right: "170px",
            data: [
              {
                name: "Phải thu ngắn hạn",
                label: leftLabel,
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Hàng tồn kho",
                label: leftLabel,
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Phải thu dài hạn",
                label: leftLabel,
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Tài sản ngắn hạn",
                label: {
                  ...topLabel,
                  color: "#1FAD8E",
                },
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Tài sản cố định",
                label: leftLabel,
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Tài sản dở dang",
                label: leftLabel,
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Đầu tư tài chính",
                label: leftLabel,
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Lợi thế thương mại",
                label: leftLabel,
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Tài sản dài hạn",
                label: {
                  ...topLabel,
                  color: "#1FAD8E",
                },
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Tổng tài sản",
                label: {
                  ...topLabel,
                  color: "#73ADFF",
                },
                itemStyle: {
                  ...colorLinearBlue,
                },
              },
              {
                name: "Nợ ngắn hạn",
                label: {
                  ...topLabel,
                  color: "#7B61FF",
                },
                itemStyle: {
                  ...colorLinearPurple,
                },
              },
              {
                name: "Nợ dài hạn",
                label: {
                  ...topLabel,
                  color: "#7B61FF",
                },
                itemStyle: {
                  ...colorLinearPurple,
                },
              },
              {
                name: "Vốn chủ sở hữu",
                label: {
                  ...topLabel,
                  color: "#1FAD8E",
                },
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Tổng nợ",
                label: {
                  ...topLabel,
                  color: "#7B61FF",
                },
                itemStyle: {
                  ...colorLinearPurple,
                },
              },
              {
                name: "Vốn điều lệ",
                label: { ...rightLabel },
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Thặng dư vốn",
                label: { ...rightLabel },
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "LNST chưa phân phối",
                label: { ...rightLabel },
                itemStyle: {
                  ...colorLinearGreen,
                },
              },
              {
                name: "Phải trả ngắn hạn",
                label: { ...rightLabel, color: "#7B61FF" },
                itemStyle: {
                  ...colorLinearPurple,
                },
              },
              {
                name: "Người mua trả tiền trước",
                label: { ...rightLabel, color: "#7B61FF" },
                itemStyle: {
                  ...colorLinearPurple,
                },
              },
              {
                name: "Nợ vay ngắn hạn",
                label: { ...rightLabel, color: "#7B61FF" },
                itemStyle: {
                  ...colorLinearPurple,
                },
              },
              {
                name: "Nợ vay dài hạn",
                label: { ...rightLabel, color: "#7B61FF" },
                itemStyle: {
                  ...colorLinearPurple,
                },
              },
            ],
            links: [
              {
                source: "Phải thu ngắn hạn",
                target: "Tài sản ngắn hạn",
                value: 5,
              },
              {
                source: "Hàng tồn kho",
                target: "Tài sản ngắn hạn",
                value: 25,
              },
              {
                source: "Phải thu dài hạn",
                target: "Tài sản ngắn hạn",
                value: 4,
              },
              {
                source: "Tài sản cố định",
                target: "Tài sản dài hạn",
                value: 2,
              },
              {
                source: "Tài sản dở dang",
                target: "Tài sản dài hạn",
                value: 5,
              },
              {
                source: "Đầu tư tài chính",
                target: "Tài sản dài hạn",
                value: 5,
              },
              {
                source: "Lợi thế thương mại",
                target: "Tài sản dài hạn",
                value: 2,
              },
              {
                source: "Tài sản ngắn hạn",
                target: "Tổng tài sản",
                value: 34,
              },
              {
                source: "Tài sản dài hạn",
                target: "Tổng tài sản",
                value: 14,
              },
              {
                source: "Tổng tài sản",
                target: "Nợ ngắn hạn",
                value: 14,
              },
              {
                source: "Tổng tài sản",
                target: "Nợ dài hạn",
                value: 14,
              },
              {
                source: "Tổng tài sản",
                target: "Vốn chủ sở hữu",
                value: 20,
              },
              {
                source: "Vốn chủ sở hữu",
                target: "Vốn điều lệ",
                value: 10,
              },
              {
                source: "Vốn chủ sở hữu",
                target: "Thặng dư vốn",
                value: 6,
              },
              {
                source: "Vốn chủ sở hữu",
                target: "LNST chưa phân phối",
                value: 4,
              },
              {
                source: "Nợ ngắn hạn",
                target: "Tổng nợ",
                value: 14,
              },
              {
                source: "Nợ dài hạn",
                target: "Tổng nợ",
                value: 14,
              },
              {
                source: "Tổng nợ",
                target: "Phải trả ngắn hạn",
                value: 6,
              },
              {
                source: "Tổng nợ",
                target: "Người mua trả tiền trước",
                value: 14,
              },
              {
                source: "Tổng nợ",
                target: "Nợ vay ngắn hạn",
                value: 4,
              },
              {
                source: "Tổng nợ",
                target: "Nợ vay dài hạn",
                value: 4,
              },
            ],
            label: {
              show: true,
              formatter: function (params: any) {
                return `${params.name}
{b|744,231}`;
              },
              rich: {
                b: {
                  color: "#98A2B3",
                  fontSize: 9,
                },
              },
              textStyle: {
                fontFamily: "Manrope, Manrope Fallback",
              },
            },
            lineStyle: {},
          },
        }}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}
