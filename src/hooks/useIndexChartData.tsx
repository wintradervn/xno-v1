import { ROOT_API_URL } from "@/lib/constant";
import { format } from "date-fns";
import useSWR from "swr";

export interface IIndexChartData {
  index: "VNIndex" | "HNXIndex" | "UPCOMIndex" | "VN30";
  OHLCVT: [number, number, number, number, number, number][];
}

const toDay = format(new Date(), "dd-MM-yyyy");
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const fromDay = format(thirtyDaysAgo, "dd-MM-yyyy");

export default function useIndexChartData() {
  const { data } = useSWR<IIndexChartData[]>(
    `${ROOT_API_URL}/indexchart`,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data.indexs;
    },
    {
      refreshInterval: 10000,
    },
  );

  return { data };
}
