import useSWR from "swr";

interface INhanDinhChuyenGia {
  d: string;
  listHisBuy: unknown[];
  reason: string;
  ticker: string;
  type: number;
  value: number | null;
}

export default function useFINSCNhanDinhChuyenGia(symbol?: string) {
  const { data, isLoading } = useSWR(
    symbol ? ["finsc-nhan-dinh-chuyen-gia", symbol] : null,
    ([, symbol]) => {
      return fetch(`https://protrade.finsc.vn/api/cata?symbol=${symbol}`)
        .then((res) => res.json())
        .then((data) => {
          return data.data[0];
        });
    },
    {},
  );
  return { data, isLoading };
}
