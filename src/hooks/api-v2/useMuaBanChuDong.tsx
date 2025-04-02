import { ROOT_API_URL } from "@/lib/constant";
import { format } from "date-fns";
import useSWR from "swr";

export interface IMuaBanChuDong {
  Date: string;
  Buy: number;
  Sell: number;
  Net: number;
  Sum: number;
}

const toDay = format(Date.now(), "dd-MM-yyyy");

export default function useMuaBanChuDong(symbol?: string) {
  const { data, isLoading } = useSWR<IMuaBanChuDong[]>(
    symbol
      ? `${ROOT_API_URL}/ccmb?symbol=${symbol}&fromday=1-1-2025&today=${toDay}&count=20`
      : null,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data.sort((a: IMuaBanChuDong, b: IMuaBanChuDong) =>
        new Date(b.Date) > new Date(a.Date) ? -1 : 1,
      );
    },
  );

  return { data, isLoading };
}
