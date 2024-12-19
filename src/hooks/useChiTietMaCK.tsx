import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import useCurrentSymbol from "./useCurrentSymbol";

export default function useChiTietMaCK() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const isOpen = searchParams.get("chiTietMaCK") || "";
  const symbol = searchParams.get("symbol") || "VCB";
  const router = useRouter();

  const setChiTietMaCK = useCallback(
    (chiTietMaCK?: string) => {
      const params = new URLSearchParams(searchParams);
      if (chiTietMaCK) {
        params.set("symbol", chiTietMaCK);
        params.set("chiTietMaCK", "true");
      } else {
        params.delete("chiTietMaCK");
      }
      router.push(pathName + "?" + params.toString());
    },
    [searchParams, pathName, router],
  );

  return {
    isOpen: isOpen === "true",
    symbol: symbol,
    setChiTietMaCK,
  };
}
