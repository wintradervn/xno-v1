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
    `/api/v2/getVnindex?type=${type || "intra"}`,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data.data.bars.reverse();
    },
  );

  return { data };
}
