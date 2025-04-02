import { ROOT_API_URL } from "@/lib/constant";
import { format } from "date-fns";
import useSWR from "swr";

export interface IRRGData {
  date: string;
  rs: number;
  rm: number;
}

const toDay = format(new Date(), "dd-MM-yyyy");

export default function useRRGData(symbols?: string[], dayCount = 10) {
  const dayAgo = new Date();
  dayAgo.setDate(dayAgo.getDate() - dayCount);
  const fromDay = format(dayAgo, "dd-MM-yyyy");

  const { data } = useSWR<any>(
    symbols && fromDay && toDay ? [symbols, fromDay, toDay] : null,
    async ([symbols, fromDay, toDay]) => {
      if (!symbols) return [];

      const res = await Promise.all(
        symbols.map((symbol: string) =>
          fetch(
            `${ROOT_API_URL}/rrg?symbol=${symbol}&fromday=${fromDay}&today=${toDay}`,
          )
            .then((r) => r.json())
            .then((r) => r.data),
        ),
      );

      return res;
    },
  );

  return { data };
}
