import { useMemo } from "react";
import useIndexOverview from "./useIndexOverview";
import useMarketOverviewData from "./useMarketOverview";

export default function useCompiledOverviewData() {
  const { data: marketOverview } = useMarketOverviewData();
  const { data: indexOverview } = useIndexOverview();
  const compliledData = useMemo(() => {
    if (!marketOverview && !indexOverview) return undefined;
    return [...(indexOverview || []), ...(marketOverview || [])];
  }, [marketOverview, indexOverview]);

  return { data: compliledData };
}
