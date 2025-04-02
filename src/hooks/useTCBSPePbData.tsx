import useSWR from "swr";

export default function useTCBSPePbData(symbol?: string, period?: number) {
  const { data, isLoading } = useSWR(
    symbol ? ["tcbs-pepb", symbol, period] : null,
    async ([, symbol, period]) => {
      const res = await fetch(
        `/api/dinh-gia?symbol=${symbol}&period=${period || 5}`,
      );
      const data = await res.json();

      return data;
    },
  );

  return { data: data?.data, rootData: data, isLoading };
}
