import useSWR from "swr";
import useCurrentSymbol from "./useCurrentSymbol";
import { INDEXES_INFO } from "@/lib/constant";

export default function useSymbolInfo(symbol?: string) {
  const { currentSymbol } = useCurrentSymbol();

  const { data, isLoading } = useSWR(
    !INDEXES_INFO[symbol || currentSymbol]
      ? ["orderbook", symbol || currentSymbol]
      : null,
    () => {
      return fetch(`/api/orderbook?symbols=${symbol || currentSymbol}`)
        .then((res) => res.json())
        .then((data) => data.data[0]);
    },
    {
      refreshInterval: 3_000,
      errorRetryCount: 3,
    },
  );

  return { data, isLoading };
}
