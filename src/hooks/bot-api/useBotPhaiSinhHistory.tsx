import { useMemo } from "react";
import useBotPhaiSinhMarketPriceData from "./useBotPhaiSinhMarketPriceData";
import useBotPhaiSinhPNLData from "./useBotPhaiSinhPNLData";
import useBotPhaiSinhPositionsData from "./useBotPhaiSinhPositionsData";

export default function useBotPhaiSinhHistory(botName?: string) {
  const { data: positionData } = useBotPhaiSinhPositionsData(botName);
  const { data: priceData } = useBotPhaiSinhMarketPriceData(botName);
  const { data: pnlData } = useBotPhaiSinhPNLData(botName);

  const history = useMemo(() => {
    if (!positionData || !priceData || !pnlData) return [];
    const history: any = [];
    let lastPosition = 0;
    let lastOpenPositionIndex = 0;

    positionData.value.forEach((position, index) => {
      if (position !== lastPosition) {
        const newPos: any = {
          position,
          signal_price: priceData.value[index],
          open_time: positionData.time[index],
          change: position - lastPosition,
          pnl:
            pnlData.value[index] -
            (lastOpenPositionIndex ? pnlData.value[lastOpenPositionIndex] : 0),
        };
        let newPos2;
        if (lastPosition > 0 && position < 0) {
          newPos2 = { ...newPos, type: "Short", change: position };
          newPos.type = "Cover";
          newPos.position = 0;
          newPos.change = 0 - lastPosition;
          newPos.close_time = positionData.time[index];
        } else if (lastPosition < 0 && position > 0) {
          newPos2 = { ...newPos, type: "Long", change: position };
          newPos.type = "Cover";
          newPos.position = 0;
          newPos.change = 0 - lastPosition;
          newPos.close_time = positionData.time[index];
        } else if (0 >= lastPosition && lastPosition > position) {
          newPos.type = "Short";
        } else if (position > lastPosition && lastPosition >= 0) {
          newPos.type = "Long";
        } else if (Math.abs(position) < Math.abs(lastPosition)) {
          newPos.type = "Cover";
          newPos.close_time = positionData.time[index];
        }
        if (
          history[history.length - 1] &&
          history[history.length - 1].type !== "Cover"
        ) {
          history[history.length - 1].close_time = positionData.time[index];
        }

        history.push(newPos);
        newPos2 && history.push(newPos2);
        lastOpenPositionIndex = index;
        lastPosition = position;
      }
    });
    return history;
  }, [positionData, priceData, pnlData]);
  return { history };
}
