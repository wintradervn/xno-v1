import useSWR from "swr";
import { BOT_API_URL } from "./constant";

export interface ITradeBotFee {
  time: number[];
  value: number[];
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);

const useBotPhaiSinhFeeData = (botName?: string) => {
  const { data, isLoading } = useSWR<ITradeBotFee>(
    botName ? `${BOT_API_URL}/api/v1/bot/${botName}/fee` : null,
    fetcher,
  );

  return {
    data,
    isLoading,
  };
};

export default useBotPhaiSinhFeeData;
