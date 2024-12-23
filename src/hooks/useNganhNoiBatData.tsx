import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

interface Stock {
  code: string;
  pe: number;
  pb: number;
  dayMarketCap: number;
  dayMarketCapChangePercent: number;
  dayVolume: number;
  dayValue: number;
  dayNetForeignVal: number;
  exchange: string;
  income: number;
  growthIncomePercent: number;
  grossProfitMargin: number;
  nopat: number;
  growthProfitPercent: number;
  netProfitMargin: number;
}

export interface INganhNoiBatData {
  code: string;
  name: string;
  parentCode: string;
  parentName: string;
  level: number;
  dayMarketCap: number;
  dayMarketCapChangePercent: number;
  dayVolume: number;
  dayValue: number;
  dayNetForeignVal: number;
  stocks: Stock[];
}

export default function useNganhNoiBatData() {
  const { data, isLoading } = useSWR<INganhNoiBatData[]>(
    "nganh-noi-bat",
    async () => {
      const res = await fetch(`${ROOT_API_URL}/sectorstrading`);
      const data = await res.json();
      return data?.data || [];
    },
  );
  return { data, isLoading };
}
