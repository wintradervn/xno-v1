import useSWR from "swr";

export interface ITuDoanhSymbolData {
  code: string;
  tradingDate: string;
  proprietaryTotalBuyTradeValue: number;
  proprietaryTotalBuyTradeVolume: number;
  proprietaryTotalSellTradeValue: number;
  proprietaryTotalSellTradeVolume: number;
  netProprietaryValue: number;
  symbolName: string;
  exchange: string;
}

export default function useTuDoanhData() {
  const { data, isLoading } = useSWR<ITuDoanhSymbolData[]>(
    "tu-doanh",
    async () => {
      const res = await fetch("/api/tu-doanh");
      const data = await res.json();
      return data?.data || [];
    },
  );
  return { data, isLoading };
}
