import { useMemo } from "react";
import useBotPhaiSinhListData from "./useBotPhaiSinhListData";

const useBotPhaiSinhInfoData = (botName?: string) => {
  const { data, isLoading } = useBotPhaiSinhListData();

  const botInfo = useMemo(
    () => (botName ? data?.find((bot) => bot.name === botName) : undefined),
    [data, botName],
  );
  return { data: botInfo, isLoading };
};

export default useBotPhaiSinhInfoData;
