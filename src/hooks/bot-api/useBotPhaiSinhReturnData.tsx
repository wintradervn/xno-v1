import useSWR from "swr";
import { BOT_API_URL } from "./constant";

export interface ITradeBotReturn {
  time: number[];
  value: number[];
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);

const useBotPhaiSinhReturnData = (botName?: string) => {
  const { data, isLoading } = useSWR<ITradeBotReturn>(
    botName ? `${BOT_API_URL}/api/v1/bot/${botName}/return` : null,
    fetcher,
  );

  return {
    data,
    isLoading,
  };
};

export default useBotPhaiSinhReturnData;
