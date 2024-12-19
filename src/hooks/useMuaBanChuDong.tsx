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
  const { data } = useSWR<IMuaBanChuDong[]>(
    symbol
      ? `/api/v2/ccmb?symbol=${symbol}&fromday=1-10-2024&today=${toDay}&count=3`
      : null,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data.sort((a: IMuaBanChuDong, b: IMuaBanChuDong) =>
        new Date(b.Date) > new Date(a.Date) ? 1 : -1,
      );
    },
  );

  return { data };
}
