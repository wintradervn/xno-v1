import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import useIsMobile from "./useIsMobile";

export default function useChiTietMaCK() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const isOpen = searchParams.get("chiTietMaCK") || "";
  const symbol = searchParams.get("symbol") || "VCB";
  const router = useRouter();
  const isMobile = useIsMobile();

  const setChiTietMaCK = useCallback(
    (chiTietMaCK?: string) => {
      const params = new URLSearchParams(searchParams);

      if (chiTietMaCK) {
        params.set("symbol", chiTietMaCK);
        if (isMobile) {
          params.delete("rightTab");
          router.push("/giao-dich?" + params.toString());
          return;
        }
        if (!pathName.startsWith("/giao-dich")) {
          params.set("chiTietMaCK", "true");
        }
      } else {
        params.delete("chiTietMaCK");
      }
      router.push(pathName + "?" + params.toString());
    },
    [searchParams, pathName, router, isMobile],
  );

  return {
    isOpen: isOpen === "true",
    symbol: symbol,
    setChiTietMaCK,
  };
}
