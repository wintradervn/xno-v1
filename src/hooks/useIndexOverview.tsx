import useSWR from "swr";

export interface IIndexOverview {
  code: string;
  exchange: string;
  price: number;
  dayVolume: number;
  dayValue: number;
  referPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  foreignBuyVol: number;
  foreignSellVol: number;
  foreignBuyVal: number;
  foreignSellVal: number;
  foreignTotalVal: number;
  foreignTotalVol: number;
  advanceVal: number;
  noChangeVal: number;
  declineVal: number;
  advances: number;
  noChanges: number;
  declines: number;
  dayChange: number;
  dayChangePercent: number;
  year5Change: number;
  year5ChangePercent: number;
  tradingDate: string;
  stocks: any;
  time: string;
  oldCode: string; // Không có trong API
  symbolName: string; // Không có trong API
  secType: "Index"; // Không có trong API
}

const mapIndexCodeToNewCode: Record<string, string> = {
  VNIndex: "VNINDEX",
  HNXIndex: "HNX",
  HNXUpcomIndex: "UPCOM",
  VN30: "VN30",
  HNX30: "HNX30",
};
const mapIndexCodeToName: Record<string, string> = {
  VNIndex: "Chỉ số VNIndex",
  HNXIndex: "Chỉ số HNX",
  HNXUpcomIndex: "Chỉ số UPCOM",
  VN30: "Chỉ số VN30",
  HNX30: "Chỉ số HNX30",
};

const sortOrder = ["VNINDEX", "HNX", "UPCOM", "VN30", "HNX30"];

export default function useIndexOverview() {
  const { data, isLoading } = useSWR<IIndexOverview[]>(
    "/api/indexOverview",
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data.data
        .map((item: any) => ({
          ...item,
          code: mapIndexCodeToNewCode[item.code] || item.code,
          symbolName: mapIndexCodeToName[item.code] || item.code,
          oldCode: item.code,
          secType: "Index",
        }))
        .sort(
          (a: any, b: any) =>
            sortOrder.indexOf(a.code) - sortOrder.indexOf(b.code),
        );
    },
    {
      refreshInterval: 10000,
    },
  );

  return {
    data,
    isLoading,
  };
}
