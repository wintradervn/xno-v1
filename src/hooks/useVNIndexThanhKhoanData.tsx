import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface IVNIndexThanhKhoanData {
  code: string;
  open: number;
  highest: number;
  lowest: number;
  close: number;
  volume: number;
  value: number;
  allVolume: number;
  allValue: number;
  timeframe: "1m";
  time: string;
}

export default function useVNIndexThanhKhoanData(type?: string) {
  const { data } = useSWR<IVNIndexThanhKhoanData[]>(
    `${ROOT_API_URL}/getVnindex?type=${"5day"}`,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data.data.bars.reverse();
    },
  );

  return { data };
}
