import { useMemo } from "react";
import useIndexOverview from "./useIndexOverview";
import useMarketOverviewData from "./useMarketOverview";

export default function useCompiledOverviewData() {
  const { data: marketOverview, isLoading } = useMarketOverviewData();
  const { data: indexOverview, isLoading: isLoading2 } = useIndexOverview();
  const compliledData = useMemo(() => {
    if (!marketOverview && !indexOverview) return undefined;
    return [...(indexOverview || []), ...(marketOverview || [])];
  }, [marketOverview, indexOverview]);

  return { data: compliledData, isLoading: isLoading && isLoading2 };
}
