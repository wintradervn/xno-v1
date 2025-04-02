import SmallTrendChart from "@/components/charts/SmallTrendChart";
import DefaultLoader from "@/components/ui/DefaultLoader";
import useIsMobile from "@/hooks/useIsMobile";
import { ILuuChuyenTienTeData } from "@/hooks/useLuuChuyenTienTeData";
import { Tooltip } from "@heroui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { DoubleAltArrowLeft, DoubleAltArrowRight } from "solar-icon-set";

const propNameToTitle: Record<string, string> = {
  investCost: "Chi phí đầu tư",
  fromInvest: "Dòng tiền từ đầu tư",
  fromFinancial: "Dòng tiền từ tài chính",
  fromSale: "Dòng tiền từ bán hàng",
  freeCashFlow: "Dòng tiền tự do",
};

const statsOrder: Array<keyof ILuuChuyenTienTeData> = [
  "investCost",
  "fromInvest",
  "fromFinancial",
  "fromSale",
  "freeCashFlow",
];

export default function LuuChuyenTienTeTable({
  data,
  isLoading,
  yearly,
}: {
  data: ILuuChuyenTienTeData[] | undefined;
  isLoading: boolean;
  yearly: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [leftIndex, setLeftIndex] = useState(0);
  const length = 8;
  const isMobile = useIsMobile();

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
    for (let i = 0; i < statsOrder.length; i++) {
      const propName = statsOrder[i];
      const data = sortedData
        .slice(leftIndex, leftIndex + 8)
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
    item: ILuuChuyenTienTeData,
    propName: keyof ILuuChuyenTienTeData,
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
          {statsOrder.map((item) => (
            <Fragment key={item}>
              <div
                className="sm:text-md flex h-[46px] overflow-hidden py-2 text-sm font-semibold text-nowrap text-ellipsis text-white"
                key={item}
              >
                <Tooltip content={propNameToTitle[item] || ""}>
                  <div className="w-[140px] overflow-hidden text-ellipsis sm:w-[240px]">
                    {propNameToTitle[item] || ""}
                  </div>
                </Tooltip>
                <div className="flex w-[50px] shrink-0 justify-center sm:w-[100px]">
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
              <DoubleAltArrowLeft size={isMobile ? 20 : 24} />
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
                      {statsOrder.map((statsName) => (
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
              <DoubleAltArrowRight size={isMobile ? 20 : 24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
