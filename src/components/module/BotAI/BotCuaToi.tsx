import DefaultLoader from "@/components/ui/DefaultLoader";
import ProFeatureLocker from "@/components/ui/ProFeatureLocker";
import useBotPhaiSinhFollowsList from "@/hooks/bot-api/useBotPhaiSinhFollowsList";
import useBotPhaiSinhListData, {
  ITradeBotInfo,
} from "@/hooks/bot-api/useBotPhaiSinhListData";
import useSelectedBotName from "@/hooks/useSelectedBotName";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";
import React, { useMemo } from "react";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import BotPhaiSinhMiniChart from "@/components/charts/BotPhaiSinhMiniChart";
import useBotPhaiSinhUnFollow from "@/hooks/bot-api/useBotPhaiSinhUnFollow";
import { toast } from "react-toastify";

export function BotCuaToi() {
  const user = useAuthStore((state) => state.user);

  const { data: followsList, isLoading } = useBotPhaiSinhFollowsList();
  console.log("🚀 ~ BotCuaToi ~ followsList:", followsList);
  const { data: listData } = useBotPhaiSinhListData();

  const followsListData = useMemo(() => {
    if (!followsList || !listData) return [];
    const followsListData = followsList.map((item) => {
      return listData.find((data) => data.name === item.name);
    });
    return followsListData.filter((i) => i !== undefined) as ITradeBotInfo[];
  }, [followsList, listData]);

  return (
    <div className="@container h-full">
      <div className="relative flex h-full w-full flex-col items-center gap-3 overflow-y-auto">
        {!user ? (
          <ProFeatureLocker
            bgUrl="/image/blur-bot-cua-toi.png"
            lightBgUrl="/image/blur-bot-cua-toi-light.png"
            backgroundSize={"cover"}
          />
        ) : isLoading ? (
          <DefaultLoader />
        ) : followsList?.length === 0 ? (
          <>
            <div className="relative mt-5 h-20 w-20">
              <Image src="/image/no-bot.png" fill alt="No bot" />
            </div>
            <div className="max-w-[280px] text-center text-sm font-medium text-[#98A2B3]">
              Hiện tại, bạn chưa có bot nào trong danh sách. Hãy thêm bot để
              nhận tín hiệu giao dịch và tối ưu chiến lược đầu tư của bạn!
            </div>
          </>
        ) : (
          <div className="grid w-full min-w-[300px] shrink-0 grid-cols-1 gap-2 @xl:grid-cols-2 @3xl:grid-cols-3 @3xl:gap-3 @6xl:grid-cols-4 @6xl:gap-5">
            {followsListData?.map((item) => (
              <MemorizedBotItem item={item} key={item.name} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const MemorizedBotItem = React.memo(function BotItem({
  item,
}: {
  item: ITradeBotInfo;
}) {
  const { setBotName } = useSelectedBotName();
  const { trigger, isMutating } = useBotPhaiSinhUnFollow(item.name);
  const { mutate } = useBotPhaiSinhFollowsList();
  return (
    <div className="border-border flex flex-col gap-2 rounded-[8px] border p-3">
      <div className="flex items-center justify-between gap-2">
        <div
          className="text-md cursor-pointer font-bold hover:brightness-90"
          onClick={() => setBotName(item.name)}
        >
          {item.symbol}{" "}
          <span className="text-muted ml-1 text-sm font-medium">
            {item.freq}
          </span>
        </div>

        <div>
          <div
            className={cn(
              "text-foreground hover: hover:bg-card cursor-pointer rounded-full border-1 border-[#1D2939] bg-[#1D2939] px-2 py-1 text-xs",
              isMutating && "brightness-90",
            )}
            onClick={() => {
              if (isMutating) return;
              trigger()
                .then(() => {
                  toast.success("Hủy nhận tín hiệu thành công!");
                  mutate();
                })
                .catch(() => toast.error("Hủy nhận tín hiệu thất bại!"));
            }}
          >
            Hủy nhận tín hiệu
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-muted text-sm">Lợi nhuận(%)</div>
          <div className="text-green text-xl font-semibold">
            {formatNumber(item.cumulative_return * 100, 2)}%
          </div>
        </div>
        <div>
          <React.Suspense fallback={<DefaultLoader className="!h-10" />}>
            <BotPhaiSinhMiniChart botName={item.name} />
          </React.Suspense>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="text-muted text-xs">Thời gian hoạt động</div>
          <div className="text-foreground text-sm font-semibold">
            {formatDuration({
              start: item.start_candle,
              end: item.current_candle,
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-1">
          <div className="text-muted text-xs">Tỷ lệ thắng:</div>
          <div className="text-green text-sm font-semibold">
            {formatNumber(item.win_rate * 100, 2)}%
          </div>
        </div>
        <div className="flex items-end gap-1">
          <div className="text-muted text-xs">Max drawdown:</div>
          <div className="text-red text-sm font-semibold">
            {formatNumber(item.mdd * 100, 2)}%
          </div>
        </div>
      </div>
    </div>
  );
});
