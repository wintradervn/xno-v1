import useSWRMutation from "swr/mutation";
import { BOT_API_URL } from "./constant";
import { useAuthStore } from "@/store/auth";

const useBotPhaiSinhUnFollow = (botName?: string | null) => {
  const { accessToken } = useAuthStore();
  const { trigger, isMutating } = useSWRMutation(
    botName && accessToken
      ? `${BOT_API_URL}/api/v1/bot/${botName}/follows`
      : null,
    (url) =>
      fetch(url, {
        method: "DELETE",
        body: JSON.stringify({
          bot_name: botName,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  );

  return {
    trigger,
    isMutating,
  };
};

export default useBotPhaiSinhUnFollow;
