"use client";

import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useIndexOverview from "@/hooks/useIndexOverview";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Updater() {
  const { currentSymbol } = useCurrentSymbol();
  const { data: overViewData } = useMarketOverviewData();
  const { data: indexData } = useIndexOverview();
  const router = useRouter();
  useEffect(() => {
    if (!currentSymbol) return;

    let invalidSymbol = true;
    if (
      !overViewData ||
      overViewData.some(
        (item) => item.code.toLowerCase() === currentSymbol.toLowerCase(),
      )
    ) {
      invalidSymbol = false;
    }
    if (
      !indexData ||
      indexData.some(
        (item) => item.code.toLowerCase() === currentSymbol.toLowerCase(),
      )
    ) {
      invalidSymbol = false;
    }
    if (invalidSymbol) {
      console.log("🚀 ~ useEffect ~ invalidSymbol:", invalidSymbol);
      router.push("/404");
    }
  }, [overViewData, indexData, currentSymbol]);
  return <></>;
}
