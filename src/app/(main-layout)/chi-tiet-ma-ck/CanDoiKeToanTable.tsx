import SmallTrendChart from "@/components/charts/SmallTrendChart";
import DefaultLoader from "@/components/ui/DefaultLoader";
import { ICanDoiKeToanItem } from "@/hooks/useCanDoiKeToanData";
import useIsMobile from "@/hooks/useIsMobile";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import ChevronDown from "@/icons/ChevronDown";
import { cn } from "@/lib/utils";
import { Tooltip } from "@heroui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { DoubleAltArrowLeft, DoubleAltArrowRight } from "solar-icon-set";

export const propNameToTitle: Record<string, string> = {
  shortAsset: "Tài sản ngắn hạn",
  cash: "Tiền mặt, vàng bạc, đá quý",
  shortInvest: "Giá trị thuần đầu tư ngắn hạn",
  shortReceivable: "Các khoản phải thu",
  inventory: "Hàng tồn kho, ròng",
  longAsset: "Tài sản dài hạn",
  fixedAsset: "Tài sản cố định",
  asset1: "Tổng tài sản",
  asset2: "Tổng nguồn vốn",
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

export const normalOrder = [
  {
    id: "asset1",
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
    id: "asset2",
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

const bankOrder = [
  {
    id: "asset1",
    children: [
      {
        id: "cash",
      },
      {
        id: "centralBankDeposit",
      },
      {
        id: "otherBankDeposit",
      },
      {
        id: "customerLoan",
      },
      {
        id: "stockInvest",
      },
      {
        id: "fixedAsset",
      },
      {
        id: "otherAsset",
      },
    ],
  },
  {
    id: "debt",
    children: [
      {
        id: "oweCentralBank",
      },
      {
        id: "otherBankCredit",
      },
      {
        id: "oweOtherBank",
      },
      {
        id: "deposit",
      },
      {
        id: "valuablePaper",
      },
      {
        id: "otherDebt",
      },
    ],
  },
  {
    id: "equity",
    children: [
      { id: "capital" },
      { id: "fund" },
      { id: "unDistributedIncome" },
      { id: "minorShareHolderProfit" },
    ],
  },
];

const allStats: Array<keyof ICanDoiKeToanItem> = [
  "asset",
  "shortAsset",
  "cash",
  "shortInvest",
  "shortReceivable",
  "inventory",
  "longAsset",
  "fixedAsset",
  "debt",
  "shortDebt",
  "longDebt",
  "equity",
  "capital",
  "centralBankDeposit",
  "otherBankDeposit",
  "otherBankLoan",
  "stockInvest",
  "customerLoan",
  "badLoan",
  "provision",
  "netCustomerLoan",
  "otherAsset",
  "otherBankCredit",
  "oweOtherBank",
  "oweCentralBank",
  "valuablePaper",
  "payableInterest",
  "receivableInterest",
  "deposit",
  "otherDebt",
  "fund",
  "unDistributedIncome",
  "minorShareHolderProfit",
];

export default function CanDoiKeToanTable({
  data,
  isLoading,
  yearly,
}: {
  data: ICanDoiKeToanItem[] | undefined;
  isLoading: boolean;
  yearly: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [leftIndex, setLeftIndex] = useState(0);
  const [expanded, setExpanded] = useState<string[]>([
    "asset1",
    "asset2",
    "shortAsset",
    "longAsset",
    "debt",
    "equity",
  ]);
  const { data: overviewData } = useMarketOverviewData();

  const isBankSymbol = useMemo(() => {
    if (!overviewData) return false;
    const item = overviewData.find((item) => item.code === data?.[0]?.ticker);
    if (!item || !item.sectors) return false;
    return item.sectors.includes("bank");
  }, [overviewData, data]);

  const finalOrder = isBankSymbol ? bankOrder : normalOrder;

  const itemPerScreenWidth = 8;

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
    return data
      .sort((a, b) => {
        if (a.year > b.year) return 1;
        if (a.year < b.year) return -1;
        if (a.quarter > b.quarter) return 1;
        if (a.quarter < b.quarter) return -1;
        return 0;
      })
      .map((item) => ({ ...item, asset1: item.asset, asset2: item.asset }));
  }, [data]);

  const trendingData = useMemo(() => {
    const result: any = {};
    if (!sortedData) return result;
    for (let i = 0; i < allStats.length; i++) {
      const propName = allStats[i];
      const data = sortedData
        .slice(leftIndex, leftIndex + 8)
        .map((item) => item[propName]);
      result[propName] = data;
    }
    result.asset1 = result.asset;
    result.asset2 = result.asset;
    return result;
  }, [sortedData, leftIndex, itemPerScreenWidth]);

  const showedStats = useMemo(() => {
    const result: string[] = [];
    const recursiveFn = (item: any) => {
      result.push(item.id);
      if (item.children?.length && expanded.includes(item.id)) {
        item.children.forEach((child: any) => {
          recursiveFn(child);
        });
      }
    };
    finalOrder.forEach((item) => {
      recursiveFn(item);
    });
    return result;
  }, [sortedData, expanded]);

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
  }, []);

  const renderTitleCell = (item: { id: string; children: any } | any) => {
    const isExpanded = expanded.includes(item.id);
    const hasChild = item.children?.length;
    return (
      <Fragment key={item.id}>
        <div
          className={cn(
            "sm:text-md flex h-[46px] w-full justify-between overflow-hidden py-2 text-sm font-semibold text-nowrap text-ellipsis",
            hasChild ? "cursor-pointer select-none hover:text-[#67E1C0]" : "",
          )}
          onClick={() =>
            hasChild &&
            setExpanded((prev) =>
              isExpanded
                ? prev.filter((i) => i !== item.id)
                : [...prev, item.id],
            )
          }
        >
          <div className="flex items-center gap-2">
            {hasChild ? (
              <span
                className={cn(
                  "transition-all",
                  isExpanded ? "text-[#67E1C0]" : "-rotate-90",
                )}
              >
                <ChevronDown />
              </span>
            ) : (
              <div className="w-3"></div>
            )}
            <Tooltip content={item.title || propNameToTitle[item.id] || ""}>
              <div className="overflow-hidden text-ellipsis">
                {item.title || propNameToTitle[item.id] || ""}
              </div>
            </Tooltip>
          </div>
          <div className="flex w-[40px] shrink-0 justify-center sm:w-[100px]">
            <div className="flex h-[30px] w-[34px] sm:w-[46px]">
              <SmallTrendChart data={trendingData[item.id]} />
            </div>
          </div>
        </div>
        {hasChild && isExpanded && (
          <div className="text-muted pl-4">
            {item.children.map((child: any) => renderTitleCell(child))}
          </div>
        )}
      </Fragment>
    );
  };

  const renderStatCell = (
    item: ICanDoiKeToanItem,
    propName: keyof ICanDoiKeToanItem,
  ) => {
    return (
      <div className="h-[46px] py-2 text-right leading-8 font-medium">
        {(item[propName] || "-").toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}
      </div>
    );
  };

  return (
    <div className="no-scrollbar h-full w-full overflow-auto">
      <div className="flex h-fit w-full justify-between sm:gap-2">
        <div className="flex h-fit w-[180px] shrink-0 flex-col sm:w-[360px]">
          <div className="mr-2 mb-4 flex h-6 justify-end"></div>
          {finalOrder.map((item) => renderTitleCell(item))}
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
            <div className="flex w-fit min-w-full items-center justify-center">
              {isLoading ? (
                <DefaultLoader />
              ) : (
                sortedData?.map((item, index) => (
                  <Fragment key={index}>
                    <div className="sm:text-md flex w-[70px] flex-col text-sm leading-6 font-semibold sm:w-[100px]">
                      <div className="mb-4 text-end">
                        {yearly ? item.year : `Q${item.quarter}/${item.year}`}
                      </div>
                      {showedStats.map((statsName) => (
                        <Fragment key={statsName}>
                          {renderStatCell(
                            item,
                            statsName as keyof ICanDoiKeToanItem,
                          )}
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
