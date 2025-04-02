import SymbolIcon from "@/components/SymbolIcon";
import DefaultLoader from "@/components/ui/DefaultLoader";
import useBotPhaiSinhFollowsList from "@/hooks/bot-api/useBotPhaiSinhFollowsList";
import useBotPhaiSinhHistory from "@/hooks/bot-api/useBotPhaiSinhHistory";
import useBotPhaiSinhInfoData from "@/hooks/bot-api/useBotPhaiSinhInfoData";
import useBotPhaiSinhSignalData from "@/hooks/bot-api/useBotPhaiSinhSignalData";
import useDNSEStockPriceData from "@/hooks/dnse/useDNSEStockPriceData";
import useSelectedBotName from "@/hooks/useSelectedBotName";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { ShieldWarning } from "solar-icon-set";

export default function BotCoSo() {
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
  const { data: priceData } = useDNSEStockPriceData({
    symbol: data?.symbol,
    resolution: "1",
    range: 1,
  });
  const { history } = useBotPhaiSinhHistory(botName);

  const viTheHienTai = useMemo(() => {
    if (!history) return null;
    return history[history.length - 1];
  }, [history]);

  if (isLoading) {
    return <DefaultLoader className="!h-[178px]" />;
  }
  if (!data || botInfo?.symbol.startsWith("VN30") === true) {
    return null;
  }

  const lastPrice = priceData?.c[priceData.c.length - 1] || null;

  return (
    <div className="border-border flex flex-col gap-2 rounded-[8px] border p-3 text-nowrap">
      <div
        className="flex shrink-0 cursor-pointer items-center justify-between gap-2 hover:brightness-90"
        onClick={() => setBotName(botName)}
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 overflow-hidden rounded-full bg-white">
            <SymbolIcon symbol={data.symbol} className="h-6 w-6" />
          </div>
          <div className="text-md font-bold">{data.symbol}</div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-[28px] p-2 text-xs font-semibold text-nowrap",
              data.position > 0 ? "badge-green" : "badge-red",
            )}
          >
            {data.position > 0 ? "Buy" : "Sell"} {data.position * 100}%
          </div>
          <div>
            <span className="text-muted mr-1 text-sm">Vùng giá:</span>
            <span className="text-foreground text-md font-semibold">
              {formatPrice(data.signal_price * 1000)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-muted text-sm">
          {format(data.signal_time, "hh:mm:ss dd/MM/yyyy")}
        </div>
        <div className="text-muted flex flex-wrap items-center gap-1 text-sm text-nowrap">
          Mã cổ phiếu:{" "}
          <div className="text-md text-foreground font-semibold">
            {data.symbol} - {lastPrice ? formatPrice(lastPrice * 1000) : null}
          </div>
          <div className="text-green flex items-center text-sm font-semibold">
            <DoubleArrow size={16} /> +0.9 (+0.11%)
          </div>
        </div>
        <div className="text-muted text-sm">
          Vị thế đang mở:{" "}
          <span className="text-foreground text-md font-semibold">
            {data.position > 0 ? "Buy" : "Sell"}{" "}
            {(data.position * 100).toString()}%
          </span>
        </div>
        {/* <div className="flex w-fit cursor-pointer items-center gap-1 border-b-1 border-[#B7B1FF] text-sm !text-[#B7B1FF] hover:brightness-110">
          Chi tiết lịch sử vị thế và lợi nhuận{" "}
          <ArrowRight className="!text-[#B7B1FF]" size={14} />
        </div> */}
      </div>
      <div
        className="flex w-fit cursor-pointer items-center gap-1 border-b border-[#ff9783] text-sm text-[#ff9783] hover:brightness-75 dark:border-[#ffb5a6] dark:text-[#ffb5a6]"
        onClick={() => setIsShowLuuY((prev) => !prev)}
      >
        <ShieldWarning size={14} />
        Lưu ý
      </div>
      {isShowLuuY && (
        <div className="text-muted text-sm text-wrap">
          <ul className="list-outside list-disc pl-5">
            <li>
              BOT Cơ sở <b>Mua</b> và <b>Bán</b> cổ phiếu với các tỷ lệ dựa trên
              Tài sản đầu tư (NAV) ban đầu.
            </li>
            <li>BOT không sử dụng Margin trong bất kỳ trường hợp nào.</li>
          </ul>
          <p className="py-1">Quản trị rủi ro danh mục:</p>
          <ul className="list-outside list-disc pl-5">
            <li>
              <b>Đa dạng danh mục:</b> Không nên tập trung vốn vào một Mã Cổ
              phiếu hoặc chiến lược duy nhất.
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
