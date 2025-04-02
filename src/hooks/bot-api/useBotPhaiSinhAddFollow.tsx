import useSWRMutation from "swr/mutation";
import { BOT_API_URL } from "./constant";
import { useAuthStore } from "@/store/auth";
import useBotPhaiSinhFollowsList from "./useBotPhaiSinhFollowsList";

const useBotPhaiSinhAddFollow = (botName?: string | null) => {
  const { accessToken } = useAuthStore();
  const { mutate } = useBotPhaiSinhFollowsList();
  const { trigger, isMutating } = useSWRMutation(
    botName && accessToken
      ? `${BOT_API_URL}/api/v1/bot/${botName}/follows`
      : null,
    (url) =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          bot_name: botName,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        mutate();
        return res.json();
      }),
  );

  return {
    trigger,
    isMutating,
  };
};

export default useBotPhaiSinhAddFollow;
