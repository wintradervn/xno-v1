import useDNSEDeals from "@/hooks/dnse/useDNSEDeals";
import { cn, formatNumber } from "@/lib/utils";
import { useMemo } from "react";

export default function ThongTinLaiLoTaiKhoan() {
  const { data: deals } = useDNSEDeals();

  const summaryData: {
    vonThuc: number;
    vonVay: number;
    tongLaiLo: number;
    laiLoPercent: number;
  } = useMemo(() => {
    const result = { vonThuc: 0, vonVay: 0, tongLaiLo: 0, laiLoPercent: 0 };

    deals?.forEach((item) => {
      if (item.status === "OPEN" || item.status === "ODD_LOT") {
        result.vonThuc += item.accumulateSecure;
        result.vonVay += item.currentDebt;
        result.tongLaiLo +=
          item.unrealizedProfit -
          item.estimateRemainTaxAndFee -
          item.unrealizedOpenTaxAndFee -
          item.currentInterest;
        result.laiLoPercent = (result.tongLaiLo * 100) / result.vonThuc;
      }
    });

    return result;
  }, [deals]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col">
        <div className="text-sm text-muted">Vốn thực:</div>
        <div className="text-md font-semibold">
          {formatNumber(summaryData.vonThuc)}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted">Vốn vay:</div>
        <div className="text-md font-semibold">
          {formatNumber(summaryData.vonVay)}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col",
          summaryData.tongLaiLo > 0
            ? "text-green"
            : summaryData.tongLaiLo < 0
              ? "text-red"
              : "text-white",
        )}
      >
        <div className="text-sm text-muted">Tổng lãi lỗ:</div>
        <div className="text-md font-semibold">
          {formatNumber(summaryData.tongLaiLo)} (
          {summaryData.laiLoPercent
            ? summaryData.laiLoPercent.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })
            : "-"}
          ) %
        </div>
      </div>
    </div>
  );
}
