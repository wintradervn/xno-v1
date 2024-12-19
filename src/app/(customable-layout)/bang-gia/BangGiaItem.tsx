import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import { formatPrice } from "@/lib/utils";
import React from "react";

const getColor = (change: number) => {
  if (change > 6.7) return "#DC6BDE";
  if (change > 6) return "#B7B1FF";
  if (change > 5) return "#1FAD8E";
  if (change > 4) return "#38C9A7";
  if (change > 3) return "#67E1C1";
  if (change > 2) return "#9FF0D7";
  if (change > 1) return "#CFF8EB";
  if (change > 0) return "#CFF8EB";
  if (+change.toFixed(2) === 0) return "#F1C617";
  if (change > -1) return "#FEF3F2";
  if (change > -2) return "#FECDC9";
  if (change > -3) return "#FDA19B";
  if (change > -4) return "#F97066";
  if (change > -5) return "#F04438";
  if (change > -6) return "#98e5e7";
  if (change > -6.7) return "#0FDEE6";
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
  return (
    <div
      key={stock.symbol}
      className="flex h-[24px] cursor-pointer select-none items-center justify-between gap-2 rounded-[6px] px-2 py-1 text-xs font-semibold text-black hover:brightness-110"
      style={{ backgroundColor: getColor(stock.dayChangePercent) }}
      onClick={() => setChiTietMaCK(stock.code)}
    >
      <div className="min-w-fit flex-1">{stock.code}</div>
      <div className="flex-1">{formatPrice(stock.price)}</div>
      <div className="flex-1">{stock.dayChangePercent?.toFixed(2)}%</div>
      <div className="flex-1 text-end">{formatVolume(stock.dayVolume)}</div>
    </div>
  );
}

export default React.memo(
  BangGiaItem,
  ({ stock: prevStock }, { stock: nextStock }) =>
    prevStock.symbol === nextStock.symbol,
);
