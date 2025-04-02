import SmallTrendChart from "@/components/charts/SmallTrendChart";
import DefaultLoader from "@/components/ui/DefaultLoader";
import useIsMobile from "@/hooks/useIsMobile";
import { IKetQuaKinhDoanhItem } from "@/hooks/useKetQuaKinhDoanhData";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import { Tooltip } from "@heroui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { DoubleAltArrowLeft, DoubleAltArrowRight } from "solar-icon-set";

const propNameToTitle: Record<keyof IKetQuaKinhDoanhItem, string> = {
  ticker: "Mã chứng khoán",
  quarter: "Quý tài chính",
  year: "Năm tài chính",
  revenue: "Doanh thu thuần",
  yearRevenueGrowth: "Tăng trưởng doanh thu thuần năm",
  quarterRevenueGrowth: "Tăng trưởng doanh thu thuần quý",
  costOfGoodSold: "Giá vốn hàng bán",
  grossProfit: "Lợi nhuận gộp",
  operationExpense: "Chi phí hoạt động",
  operationProfit: "Tổng thu nhập hoạt động",
  yearOperationProfitGrowth: "Tăng trưởng lợi nhuận hoạt động năm",
  quarterOperationProfitGrowth: "Tăng trưởng lợi nhuận hoạt động quý",
  interestExpense: "Chi phí lãi vay",
  preTaxProfit: "Lợi nhuận trước thuế",
  postTaxProfit: "Lợi nhuận sau thuế",
  shareHolderIncome: "Thu nhập của cổ đông",
  yearShareHolderIncomeGrowth: "Tăng trưởng thu nhập cổ đông năm",
  quarterShareHolderIncomeGrowth: "Tăng trưởng thu nhập cổ đông quý",
  investProfit: "Lợi nhuận đầu tư",
  serviceProfit: "Lãi thuần từ hoạt động dịch vụ",
  otherProfit: "Lãi/(lỗ) thuần từ hoạt động khác",
  provisionExpense: "Chi phí dự phòng rủi ro tín dụng",
  operationIncome: "Thu nhập hoạt động",
  ebitda: "EBITDA (Lợi nhuận trước lãi vay, thuế, khấu hao và khấu trừ)",
};

const statsOrder: (keyof IKetQuaKinhDoanhItem)[] = [
  "revenue",
  "yearRevenueGrowth",
  "quarterRevenueGrowth",
  "costOfGoodSold",
  "grossProfit",
  "operationExpense",
  "operationProfit",
  "yearOperationProfitGrowth",
  "quarterOperationProfitGrowth",
  "interestExpense",
  "preTaxProfit",
  "postTaxProfit",
  "shareHolderIncome",
  "yearShareHolderIncomeGrowth",
  "quarterShareHolderIncomeGrowth",
  "ebitda",
];

const bankStatsOrder: (keyof IKetQuaKinhDoanhItem)[] = [
  "revenue",
  "yearRevenueGrowth",
  "quarterRevenueGrowth",
  "serviceProfit",
  "otherProfit",
  "operationProfit",
  "operationExpense",
  "provisionExpense",
  "preTaxProfit",
  "postTaxProfit",
  "shareHolderIncome",
  "yearShareHolderIncomeGrowth",
  "quarterShareHolderIncomeGrowth",
];

