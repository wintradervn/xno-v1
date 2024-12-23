import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export default function useYTDIndexData(index: string) {
  const { data } = useSWR(
    ["/api/ytd-index-data", index],
    async () => {
      const res = await fetch(
        `${ROOT_API_URL}/ccmb?symbol=${index || "VNINDEX"}&fromday=1-1-2024&today=31-12-2024&count=365`,
      );
      const data = await res.json();

      return (
        data.data.sort((a: any, b: any) =>
          new Date(a.date) > new Date(b.date) ? 1 : -1,
        ) || []
      );
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  return { data };
}
