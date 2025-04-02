import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface IKetQuaKinhDoanhItem {
  ticker: string; // Stock ticker symbol
  quarter: number; // Fiscal quarter (1-4)
  year: number; // Fiscal year
  revenue: number; // Total revenue
  yearRevenueGrowth: number; // Year-over-year revenue growth
  quarterRevenueGrowth: number; // Quarter-over-quarter revenue growth
  costOfGoodSold: number; // Cost of goods sold
  grossProfit: number; // Gross profit
  operationExpense: number; // Operating expenses
  operationProfit: number; // Operating profit
  yearOperationProfitGrowth: number; // Year-over-year operating profit growth
  quarterOperationProfitGrowth: number; // Quarter-over-quarter operating profit growth
  interestExpense: number; // Interest expenses
  preTaxProfit: number; // Profit before tax
  postTaxProfit: number; // Profit after tax
  shareHolderIncome: number; // Income attributable to shareholders
  yearShareHolderIncomeGrowth: number; // Year-over-year shareholder income growth
  quarterShareHolderIncomeGrowth: number; // Quarter-over-quarter shareholder income growth
  investProfit: number | null; // Investment profit
  serviceProfit: number | null; // Service profit
  otherProfit: number | null; // Other profit
  provisionExpense: number | null; // Provision expenses
  operationIncome: number | null; // Operating income
  ebitda: number; // Earnings before interest, taxes, depreciation, and amortization
}

export default function useKetQuaKinhDoanhData(
  symbol: string | undefined,
  yearly: boolean,
) {
  const { data, isLoading } = useSWR<IKetQuaKinhDoanhItem[]>(
    symbol ? ["ketquakinhdoanh", symbol, yearly] : null,
    async ([, symbol, yearly]) => {
      const res = await fetch(
        `${ROOT_API_URL}/incomestatement?symbol=${symbol}&yearly=${yearly ? "1" : "0"}`,
      );
      const data = await res.json();

      const result =
        data.data.sort((a: IKetQuaKinhDoanhItem, b: IKetQuaKinhDoanhItem) =>
          a.year !== b.year ? a.year - b.year : a.quarter - b.quarter,
        ) || [];

      return result.map((item: IKetQuaKinhDoanhItem) => {
        if (item.yearShareHolderIncomeGrowth === null) {
          const previousYearItem = result.find(
            (i: IKetQuaKinhDoanhItem) =>
              i.year === item.year - 1 && i.quarter === item.quarter,
          );
          if (
            previousYearItem &&
            item.postTaxProfit &&
            previousYearItem.postTaxProfit
          ) {
            item.yearShareHolderIncomeGrowth =
              item.postTaxProfit / previousYearItem.postTaxProfit - 1;
          } else {
            item.yearShareHolderIncomeGrowth = 0;
          }
        }
        return item;
      });
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  return { data, isLoading };
}
