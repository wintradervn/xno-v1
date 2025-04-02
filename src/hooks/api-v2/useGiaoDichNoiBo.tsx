import { ROOT_API_URL } from "@/lib/constant";
import { format } from "date-fns";
import useSWR from "swr";

export interface IGiaoDichNoiBo {
  _id: string;
  code: string;
  side: "buy" | "sell";
  tradingTime: string; // ISO date string
  volume: number;
  __v: number;
  averagePrice?: number; // Optional, as some entries might not have it
  createdAt: string; // ISO date string
  insiderName: string;
  insiderOccupation?: string; // Optional, as it might be empty
  updatedAt: string; // ISO date string
  value?: number; // Optional, as some entries might not have it
}

export default function useGiaoDichNoiBo(symbol?: string) {
  const { data, isLoading } = useSWR<IGiaoDichNoiBo[]>(
    symbol ? `${ROOT_API_URL}/insider-trans?symbol=${symbol}` : null,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data.sort((a: IGiaoDichNoiBo, b: IGiaoDichNoiBo) =>
        new Date(b.tradingTime) > new Date(a.tradingTime) ? -1 : 1,
      );
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  return { data, isLoading };
}
