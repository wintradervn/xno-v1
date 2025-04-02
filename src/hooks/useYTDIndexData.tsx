import { ROOT_API_URL } from "@/lib/constant";
import { format } from "date-fns";
import useSWR from "swr";

export default function useYTDIndexData(index: string) {
  const today = format(new Date(), "dd-MM-yyyy");
  const fromdayNumbers = today.split("-");
  const fromday = `01-${+fromdayNumbers[1] > 11 ? 1 : +fromdayNumbers[1] + 1}-${+fromdayNumbers[2] - 1}`;

  const { data } = useSWR(
    ["/api/ytd-index-data", index],
    async () => {
      const res = await fetch(
        `${ROOT_API_URL}/ccmb?symbol=${index || "VNINDEX"}&fromday=${fromday}&today=${today}&count=365`,
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
