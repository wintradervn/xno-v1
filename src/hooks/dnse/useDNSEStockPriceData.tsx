import useSWR from "swr";

export interface IDNSEVnindexPriceData {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: number[];
  v: number[];
}

export default function useDNSEStockPriceData({
  symbol,
  resolution = "1D",
  range = 10, //days
  isPhaiSinh = false,
}: {
  symbol?: string;
  resolution?: string;
  range?: number;
  isPhaiSinh?: boolean;
}) {
  const timeFrameFrom = Math.floor(Date.now() / 1000) - range * 24 * 60 * 60; // convert days to seconds
  const { data, isLoading } = useSWR<IDNSEVnindexPriceData>(
    symbol ? ["dnse-price-ohlc", symbol, resolution] : null,
    async ([, s, r]) => {
      const res = await fetch(
        `https://services.entrade.com.vn/chart-api/v2/ohlcs/${isPhaiSinh ? "derivative" : "stock"}?from=${timeFrameFrom}&to=${Math.floor(Date.now() / 1000)}&symbol=${s}&resolution=${r}`,
      );
      const data = await res.json();
      return data;
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
