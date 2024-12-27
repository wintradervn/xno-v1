import useSWR from "swr";

export interface IDNSEVnindexPriceData {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: number[];
  v: number[];
}

export default function useDNSEStockPriceData(symbol?: string) {
  const { data, isLoading } = useSWR<IDNSEVnindexPriceData>(
    symbol ? ["dnse-vnindex-price-ohlc", symbol] : null,
    async ([, s]) => {
      const res = await fetch(
        `https://services.entrade.com.vn/chart-api/v2/ohlcs/stock?from=1704042000&to=1735578000&symbol=${s}&resolution=30`,
      );
      const data = await res.json();
      return data;
    },
  );
  return { data, isLoading };
}
