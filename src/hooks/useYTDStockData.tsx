import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface IYTDStockData {
  Date: string;
  Buy: number;
  Sell: number;
  Net: number;
  Sum: number;
}

export default function useYTDStockData(symbol: string) {
  const { data } = useSWR<IYTDStockData[]>(
    ["/api/ytd-index-data", symbol],
    async () => {
      const res = await fetch(
        `/api/index-datafeed?type=NnmbVal&from=1704042000&to=1767114000&symbol=${symbol || "VCB"}&countback=365`,
      );
      const data = await res.json();
      const result = data?.t.map((date: number, index: number) => ({
        Date: date * 1000,
        Buy: data.o[index],
        Sell: data.h[index],
        Net: data.o[index] - data.h[index],
        Sum: data.o[index] + data.h[index],
      }));

      return (
        result.sort((a: any, b: any) =>
          new Date(a.Date) > new Date(b.Date) ? 1 : -1,
        ) || []
      );
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  return { data };
}
