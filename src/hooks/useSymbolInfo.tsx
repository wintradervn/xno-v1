import useSWR from "swr";
import useCurrentSymbol from "./useCurrentSymbol";
import { INDEXES_INFO, ROOT_API_URL } from "@/lib/constant";

export default function useSymbolInfo(symbol?: string) {
  const { currentSymbol } = useCurrentSymbol();

  const { data, isLoading } = useSWR(
    !INDEXES_INFO[symbol || currentSymbol]
      ? ["orderbook", symbol || currentSymbol]
      : null,
    async () => {
      const res = await fetch(
        `${ROOT_API_URL}/hitprice?symbols=${symbol || currentSymbol}`,
      );
      const data = await res.json();
      return data?.data[0];
    },
    {
      refreshInterval: 100000,
    },
  );

  return { data, isLoading };
}
