"use client";

import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useIndexOverview from "@/hooks/useIndexOverview";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import { useUpdaterPriceWS } from "@/hooks/websocket/useSymbolInfoWebsocket";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Updater() {
  const { currentSymbol } = useCurrentSymbol();
  const { data: overviewData } = useMarketOverviewData();
  const { data: indexData } = useIndexOverview();
  const router = useRouter();

  useUpdaterPriceWS();

  // Check xem symbol hiện tại có tồn tại hay không
  useEffect(() => {
    if (!currentSymbol) return;

    let invalidSymbol = true;
    if (
      !overviewData ||
      overviewData.some(
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
      router.push("/404");
    }
  }, [overviewData, indexData, currentSymbol]);
  return <></>;
}
