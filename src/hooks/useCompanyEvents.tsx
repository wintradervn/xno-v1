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
    symbol ? ["/api/v2/companyevents", symbol] : null,
    async ([url, symbol]) => {
      const res = await fetch(url + "/" + symbol);
      const data = await res.json();
      return data.data;
    },
  );
  return { data, isLoading };
}
