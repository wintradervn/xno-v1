import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import {
  useSymbolWSData,
  useWSDataBySymbol,
} from "@/hooks/websocket/useSymbolInfoWebsocket";
import { cn, formatPrice, formatPriceWithType } from "@/lib/utils";
import { Tooltip } from "@heroui/react";
import React from "react";

const getColor = (change: number) => {
  if (change > 6) return "#DC6BDE";
  if (change > 5) return "#B7B1FF";
  if (change > 4) return "#166F5E";
  if (change > 3) return "#168B74";
  if (change > 2) return "#1FAD8E";
  if (change > 1) return "#38C9A7";
  if (change > 0) return "#67E1C1";
  if (+change.toFixed(2) === 0) return "#F1C617";
  if (change > -1) return "#FDA19B";
  if (change > -2) return "#F97066";
  if (change > -3) return "#F04438";
  if (change > -4) return "#D92D20";
  if (change > -5) return "#B32318";
  if (change > -6) return "#98e5e7";
  return "#0FDEE6";
};

const getAnimationClass = (change: number) => {
  if (change > 6) return "animate-changeBackgroundPurple";
  if (change > 0) return "animate-changeBackgroundGreen";
  if (change === 0) return "";
  if (change > -6) return "animate-changeBackgroundRed";
  return "";
};

function formatVolume(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m"; // Convert to millions
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"; // Convert to thousands
  } else {
    return num.toString(); // Return the number as is if less than 1000
  }
}

function BangGiaItem({ stock }: { stock: any }) {
  const { setChiTietMaCK } = useChiTietMaCK();
  const { siData } = useSymbolWSData(stock.code);

  const price = siData?.price ? siData.price * 1000 : stock.price || 0;
  const dayChangePercent = siData?.changedRatio
    ? siData.changedRatio
    : stock.dayChangePercent || 0;

  return (
    <div
      className="rounded-[6px] bg-transparent hover:bg-white/10"
      style={{
        color: getColor(stock.dayChangePercent),
        border: "1px solid " + getColor(stock.dayChangePercent),
      }}
      onClick={() => setChiTietMaCK(stock.code)}
    >
      <div
        key={stock.symbol + price}
        className={cn(
          "flex h-[24px] cursor-pointer items-center justify-between gap-2 px-2 py-1 text-xs font-semibold select-none hover:brightness-110",
          getAnimationClass(stock.dayChangePercent),
        )}
      >
        <Tooltip
          content={stock.symbolName}
          classNames={{
            content: "border-1 rounded-[6px] shadow-md max-w-[200px]",
          }}
        >
          <div className="text-foreground min-w-fit flex-1">{stock.code}</div>
        </Tooltip>
        <div
          className="animate-change-background-cyan flex-1 text-center"
          key={price}
        >
          {formatPriceWithType(price, stock.secType)}
        </div>
        <div
          className="animate-change-background-cyan flex-1"
          key={dayChangePercent}
        >
          {dayChangePercent?.toFixed(2)}%
        </div>
        <div className="text-foreground flex-1 text-end">
          {formatVolume(stock.dayVolume)}
        </div>
      </div>
    </div>
  );
}

export default React.memo(
  BangGiaItem,
  ({ stock: prevStock }, { stock: nextStock }) =>
    prevStock.symbol === nextStock.symbol,
);
