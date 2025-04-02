import { INDEXES_INFO } from "@/lib/constant";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useCurrentSymbol() {
  const searchParams = useSearchParams();
  const state = searchParams.get("symbol") || "VNINDEX";
  const pathname = usePathname();
  const { replace } = useRouter();

  const setState = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("symbol", value);
      } else {
        params.delete("symbol");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace],
  );

  return {
    currentSymbol: state,
    setCurrentSymbol: setState,
    isIndex: !!INDEXES_INFO[state],
  };
}