export default function KetQuaKinhDoanhTable({
  data,
  isLoading,
  yearly,
}: {
  data: IKetQuaKinhDoanhItem[] | undefined;
  isLoading: boolean;
  yearly: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [leftIndex, setLeftIndex] = useState(0);
  const length = 8;
  const isMobile = useIsMobile();
  const { data: overviewData } = useMarketOverviewData();
  const isBankSymbol = useMemo(() => {
    if (!overviewData) return false;
    const item = overviewData.find((item) => item.code === data?.[0]?.ticker);
    if (!item || !item.sectors) return false;
    return item.sectors.includes("bank");
  }, [overviewData, data]);

  const finalOrder = isBankSymbol ? bankStatsOrder : statsOrder;

  const handleScrollClick = (direction: "left" | "right") => {
    const slideRange = isMobile ? 140 : 400;
    if (ref.current) {
      ref.current.scrollTo({
        left:
          ref.current.scrollLeft +
          (direction === "left" ? -slideRange : slideRange), // Adjust the value as needed
        behavior: "smooth",
      });
    }
  };
  const sortedData = useMemo(() => {
    if (!data) return [];
    return data.sort((a, b) => {
      if (a.year > b.year) return 1;
      if (a.year < b.year) return -1;
      if (a.quarter > b.quarter) return 1;
      if (a.quarter < b.quarter) return -1;
      return 0;
    });
  }, [data]);
  const trendingData = useMemo(() => {
    const result: any = {};
    if (!sortedData) return result;
    for (let i = 0; i < finalOrder.length; i++) {
      const propName = finalOrder[i];
      const data = sortedData
        .slice(Math.min(leftIndex, sortedData.length - 8), leftIndex + 8)
        .map((item) => item[propName]);
      result[propName] = data;
    }
    return result;
  }, [sortedData, leftIndex, length]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = 9999;
    }
  }, [sortedData]);

  useEffect(() => {
    if (!ref.current) return;
    const handleScroll = () => {
      if (!ref.current) return;
      const index = Math.floor(ref.current.scrollLeft / (isMobile ? 70 : 100));
      setLeftIndex(index);
    };
    ref.current.addEventListener("scroll", handleScroll);
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isMobile]);

  const renderStatCell = (
    item: IKetQuaKinhDoanhItem,
    propName: keyof IKetQuaKinhDoanhItem,
  ) => {
    return (
      <div className="h-[46px] py-2 text-right font-medium">
        {(item[propName] || "-").toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}
      </div>
    );
  };

  return (
    <div className="no-scrollbar h-full w-full overflow-auto">
      <div className="flex h-fit w-full justify-between sm:gap-2">
        <div className="flex h-fit shrink-0 flex-col">
          <div className="mr-2 mb-4 flex h-6 justify-end"></div>
          {finalOrder.map((item) => (
            <Fragment key={item}>
              <div
                className="sm:text-md flex h-[46px] items-center overflow-hidden py-2 text-sm font-semibold text-nowrap text-ellipsis text-white"
                key={item}
              >
                <Tooltip content={propNameToTitle[item]}>
                  <div className="w-[140px] overflow-hidden text-ellipsis sm:w-[240px]">
                    {propNameToTitle[item] || ""}
                  </div>
                </Tooltip>
                <div className="flex w-[80px] shrink-0 justify-center sm:w-[100px]">
                  <div className="flex h-[30px] w-[36px] sm:w-[46px]">
                    <SmallTrendChart data={trendingData[item]} />
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="flex flex-1 justify-center gap-2">
          <div className="shrink-0">
            <div
              className="text-muted hover:text-foreground cursor-pointer"
              onClick={() => handleScrollClick("left")}
            >
              <DoubleAltArrowLeft size={isMobile ? 16 : 24} />
            </div>
          </div>
          <div
            className="no-scrollbar w-[560px] overflow-auto sm:w-[800px]"
            ref={ref}
          >
            <div className="flex w-fit min-w-full justify-center">
              {isLoading ? (
                <DefaultLoader />
              ) : (
                sortedData?.map((item, index) => (
                  <Fragment key={index}>
                    <div className="sm:text-md flex w-[70px] flex-col text-sm leading-6 font-semibold sm:w-[100px]">
                      <div className="mb-4 text-end">
                        {yearly ? item.year : `Q${item.quarter}/${item.year}`}
                      </div>
                      {finalOrder.map((statsName) => (
                        <Fragment key={statsName}>
                          {renderStatCell(item, statsName)}
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))
              )}
            </div>
          </div>
          <div className="shrink-0">
            <div
              className="text-muted hover:text-foreground cursor-pointer"
              onClick={() => handleScrollClick("right")}
            >
              <DoubleAltArrowRight size={isMobile ? 16 : 24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
