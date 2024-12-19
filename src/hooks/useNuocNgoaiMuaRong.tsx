import { ROOT_API_URL } from "@/lib/constant";
import { format } from "date-fns";
import useSWR from "swr";

export interface IMuaBanChuDong {
  date: string;
  symbol: string;
  priceHigh: number;
  priceLow: number;
  priceOpen: number;
  priceAverage: number;
  priceClose: number;
  priceBasic: number;
  totalVolume: number;
  dealVolume: number;
  putthroughVolume: number;
  totalValue: number;
  putthroughValue: number;
  buyForeignQuantity: number;
  buyForeignValue: number;
  sellForeignQuantity: number;
  sellForeignValue: number;
  buyCount: number;
  buyQuantity: number;
  sellCount: number;
  sellQuantity: number;
  adjRatio: number;
  currentForeignRoom: number;
  propTradingNetDealValue: number;
  propTradingNetPTValue: number;
  propTradingNetValue: number;
  unit: number;
}

const toDay = format(Date.now(), "dd-MM-yyyy");

export default function useNuocNgoaiMuaRong(symbol?: string) {
  const { data } = useSWR<IMuaBanChuDong[]>(
    symbol
      ? `${ROOT_API_URL}/ccmb?symbol=${symbol}&fromday=1-10-2024&today=${toDay}&count=3`
      : null,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data.sort((a: IMuaBanChuDong, b: IMuaBanChuDong) =>
        new Date(b.date) > new Date(a.date) ? 1 : -1,
      );
    },
  );

  return { data };
}
