import { ROOT_API_URL } from "@/lib/constant";
import { format } from "date-fns";
import useSWR from "swr";

interface DataNode {
  y: number;
  label: string;
}
export interface IDongTienThongMinh {
  NL_arr: DataNode[];
  DC_arr: DataNode[];
  TC_arr: DataNode[];
}

export default function useDongTienThongMinh(symbol?: string) {
  const { data, isLoading } = useSWR<IDongTienThongMinh>(
    symbol ? `${ROOT_API_URL}/moneyflow?symbol=${symbol}` : null,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data;
    },
  );

  return { data, isLoading };
}
