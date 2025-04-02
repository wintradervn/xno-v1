import { TSymbolOverviewData } from "@/hooks/useMarketOverview";
import { clsx, type ClassValue } from "clsx";
import {
  intervalToDuration,
  formatDuration as formatDurationDateFns,
} from "date-fns";
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
  noNgTy?: boolean,
) {
  if (!number) {
    return "-";
  }
  if (isNaN(+number)) {
    return number || "-";
  }

  const symbol = +number >= 0 ? "" : "-";

  if (!noNgTy && Math.abs(+number) >= 1000_000_000_000) {
    return (
      symbol +
      (Math.abs(+number) / 1000_000_000_000).toFixed(fixed ?? 2) +
      " Ng tỷ"
    );
  }
  if (Math.abs(+number) >= 10_000_000) {
    return (
      symbol +
      formatNumber(Math.abs(+number) / 1000_000_000, fixed ?? 2) +
      " tỷ"
    );
  }
  if (showFull && Math.abs(+number) >= 10_000) {
    return (
      symbol + formatNumber(Math.abs(+number) / 1000_000, fixed ?? 2) + " tr"
    );
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
  if (item.price === item.ceiling) return "text-ceiling";
  if (item.price === item.floor) return "text-floor";
  return item.dayChange > 0 ? "text-green" : "text-red";
}

export function formatPriceWithType(
  price?: number | null,
  type?: string | null, // "Index" | "S" | "FU" | "W" | "D",
) {
  if (type === "S" || type === "W" || type === null) {
    return formatPrice(price);
  }
  return formatNumber(price, 2);
}

function removeDiacritics(str: string) {
  const diacriticsMap: any = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    đ: "d",
  };

  return str
    .split("")
    .map((char) => diacriticsMap[char] || char)
    .join("");
}

export function localSearch(value: string, query: string) {
  // Normalize the query by removing diacritics and converting to lowercase
  const normalizedQuery = removeDiacritics(query).toLowerCase();

  // Filter the data based on the normalized query
  return removeDiacritics(value.replaceAll("/", ""))
    .toLowerCase()
    .includes(normalizedQuery);
}

export const generateRandomId = () =>
  `gradient-${Math.random().toString(36).substr(2, 9)}`;

export const formatDuration = ({
  start,
  end,
}: {
  start: string;
  end: string;
}) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days} ngày ${hours} giờ ${minutes} phút`;
};
