import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface IFilterProData {
  MA: string;
  NGANH: string;
  GIA: number;
  THAYDOI: number;
  THANHKHOAN: number;
  KL1KLTB: number;
  NGANHAN: string;
  TRUNGHAN: string;
  DAIHAN: string;
  SUCMANH: string;
  RS: number;
  PE: number;
  ROE: number;
  BLNR: number;
  TTDT: number;
  TTLN: number;
  CHIENLUOC: string;
  GIAMUA: string;
  GIABAN: number;
  LAILO: string;
  NGAYMUA: string;
  NGAYBAN: string;
  ptop52W: number;
  plow52W: number;
  pMA20: number;
  pMA50: number;
  pMA100: number;
  pMA200: number;
  candles: string;
  pattern: string;
  vungcau: string;
  vungcung: string;
  hotro: string;
  khangcu: string;
  kenhduoi: string;
  kenhtren: string;
  cmtTA: string;
  DG_bq: number;
  BAT: string;
  skTaichinh: number;
  mohinhKinhdoanh: number;
  hieuquaHoatdong: number;
  diemKythuat: number;
  diemBinhquan: number;
  bulVol: number;
  bearVol: number;
  rrg: string;
  signalSMC: string;
  AiTrend: string;
  pVWMA20: number;
  volume: number;
  volTB50: number;
  ThanhKhoanTB50: number;
  AIPredict20d: number;
}

export default function useFilterProData() {
  const { data, isLoading } = useSWR<IFilterProData[]>(
    `${ROOT_API_URL}/filterpro`,
    async (url: string) => {
      const res = await fetch(url);
      const data = await res.json();
      return data?.data || [];
    },
  );
  return { data, isLoading };
}
