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

const useBotPhaiSinhPNLData = (botName?: string) => {
  const { data, isLoading } = useSWR<ITradeBotPNL>(
    botName ? `${BOT_API_URL}/api/v1/bot/${botName}/pnl` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  return {
    data,
    isLoading,
  };
};

export default useBotPhaiSinhPNLData;
