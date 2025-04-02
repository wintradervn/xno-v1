import React, { use, useState } from "react";
import BotModal from "./BotModal";
import NhanTinHieuButton from "./NhanTinHieuButton";
import useBotPhaiSinhListData, {
  ITradeBotInfo,
} from "@/hooks/bot-api/useBotPhaiSinhListData";
import DefaultNodata from "@/components/ui/DefaultNodata";
import DefaultLoader from "@/components/ui/DefaultLoader";
import { formatDuration, formatNumber } from "@/lib/utils";
import useSelectedBotName from "@/hooks/useSelectedBotName";
import useBotPhaiSinhFollowsList from "@/hooks/bot-api/useBotPhaiSinhFollowsList";
import { CheckRead } from "solar-icon-set";

const BotPhaiSinhMiniChart = React.lazy(
  () => import("@/components/charts/BotPhaiSinhMiniChart"),
);

export default function BotPhaiSinhSanBot() {
  const { data, isLoading } = useBotPhaiSinhListData();
  const filteredData = data?.filter((item) => item.symbol.startsWith("VN30"));
  return (
    <div className="@container">
      {isLoading ? (
        <DefaultLoader />
      ) : filteredData?.length ? (
        <div className="grid min-w-[300px] grid-cols-1 gap-2 @xl:grid-cols-2 @3xl:grid-cols-3 @3xl:gap-3 @6xl:grid-cols-4 @6xl:gap-5">
          {filteredData.map((_, i) => (
            <MemorizedBotItem key={i} item={_} />
          ))}
        </div>
      ) : (
        <DefaultNodata />
      )}
    </div>
  );
}

const MemorizedBotItem = React.memo(function BotItem({
  item,
}: {
  item: ITradeBotInfo;
}) {
  const { setBotName } = useSelectedBotName();
  const { data: followsList } = useBotPhaiSinhFollowsList();
  console.log("🚀 ~ followsList:", followsList);
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
          {followsList?.some((f) => f.name === item.name) ? (
            <div className="bg-background flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
              Đã nhận tín hiệu <CheckRead size={12} />
            </div>
          ) : (
            <NhanTinHieuButton toggleModal={() => setBotName(item.name)} />
          )}
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
