import useSWR from "swr";

export interface IDNSEShareHoldersData {
  shareHolders: ShareHolder[];
  foreignOwnershipRatio: ForeignOwnershipRatio;
  foreignHoldingRatio: ForeignHoldingRatio;
  remainForeignRoom: RemainForeignRoom;
}

interface ShareHolder {
  id: number;
  symbol: string;
  name: string;
  nameEn: string;
  date: string;
  value: number;
  ratio: number;
  positionIds: string;
  positionName: string;
}

interface ForeignOwnershipRatio {
  name: string;
  ratio: number;
}

interface ForeignHoldingRatio {
  name: string;
  ratio: number;
}

interface RemainForeignRoom {
  name: string;
  ratio: number;
}

export default function useDNSEShareHolders(symbol?: string) {
  const { data, isLoading } = useSWR<IDNSEShareHoldersData>(
    symbol ? ["dnse-share-holders", symbol] : null,
    async ([, s]) => {
      const res = await fetch(
        `https://services.entrade.com.vn/senses-api/v2/share-holders?symbol=${s}`,
      );
      const data = await res.json();
      return data;
    },
  );
  return { data, isLoading };
}
