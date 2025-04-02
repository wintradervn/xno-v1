import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface INuocNgoaiSymbolData {
  code: string;
  symbolName?: string;
  price: number;
  dayNetVal: number;
  dayNetVol: number;
  dayBuyVal: number;
  dayBuyVol: number;
  daySellVal: number;
  daySellVol: number;
  dayTotalVol: number;
  dayTotalVal: number;
  tradingDate: string;
  exchange: string;
  dayVolume: number;
  marketCap: number;
  dayChangePercent: number;
}

export default function useNuocNgoaiData() {
  const { data, isLoading } = useSWR<INuocNgoaiSymbolData[]>(
    "nuoc-ngoai",
    async () => {
      const res = await fetch(`${ROOT_API_URL}/foreigntrading`);
      const data = await res.json();
      return data?.data || [];
    },
    { refreshInterval: 10000 },
  );
  return { data, isLoading };
}
