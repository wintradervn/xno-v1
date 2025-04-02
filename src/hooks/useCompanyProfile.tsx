import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface ICompanyProfile {
  code: string;
  icb: string;
  foundingdate: string;
  chartercapital: number;
  numberofemployee: number;
  desc: string;
  listingdate: string;
  exchange: string;
  firstprice: number;
  issueshare: number;
  listedvalue: number;
}

export default function useCompanyProfile(symbol?: string) {
  const { data, isLoading } = useSWR<ICompanyProfile>(
    symbol ? [`${ROOT_API_URL}/companyprofile`, symbol] : null,
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
