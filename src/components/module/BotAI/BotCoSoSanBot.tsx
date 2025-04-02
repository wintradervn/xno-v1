import React, { useState } from "react";
import NhanTinHieuButton from "./NhanTinHieuButton";
import useBotPhaiSinhListData, {
  ITradeBotInfo,
} from "@/hooks/bot-api/useBotPhaiSinhListData";
import DefaultLoader from "@/components/ui/DefaultLoader";
import DefaultNodata from "@/components/ui/DefaultNodata";
import useSelectedBotName from "@/hooks/useSelectedBotName";
import SymbolIcon from "@/components/SymbolIcon";
import { formatDuration, formatNumber } from "@/lib/utils";
import Input from "@/components/ui/Input";
import { RoundedMagnifer } from "solar-icon-set";

const BotPhaiSinhMiniChart = React.lazy(
  () => import("@/components/charts/BotPhaiSinhMiniChart"),
);

export default function BotCoSoSanBot() {
  const { data, isLoading } = useBotPhaiSinhListData();
  const [search, setSearch] = useState("");
  const filteredData = data
    ?.filter((item) => !item.symbol.startsWith("VN30"))
    .filter((item) => {
      const searchLower = search.toLowerCase();
      return (
        item.symbol.toLowerCase().includes(searchLower) ||
        item.name.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aStartWithSearchTerm = a.symbol.startsWith(search);
      const bStartWithSearchTerm = b.symbol.startsWith(search);
      if (aStartWithSearchTerm && !bStartWithSearchTerm) return -1;
      if (!aStartWithSearchTerm && bStartWithSearchTerm) return 1;
      return 0;
    });
  return (
    <div className="@container relative flex-1">
      <Input
        variant="bordered"
        classNames={{
          base: "mb-3 @3xl:absolute @3xl:right-0 @3xl:w-[300px] @3xl:-top-[50px]",
          input: "bg-transparent @3xl:w-[300px]",
          inputWrapper: "bg-transparent @3xl:w-[300px]",
        }}
        startContent={<RoundedMagnifer size={24} />}
        placeholder="Tìm bot theo mã cổ phiếu, chiến lược hoặc tên bot..."
        value={search}
        onValueChange={setSearch}
      />
      <div className="overflow-auto">
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
    </div>
  );
}

const MemorizedBotItem = React.memo(function BotItem({
  item,
}: {
  item: ITradeBotInfo;
}) {
  const { setBotName } = useSelectedBotName();
  return (
    <div className="border-border flex flex-col gap-2 rounded-[8px] border p-3">
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex cursor-pointer items-center gap-2 hover:brightness-90"
          onClick={() => setBotName(item.name)}
        >
          <SymbolIcon symbol={item.symbol} className="h-6 w-6" />
          <div className="text-md font-bold">{item.symbol}</div>
        </div>
        <div>
          <NhanTinHieuButton toggleModal={() => setBotName(item.name)} />
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
        {/* <div className="flex flex-col items-end">
          <div className="text-muted text-xs">Tổng số người sử dụng bot</div>
          <div className="text-foreground text-sm font-semibold">16/50</div>
        </div> */}
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
