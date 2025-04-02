import useSWR from "swr";
import { BOT_API_URL } from "./constant";

export interface ITradeBotPNL {
  time: number[];
  value: number[];
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);

const useBotPhaiSinhAvgPriceData = (botName?: string) => {
  const { data, isLoading } = useSWR<ITradeBotPNL>(
    botName ? `${BOT_API_URL}/api/v1/bot/${botName}/avg_price` : null,
    fetcher,
  );

  return {
    data,
    isLoading,
  };
};

export default useBotPhaiSinhAvgPriceData;
