import useSWR from "swr";
import { BOT_API_URL } from "./constant";

export interface ITradeBotPosition {
  time: number[];
  value: number[];
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);

const useBotPhaiSinhPositionsData = (botName?: string) => {
  const { data, isLoading } = useSWR<ITradeBotPosition>(
    botName ? `${BOT_API_URL}/api/v1/bot/${botName}/position` : null,
    fetcher,
  );

  return {
    data,
    isLoading,
  };
};

export default useBotPhaiSinhPositionsData;
