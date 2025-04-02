import { ROOT_API_URL } from "@/lib/constant";
import { format } from "date-fns";
import useSWR from "swr";

export interface IChiSoTaiChinh {
  ticker: string;
  quarter: number;
  year: number;
  priceToEarning?: number;
  priceToBook?: number;
  valueBeforeEbitda?: number;
  dividend?: number;
  roe: number;
  roa: number;
  daysReceivable: number;
  daysInventory: number;
  daysPayable: number;
  ebitOnInterest: number;
  earningPerShare: number;
  bookValuePerShare: number;
  interestMargin: any;
  nonInterestOnToi: any;
  badDebtPercentage: any;
  provisionOnBadDebt: any;
  costOfFinancing: any;
  equityOnTotalAsset: number;
  equityOnLoan: any;
  costToIncome: any;
  equityOnLiability: number;
  currentPayment: number;
  quickPayment: number;
  epsChange: number;
  ebitdaOnStock: number;
  grossProfitMargin: number;
  operatingProfitMargin: number;
  postTaxMargin: number;
  debtOnEquity: number;
  debtOnAsset: number;
  debtOnEbitda: number;
  shortOnLongDebt: number;
  assetOnEquity: number;
  capitalBalance: number;
  cashOnEquity: number;
  cashOnCapitalize?: number;
  cashCirculation: number;
  revenueOnWorkCapital: number;
  capexOnFixedAsset: number;
  revenueOnAsset: number;
  postTaxOnPreTax: number;
  ebitOnRevenue: number;
  preTaxOnEbit: number;
  preProvisionOnToi: any;
  postTaxOnToi: any;
  loanOnEarnAsset: any;
  loanOnAsset: any;
  loanOnDeposit: any;
  depositOnEarnAsset: any;
  badDebtOnAsset: any;
  liquidityOnLiability: any;
  payableOnEquity: number;
  cancelDebt: any;
  ebitdaOnStockChange?: number;
  bookValuePerShareChange: number;
  creditGrowth: any;
}
export default function useChiSoTaiChinhData(
  symbol?: string,
  yearly?: boolean,
) {
  const { data, isLoading } = useSWR<IChiSoTaiChinh[]>(
    symbol
      ? `${ROOT_API_URL}/financialratio?symbol=${symbol}&yearly=${yearly ? "1" : "0"}`
      : null,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return (
        data.data.sort((a: IChiSoTaiChinh, b: IChiSoTaiChinh) =>
          a.year !== b.year ? a.year - b.year : a.quarter - b.quarter,
        ) || []
      );
    },
  );

  return { data, isLoading };
}
