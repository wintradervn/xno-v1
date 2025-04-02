import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface ILichSuGiaoDich {
  Symbol: string;
  Date: string;
  Price: number;
  Volume: number;
  TotalVolume: number;
  Side: "B" | "S";
}

export default function useLichSuGiaoDich(symbol?: string) {
  const { data, isLoading } = useSWR<ILichSuGiaoDich[]>(
    symbol ? ["lich-su-giao-dich", symbol] : null,
    async () => {
      const res = await fetch(
        `${ROOT_API_URL}/intradayquotes?symbol=${symbol}`,
      );
      const data = await res.json();
      return data?.historyIntra.reverse() || [];
    },
    { refreshInterval: 10000 },
  );
  return { data, isLoading };
}
