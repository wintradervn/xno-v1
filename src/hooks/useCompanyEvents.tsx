import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface ICompanyEvent {
  code: string;
  eventname: string;
  eventtitle: string;
  exrightdate?: string;
  issuedate?: string;
  publicdate: string;
  ratio: string;
  recorddate?: string;
  sortexrightdate: string;
  value: string;
}

export default function useCompanyEvents(symbol?: string) {
  const { data, isLoading } = useSWR<ICompanyEvent[]>(
    symbol ? [`${ROOT_API_URL}/companyevents`, symbol] : null,
    async ([url, symbol]) => {
      const res = await fetch(url + "/" + symbol);
      const data = await res.json();
      return data.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );
  return { data, isLoading };
}
