import { getLeaderships } from "@/lib/dnse-api";
import useSWR from "swr";

export interface IDNSELeadership {
  id: number;
  symbol: string;
  name: string;
  titleId: number;
  title: string;
  bodPositionIds: string;
  bomPositionIds: string;
  bodPositions: string;
  bomPositions: string;
  yearOfBirth: number;
  personalShares: number;
  nationalShares: number;
  totalShares: number;
  otherShares: number;
  gradeIds: string;
  grades: string;
  independence: boolean;
  fromYear: number;
  date: string;
  ratio: number;
}

export default function useDNSELeaderships(symbol?: string) {
  const { data, isLoading } = useSWR<IDNSELeadership[]>(
    symbol ? ["dnse-leaderships", symbol] : null,
    ([, symbol]) => getLeaderships(symbol as string),
    {
      refreshInterval: 5000,
    },
  );
  return { data, isLoading };
}
