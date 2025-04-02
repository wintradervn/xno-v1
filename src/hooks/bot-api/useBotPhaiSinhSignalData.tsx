import useSWR from "swr";
import { BOT_API_URL } from "./constant";

export interface ITradeBotSignal {
  fred: string;
  name: string;
  position: number;
  positions: number[];
  signal_price: number;
  signal_time: string;
  symbol: string;
  updated: string;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);

const useBotPhaiSinhSignalData = (botName?: string) => {
  const { data, isLoading } = useSWR<ITradeBotSignal>(
    botName ? `${BOT_API_URL}/api/v1/bot/${botName}/signal` : null,
    fetcher,
  );

  return {
    data,
    isLoading,
  };
};

export default useBotPhaiSinhSignalData;
