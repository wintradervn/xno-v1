import useSWRMutation from "swr/mutation";
import { BOT_API_URL } from "./constant";
import { useAuthStore } from "@/store/auth";
import useSWR from "swr";

const useBotPhaiSinhFollowsList = () => {
  const { accessToken } = useAuthStore();
  const { data, isLoading, mutate } = useSWR<
    {
      name: string;
      created: string;
      updated: string;
      notification: boolean;
    }[]
  >(
    accessToken ? [`${BOT_API_URL}/api/v1/bot/follows`, accessToken] : null,
    ([url, accessToken]) =>
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.data),
  );

  return {
    data,
    isLoading,
    mutate,
  };
};

export default useBotPhaiSinhFollowsList;
