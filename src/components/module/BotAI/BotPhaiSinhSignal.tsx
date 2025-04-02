import DefaultLoader from "@/components/ui/DefaultLoader";
import useBotPhaiSinhFollowsList from "@/hooks/bot-api/useBotPhaiSinhFollowsList";
import useBotPhaiSinhHistory from "@/hooks/bot-api/useBotPhaiSinhHistory";
import useBotPhaiSinhInfoData from "@/hooks/bot-api/useBotPhaiSinhInfoData";
import useBotPhaiSinhListData, {
  ITradeBotInfo,
} from "@/hooks/bot-api/useBotPhaiSinhListData";
import useBotPhaiSinhSignalData from "@/hooks/bot-api/useBotPhaiSinhSignalData";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useSelectedBotName from "@/hooks/useSelectedBotName";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatNumber } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { ShieldWarning } from "solar-icon-set";

export default function BotPhaiSinh() {
  const { data } = useBotPhaiSinhFollowsList();

  return (
    <div className="">
      <div className="flex min-w-[300px] flex-col gap-2">
        {data?.map((i: any) => (
          <MemorizedBotItem key={i.name} botName={i.name} />
        ))}
      </div>
    </div>
  );
}

const MemorizedBotItem = React.memo(function BotItem({
  botName,
}: {
  botName: string;
}) {
  const [isShowLuuY, setIsShowLuuY] = useState(false);
  const { setBotName } = useSelectedBotName();
  const { data: botInfo } = useBotPhaiSinhInfoData(botName);
  const { data, isLoading } = useBotPhaiSinhSignalData(botName);
  const { history } = useBotPhaiSinhHistory(botName);
  const { data: overview } = useMarketOverviewData();

  const vn30F1MData = useMemo(
    () => overview?.find((c) => c.code.startsWith("VN30F")),
    [overview],
  );

  const viTheHienTai = useMemo(() => {
    if (!history) return null;
    return history[history.length - 1];
  }, [history]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const openModalWithHistoryTab = () => {
    const params = new URLSearchParams(searchParams);
    params.set("botName", botName);
    params.set("defaultTab", "lenhmo-lichsu");
    router.replace(pathName + "?" + params.toString());
  };

  if (isLoading) {
    return <DefaultLoader className="!h-[178px]" />;
  }
  if (!data || botInfo?.symbol.startsWith("VN30") === false) {
    return null;
  }

  return (
    <div className="border-border flex flex-col gap-2 rounded-[8px] border p-3">
      <div
        className="flex shrink-0 cursor-pointer items-center justify-between gap-2 hover:brightness-90"
        onClick={() => setBotName(botName)}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/image/bot-image.png"
            width={24}
            height={24}
            alt="bot image"
            className="shrink-0 rounded-full"
          />
          <div className="text-md flex-1 truncate font-bold">
            {botInfo
              ? `${botInfo.symbol} ${botInfo.freq} ${botInfo.book_size / 1000000}`
              : ""}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div
            className={cn(
              "flex h-[28px] shrink-0 items-center rounded-full border p-2 text-xs font-semibold text-nowrap",
              viTheHienTai?.type === "Long"
                ? "badge-green"
                : viTheHienTai?.type === "Short"
                  ? "badge-red"
                  : "badge-yellow",
            )}
          >
            {viTheHienTai?.type}{" "}
            {botInfo?.max_position && viTheHienTai
              ? (
                  Math.abs(viTheHienTai.change / botInfo.max_position) * 100
                ).toString() + "%"
              : ""}
          </div>
          <div className="text-nowrap">
            <span className="text-muted mr-1 text-sm">Vùng giá:</span>
            <span className="text-foreground text-md">
              {formatNumber(viTheHienTai?.signal_price)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-muted text-sm">
          {viTheHienTai
            ? format(viTheHienTai?.open_time * 1000, "dd/MM/yyyy hh:mm:ss")
            : ""}
        </div>
        <div className="text-muted flex flex-wrap items-center gap-1 text-sm text-nowrap">
          Hợp đồng:
          <div className="text-md text-foreground font-semibold">
            {data.symbol} - {vn30F1MData ? vn30F1MData.price : null}
          </div>
          {vn30F1MData?.dayChange ? (
            <div className="text-green flex items-center text-sm font-semibold">
              {vn30F1MData.dayChange > 0 ? (
                <DoubleArrow size={16} />
              ) : vn30F1MData.dayChange < 0 ? (
                <DoubleArrow size={16} rotate={180} />
              ) : null}{" "}
              {vn30F1MData.dayChange} ({vn30F1MData.dayChangePercent}%)
            </div>
          ) : null}
        </div>
        <div className="text-muted text-sm">
          Vị thế đang mở:{" "}
          <span className="text-foreground text-md font-semibold">
            {viTheHienTai?.type}{" "}
            {botInfo?.max_position && viTheHienTai
              ? (
                  Math.abs(viTheHienTai.change / botInfo.max_position) * 100
                ).toString() + "%"
              : ""}
          </span>
        </div>
      </div>
      <div
        className="flex w-fit cursor-pointer items-center gap-1 border-b border-[#ff9783] text-sm text-[#ff9783] hover:brightness-75 dark:border-[#ffb5a6] dark:text-[#ffb5a6]"
        onClick={() => setIsShowLuuY((prev) => !prev)}
      >
        <ShieldWarning size={14} />
        Lưu ý
      </div>
      {isShowLuuY && (
        <div className="text-muted text-sm">
          <ul className="list-outside list-disc pl-5">
            <li>
              Bot có thể mở cả vị thế <b>long (mua)</b> và <b>short (bán)</b>{" "}
              với các mốc <b>50%</b> và
              <b>100%</b> trên số vốn giao dịch phái sinh.
            </li>
            <li>
              Mức ký quỹ theo quy định của VSDC là <b>17%</b>.
            </li>
          </ul>
          <p className="py-1">Quản trị rủi ro danh mục:</p>
          <ul className="list-outside list-disc pl-5">
            <li>
              <b>Đa dạng danh mục:</b> Không tập trung vốn vào một tài sản hoặc
              chiến lược duy nhất.
            </li>
            <li>
              <b>Áp dụng stop-loss:</b> Thiết lập mức cắt lỗ cứng cho từng giao
              dịch, dù bot có đề xuất hay không.
            </li>
            <li>
              <b>Quản lý đòn bẩy:</b> Đòn bẩy cao có thể khuếch đại lợi nhuận
              nhưng cũng đẩy rủi ro cháy tài khoản lên mức không kiểm soát.
              Tránh sử dụng đòn bẩy tối đa cao, có thể dẫn đến thua lỗ nhanh
              chóng.
            </li>
          </ul>
          <p className="py-1">
            <b>Quan trọng:</b> Bot chỉ là công cụ hỗ trợ, quyết định cuối cùng
            luôn thuộc về bạn. Hãy cân nhắc kỹ lưỡng, ưu tiên bảo toàn vốn trước
            khi tìm kiếm lợi nhuận!
          </p>
        </div>
      )}
    </div>
  );
});
