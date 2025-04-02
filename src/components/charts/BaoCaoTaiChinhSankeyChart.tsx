import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import { SankeyChart } from "echarts/charts";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import useCanDoiKeToanData, {
  ICanDoiKeToanItem,
} from "@/hooks/useCanDoiKeToanData";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import React, { useMemo } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import useChartColors from "./useChartColors";
import useTheme from "@/hooks/useTheme";
import { formatNumber } from "@/lib/utils";

echarts.use([CanvasRenderer, SankeyChart, GridComponent]);

const leftLabel = {
  position: "left",
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

const propNameToTitle: Record<string, string> = {
  shortAsset: "Tài sản ngắn hạn",
  cash: "Tiền mặt, vàng bạc, đá quý",
  shortInvest: "Giá trị thuần đầu tư ngắn hạn",
  shortReceivable: "Các khoản phải thu",
  inventory: "Hàng tồn kho, ròng",
  longAsset: "Tài sản dài hạn",
  fixedAsset: "Tài sản cố định",
  asset: "Tổng tài sản",
  debt: "Tổng nợ phải trả",
  shortDebt: "Vay ngắn hạn",
  longDebt: "Vay dài hạn",
  equity: "Vốn chủ sở hữu",
  capital: "Vốn điều lệ",
  centralBankDeposit: "Tiền gửi tại ngân hàng nhà nước VN",
  otherBankDeposit: "Tiền gửi và cho vay các TCTD khác",
  otherBankLoan: "Other bank loan",
  stockInvest: "Chứng khoán đầu tư",
  customerLoan: "Cho vay khách hàng",
  badLoan: "Bad loan",
  provision: "Dự phòng rủi ro cho vay khách hàng",
  netCustomerLoan: "Cho vay khách hàng",
  otherAsset: "Tài sản Có khác",
  otherBankCredit: "Tiền gửi của các TCTD khác",
  oweOtherBank: "Tiền vay của các TCTD khác",
  oweCentralBank: "Các khoản nợ chính phủ và NHNN Việt Nam",
  valuablePaper: "Phát hành giấy tờ có giá",
  payableInterest: "Payable interest",
  receivableInterest: "Receivable interest",
  deposit: "Tiền gửi của khách hàng",
  otherDebt: "Các khoản nợ khác",
  fund: "Quỹ của tổ chức tín dụng",
  unDistributedIncome: "Lợi nhuận chưa phân phối",
  minorShareHolderProfit: "Lợi ích của cổ đông thiểu số",
};

const colorByName: Record<string, any> = {
  shortAsset: {
    label: { ...topLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  shortInvest: {
    label: { ...leftLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  shortReceivable: {
    label: { ...leftLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  fixedAsset: {
    label: { ...leftLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  cash: {
    label: { ...leftLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  inventory: {
    label: { ...leftLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  longAsset: {
    label: { ...leftLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  asset: {
    label: { ...topLabel, color: "#73ADFF" },
    itemStyle: {
      ...colorLinearBlue,
    },
  },
  shortDebt: {
    label: { ...rightLabel, color: "#7B61FF" },
    itemStyle: {
      ...colorLinearPurple,
    },
  },
  longDebt: {
    label: { ...rightLabel, color: "#7B61FF" },
    itemStyle: {
      ...colorLinearPurple,
    },
  },
  debt: {
    label: { ...topLabel, color: "#7B61FF" },
    itemStyle: {
      ...colorLinearPurple,
    },
  },
  capital: {
    label: { ...rightLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  equity: {
    label: { ...topLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
  minorShareHolderProfit: {
    label: { ...rightLabel, color: "#1FAD8E" },
    itemStyle: {
      ...colorLinearGreen,
    },
  },
};

const normalOrder = [
  {
    id: "assetIn",
    children: [
      {
        id: "shortAsset",
        children: [
          {
            id: "cash",
          },
          {
            id: "shortInvest",
          },
          {
            id: "shortReceivable",
          },
          {
            id: "inventory",
          },
        ],
      },
      {
        id: "longAsset",
        children: [
          {
            id: "fixedAsset",
          },
        ],
      },
    ],
  },
  {
    id: "assetOut",
    children: [
      {
        id: "debt",
        children: [
          {
            id: "shortDebt",
          },
          {
            id: "longDebt",
          },
        ],
      },
      {
        id: "equity",
        children: [
          {
            id: "capital",
          },
          {
            id: "unDistributedIncome",
          },
          {
            id: "minorShareHolderProfit",
          },
        ],
      },
    ],
  },
];

function getGradientColor(startColor: string, endColor: string) {
  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 0,
    colorStops: [
      { offset: 0, color: startColor }, // Start color
      { offset: 1, color: endColor }, // End color
    ],
  };
}

// [
//   {
//     name: "Phải thu ngắn hạn",
//     label: leftLabel,
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Hàng tồn kho",
//     label: leftLabel,
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Phải thu dài hạn",
//     label: leftLabel,
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Tài sản ngắn hạn",
//     label: {
//       ...topLabel,
//       color: "#1FAD8E",
//     },
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Tài sản cố định",
//     label: leftLabel,
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Tài sản dở dang",
//     label: leftLabel,
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Đầu tư tài chính",
//     label: leftLabel,
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Lợi thế thương mại",
//     label: leftLabel,
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Tài sản dài hạn",
//     label: {
//       ...topLabel,
//       color: "#1FAD8E",
//     },
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Tổng tài sản",
//     label: {
//       ...topLabel,
//       color: "#73ADFF",
//     },
//     itemStyle: {
//       ...colorLinearBlue,
//     },
//   },
//   {
//     name: "Nợ ngắn hạn",
//     label: {
//       ...topLabel,
//       color: "#7B61FF",
//     },
//     itemStyle: {
//       ...colorLinearPurple,
//     },
//   },
//   {
//     name: "Nợ dài hạn",
//     label: {
//       ...topLabel,
//       color: "#7B61FF",
//     },
//     itemStyle: {
//       ...colorLinearPurple,
//     },
//   },
//   {
//     name: "Vốn chủ sở hữu",
//     label: {
//       ...topLabel,
//       color: "#1FAD8E",
//     },
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Tổng nợ",
//     label: {
//       ...topLabel,
//       color: "#7B61FF",
//     },
//     itemStyle: {
//       ...colorLinearPurple,
//     },
//   },
//   {
//     name: "Vốn điều lệ",
//     label: { ...rightLabel },
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Thặng dư vốn",
//     label: { ...rightLabel },
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "LNST chưa phân phối",
//     label: { ...rightLabel },
//     itemStyle: {
//       ...colorLinearGreen,
//     },
//   },
//   {
//     name: "Phải trả ngắn hạn",
//     label: { ...rightLabel, color: "#7B61FF" },
//     itemStyle: {
//       ...colorLinearPurple,
//     },
//   },
//   {
//     name: "Người mua trả tiền trước",
//     label: { ...rightLabel, color: "#7B61FF" },
//     itemStyle: {
//       ...colorLinearPurple,
//     },
//   },
//   {
//     name: "Nợ vay ngắn hạn",
//     label: { ...rightLabel, color: "#7B61FF" },
//     itemStyle: {
//       ...colorLinearPurple,
//     },
//   },
//   {
//     name: "Nợ vay dài hạn",
//     label: { ...rightLabel, color: "#7B61FF" },
//     itemStyle: {
//       ...colorLinearPurple,
//     },
//   },
// ]

function BaoCaoTaiChinhSankeyChart({ yearly }: { yearly: boolean }) {
  const { symbol } = useChiTietMaCK();
  const isMobile = useIsMobile();
  const colors = useChartColors();
  const { isLightMode } = useTheme();
  const { data, isLoading } = useCanDoiKeToanData(symbol, yearly);
  const latestYearData = useMemo(() => {
    const latestData = data?.[data.length - 1];
    return {
      ...latestData,
    };
  }, [data]);

  const dataList = useMemo(() => {
    if (!latestYearData) return [];
    return Object.entries(latestYearData || {})
      .map(([key, value]) => {
        return {
          name: key,
          label: { ...leftLabel, color: colors.green },
          ...colorByName[key as string],
        };
      })
      .filter(Boolean);
  }, [latestYearData]);

  const links: any[] = useMemo(() => {
    if (!latestYearData) return [];
    const result: any[] = [];
    const update = (parent: any, child: any, isIn: boolean) => {
      if (child.children) {
        child.children.forEach((item: any) => {
          update(child, item, isIn);
        });
      }
      const parentId = ["assetIn", "assetOut"].includes(parent?.id)
        ? "asset"
        : parent?.id;

      return (
        parent?.id &&
        child?.id &&
        latestYearData[child.id as keyof ICanDoiKeToanItem] &&
        result.push({
          source: isIn ? child.id : parentId,
          target: isIn ? parentId : child.id,
          value: latestYearData[child.id as keyof ICanDoiKeToanItem],
          lineStyle: {
            color: isIn
              ? getGradientColor(
                  colorByName[child.id]?.label.color,
                  colorByName[parentId]?.label.color,
                )
              : getGradientColor(
                  colorByName[parentId]?.label.color,
                  colorByName[child.id]?.label.color,
                ),
            opacity: isLightMode ? 0.15 : 0.25,
          },
        })
      );
    };
    normalOrder.forEach((item) => {
      let isIn = item.id === "assetIn";
      update(null, item, isIn);
    });
    return result;
  }, [latestYearData]);

  const percentageMapping = useMemo(() => {
    const result = {} as Record<string, number>;
    links.forEach((link) => {
      const { source, target } = link;
      const sourceValue = latestYearData[source as keyof ICanDoiKeToanItem];
      const targetValue = latestYearData[target as keyof ICanDoiKeToanItem];
      if (!result[source]) {
        if (!!sourceValue && !!targetValue) {
          if (+sourceValue > +targetValue) {
            result[target] = (+targetValue / +sourceValue) * 100;
          } else {
            result[source] = (+sourceValue / +targetValue) * 100;
          }
        }
      }
    });
    return result;
  }, [links, latestYearData]);

  return (
    <div
      className={
        isMobile
          ? "absolute h-[760px] w-[250%] origin-top-left scale-[0.4] overflow-hidden"
          : "h-full flex-1"
      }
    >
      <ReactEChartsCore
        echarts={echarts}
        option={{
          textStyle: {
            fontFamily: "Manrope, Manrope Fallback",
          },
          grid: {
            top: "10px", // Remove top padding
            bottom: "64px", // Remove bottom padding
            left: "10px", // Optional: Adjust left padding
            right: "10px", // Optional: Adjust right padding
            containLabel: true,
          },
          series: {
            type: "sankey",
            layout: "none",
            emphasis: {
              focus: "adjacency",
            },
            nodeGap: 40,
            left: "180px",
            top: "40px",
            right: "180px",
            data: dataList.filter((item) =>
              links.some(
                (link) =>
                  item &&
                  (link.source === item.name || link.target === item.name),
              ),
            ),
            links: links,
            label: {
              show: true,
              formatter: function (params: any) {
                return `{name|${propNameToTitle[params.name]}}
                {b|${formatNumber(params.value)}} {b|${percentageMapping[params.name] ? "(" + formatNumber(percentageMapping[params.name], 2) + "%)" : ""}}`;
              },
              rich: {
                name: {
                  fontSize: 12,
                  align: "left", // Align text to the left
                },
                b: {
                  color: colors.axisLabelColor,
                  fontSize: 10,
                  align: "left",
                },
              },
              textStyle: {
                fontFamily: "Manrope, Manrope Fallback",
              },
            },
            layoutIterations: 0,
          },
        }}
        style={{ height: "100%", width: "100%" }}
      ></ReactEChartsCore>
    </div>
  );
}

export default React.memo(BaoCaoTaiChinhSankeyChart);
