import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useRightPanelState() {
  const searchParams = useSearchParams();
  const state = searchParams.get("rightTab") || "";
  const pathname = usePathname();
  const { replace } = useRouter();

  const setState = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("rightTab", value);
      } else {
        params.delete("rightTab");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace],
  );

  return { state, setState };
}
