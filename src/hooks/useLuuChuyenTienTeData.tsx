import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface ILuuChuyenTienTeData {
  ticker: string;
  quarter: number;
  year: number;
  investCost: number;
  fromInvest: number;
  fromFinancial: number;
  fromSale: number;
  freeCashFlow: number;
}

export default function useLuuChuyenTienTeData(
  symbol: string | undefined,
  yearly: boolean,
) {
  const { data, isLoading } = useSWR<ILuuChuyenTienTeData[]>(
    symbol ? ["luuchuyentiente", symbol, yearly] : null,
    async ([, symbol, yearly]) => {
      const res = await fetch(
        `${ROOT_API_URL}/cashflow?symbol=${symbol}&yearly=${yearly ? "1" : "0"}`,
      );
      const data = await res.json();
      return data.data || [];
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
