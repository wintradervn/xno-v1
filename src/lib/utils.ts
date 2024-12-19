import { TSymbolOverviewData } from "@/hooks/useMarketOverview";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | null | undefined) {
  if (!price) {
    return "-";
  }
  if (isNaN(+price)) {
    return price || "-";
  }
  if (+price === 0) {
    return "-";
  }

  const toFixed2Value = +(+price / 1000).toFixed(2);

  if (Math.abs(toFixed2Value) < 0.01) {
    return +price / 1000 > 0 ? "0.01" : "-0.01";
  }

  return (+(+price / 1000).toFixed(2)).toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatNumber(
  number: number | string | null | undefined,
  fixed?: number,
) {
  if (!number) {
    return "-";
  }
  if (isNaN(+number)) {
    return number || "-";
  }
  return (+number).toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: fixed || 0,
    maximumFractionDigits: fixed || 0,
  });
}

export function formatVeryLargeNumber(
  number: number | string | undefined | null,
  showFull?: boolean,
  fixed?: number,
) {
  if (!number) {
    return "-";
  }
  if (isNaN(+number)) {
    return number || "-";
  }

  const symbol = +number >= 0 ? "" : "-";

  if (Math.abs(+number) >= 1000_000_000_000) {
    return (
      symbol +
      (Math.abs(+number) / 1000_000_000_000).toFixed(fixed ?? 2) +
      " Ng tỷ"
    );
  }
  if (Math.abs(+number) >= 10_000_000) {
    return (
      symbol + (Math.abs(+number) / 1000_000_000).toFixed(fixed ?? 2) + " tỷ"
    );
  }
  if (showFull && Math.abs(+number) >= 10_000) {
    return symbol + (Math.abs(+number) / 1000_000).toFixed(fixed ?? 2) + " tr";
  }
  return showFull ? symbol + formatNumber(number) : "<0.01 tỷ";
}

export function getPriceColor(change: number | null) {
  if (change === null) return "text-white";
  const fixedChange = change.toFixed(2);
  if (+fixedChange > 0) return "text-green";
  if (+fixedChange < 0) return "text-red";
  return "text-yellow";
}

export function getPriceColorFromOverviewData(item?: TSymbolOverviewData) {
  if (!item?.dayChange && item?.dayChange !== 0) return "text-white";
  if (item.dayChange === 0) return "text-yellow";
  if (item.price === item.ceiling) return "text-purple";
  if (item.price === item.floor) return "text-cyan";
  return item.dayChange > 0 ? "text-green" : "text-red";
}
