import useSWR from "swr";
import { BOT_API_URL } from "./constant";

export interface ITradeBotInfo {
  name: string;
  symbol: string;
  freq: string;
  book_size: number;
  positions: number[];
  max_position: number;
  start_candle: string;
  current_candle: string;
  current_position: number;
  avg_price: number;
  current_balance: number;
  cumulative_pnl: number;
  cumulative_return: number;
  cumulative_volume: number;
  cumulative_fee: number;
  sharpe: number;
  mdd: number;
  mdd_5d: number;
  mdd_30d: number;
  mdd_90d: number;
  win_rate: number;
  win_rate_5d: number;
  win_rate_30d: number;
  win_rate_90d: number;
  sharpe_5d: number;
  sharpe_30d: number;
  sharpe_90d: number;
  status: string;
  total_candle: number;
  volume_per_candle: number;
  signal_per_candle: number;
  updated: string;
  total_followers: number;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);

const useBotPhaiSinhListData = () => {
  const { data, isLoading } = useSWR<ITradeBotInfo[]>(
    `${BOT_API_URL}/api/v1/bot/ai/list`,
    fetcher,
  );

  return {
    data,
    isLoading,
  };
};

export default useBotPhaiSinhListData;
