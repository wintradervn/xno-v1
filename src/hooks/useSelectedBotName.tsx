import { useIsShowLockerSanBot } from "@/app/(main-layout)/(customable-layout)/san-bot/useIsShowLockerSanBot";
import { useAuthStore } from "@/store/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useSelectedBotName() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const botName = searchParams.get("botName");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setIsShowLocker = useIsShowLockerSanBot(
    (state) => state.setIsShowLocker,
  );

  const setBotName = useCallback(
    (botName?: string) => {
      if (!user) {
        setIsShowLocker(true);
        return;
      }
      const params = new URLSearchParams(searchParams);

      if (botName) {
        params.set("botName", botName);
      } else {
        params.delete("botName");
      }
      router.replace(pathName + "?" + params.toString());
    },
    [searchParams, pathName, router, user, setIsShowLocker],
  );

  return {
    botName: botName,
    setBotName,
  };
}
