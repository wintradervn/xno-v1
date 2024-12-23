import useSWR from "swr";
import useCurrentSymbol from "./useCurrentSymbol";
import { INDEXES_INFO, ROOT_API_URL } from "@/lib/constant";

export default function useSymbolInfo(symbol?: string) {
  const { currentSymbol } = useCurrentSymbol();

  const { data, isLoading } = useSWR(
    !INDEXES_INFO[symbol || currentSymbol]
      ? ["orderbook", symbol || currentSymbol]
      : null,
    () => {
      return fetch(
        `${ROOT_API_URL}/hitprice?symbols=${symbol || currentSymbol}`,
      )
        .then((res) => res.json())
        .then((data) => data.data.d[0]);
    },
    {
      refreshInterval: 3_000,
      errorRetryCount: 3,
    },
  );

  return { data, isLoading };
}
