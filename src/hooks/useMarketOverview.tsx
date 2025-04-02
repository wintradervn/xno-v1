import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

// {
//   "code": "VRC",
//   "desc": "",
//   "sectors": [],
//   "secType": "S",
//   "symbolName": "Công ty Cổ phần Bất động sản và Đầu tư VRC",
//   "symbolNameEn": "VRC Real Estate and Investment Joint Stock Company",
//   "dayVolume": 21400,
//   "dayValue": 241015000,
//   "weekVolume": 275715,
//   "weekValue": 3142211900,
//   "monthVolume": 275715,
//   "monthValue": 3142211900,
//   "exchange": "HOSE",
//   "dayChange": -200,
//   "dayChangePercent": -1.7621145374449338,
//   "weekChange": -100,
//   "weekChangePercent": -0.8888888888888888,
//   "monthChange": -100,
//   "monthChangePercent": -0.8888888888888888,
//   "avgDay5Value": 648289380,
//   "predictionDayVolume": 21400,
//   "avgDay5Vol": 65586.8,
//   "avgDay10Vol": 105741.7,
//   "avgDay20Vol": 119507.8,
//   "avgMonth3Vol": 951923,
//   "dayVolPercent": 20.237995038854116,
//   "weekVolPercent": 56.29442362301571,
//   "monthVolPercent": 36.32268918190788,
//   "day7ChangePercent": -6.302521008403361,
//   "highWeek52Price": 13700,
//   "lowWeek52Price": 7050,
//   "month1ChangePercent": 24.441964285714285,
//   "month3ChangePercent": 32.73809523809524,
//   "year1ChangePercent": 37.65432098765432,
//   "year3ChangePercent": -41.31578947368421,
//   "year5ChangePercent": -52.95358649789029,
//   "allTimeChangePercent": -39.20751528358905,
//   "dayNetRoomVal": -3390000,
//   "highWeekPrice": 11900,
//   "lowWeekPrice": 10900,
//   "highMonthPrice": 12700,
//   "lowMonthPrice": 7600,
//   "highAllPrice": 41500,
//   "lowAllPrice": 3028.8,
//   "price": 11150,
//   "volume": 8900,
//   "openPrice": 11200,
//   "highPrice": 11800,
//   "lowPrice": 11150,
//   "ceiling": 12100,
//   "floor": 10600,
//   "referPrice": 11350,
//   "avgPrice": 11262.3831775701,
//   "marketCap": 557500000000,
//   "listedShare": "50000000",
//   "tradingDate": "06/12/2024",
//   "indexes": [
//       "VNIndex"
//   ],
//   "pe": 736.24549157,
//   "pb": 0.45695708,
//   "eps": -1.057388,
//   "roa": 0.035058,
//   "roe": 0.062082,
//   "ps": 29.41994824,
//   "time": "14:45:05"
// }

export type TSymbolOverviewData = {
  allTimeChangePercent: number | null;
  avgDay10Vol: number | null;
  avgDay20Vol: number | null;
  avgDay5Value: number | null;
  avgDay5Vol: number | null;
  avgMonth3Vol: number | null;
  avgPrice: number | null;
  ceiling: number | null;
  code: string;
  day7ChangePercent: number | null;
  dayChange: number | null;
  dayChangePercent: number | null;
  dayNetRoomVal: number | null;
  dayVolume: number | null;
  dayValue: number | null;
  dayVolPercent: number | null;
  desc: string | null;
  eps: number | null;
  exchange: string | null;
  floor: number | null;
  highAllPrice: number | null;
  highMonthPrice: number | null;
  highPrice: number | null;
  highWeek52Price: number | null;
  highWeekPrice: number | null;
  lowAllPrice: number | null;
  lowMonthPrice: number | null;
  lowPrice: number | null;
  lowWeekPrice: number | null;
  lowWeek52Price: number | null;
  listedShare: string | null;
  marketCap: number | null;
  month1ChangePercent: number | null;
  month3ChangePercent: number | null;
  monthChange: number | null;
  monthChangePercent: number | null;
  monthValue: number | null;
  monthVolume: number | null;
  openPrice: number | null;
  indexes: string[] | null;
  pb: number | null;
  pe: number | null;
  predictionDayVolume: number | null;
  price: number | null;
  referPrice: number | null;
  roa: number | null;
  roe: number | null;
  ps: number | null;
  secType: string | null; // D: Trái phiếu, S: Cổ phiếu thường, U:quỹ, FU: Phái sinh, W: Chứng quyển, E: chứng chỉ quỹ
  sectors: string[] | null;
  symbolName: string | null;
  symbolNameEn: string | null;
  time: string | null;
  tradingDate: string | null;
  volume: number | null;
  weekChange: number | null;
  weekChangePercent: number | null;
  weekValue: number | null;
  weekVolume: number | null;
  weekVolPercent: number | null;
  year1ChangePercent: number | null;
  year3ChangePercent: number | null;
  year5ChangePercent: number | null;
};

export default function useMarketOverviewData() {
  const { data, isLoading } = useSWR<TSymbolOverviewData[]>(
    `${ROOT_API_URL}/overview`,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return (
        data?.data.sort((a: TSymbolOverviewData, b: TSymbolOverviewData) =>
          a.code.localeCompare(b.code),
        ) || []
      );
    },
    {
      refreshInterval: 10000,
    },
  );

  return { data, isLoading };
}
