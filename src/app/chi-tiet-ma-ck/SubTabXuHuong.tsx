import TradingViewChart from "@/components/TradingViewChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useFilterProData from "@/hooks/useFilterProData";
import BulkStar from "@/icons/BulkStar";
import { useState } from "react";

const ChiBaoMABadge = ({ value }: { value?: string | number }) => {
  let title = "Giảm mạnh";
  let color = "#FF135B";
  if (!value) return null;

  const numberValue = value ? +value.toString().replaceAll("%", "") : 0;
  if (numberValue > -3) {
    title = "Giảm nhẹ";
    color = "#FF9783";
  }
  if (numberValue === 0) {
    title = "Trung lập";
    color = "#F1C617";
  }
  if (numberValue > 0) {
    title = "Tăng nhẹ";
    color = "#1FAD8E";
  }
  if (numberValue > 3) {
    title = "Tăng mạnh";
    color = "#7B61FF";
  }
  return (
    <div
      className="h-[28px] w-[80px] rounded-full border-1 p-1 text-center"
      style={{ borderColor: color, backgroundColor: color + "32" }}
    >
      {title}
    </div>
  );
};
const ChiBaoXuHuongBadge = ({ value }: { value?: string | number }) => {
  let color = "#FF135B";
  if (value === "Giảm mạnh") {
    color = "#FF135B";
  }
  if (value === "Giảm") {
    color = "#FF9783";
  }
  if (value === "Tăng") {
    color = "#1FAD8E";
  }
  if (value === "Tăng mạnh") {
    color = "#7B61FF";
  }
  return (
    <div
      className="h-[28px] w-[80px] rounded-full border-1 p-1 text-center"
      style={{ borderColor: color, backgroundColor: color + "32" }}
    >
      {value}
    </div>
  );
};

export default function SubTabXuHuong() {
  const [state, setState] = useState("1tuan");
  const { data } = useFilterProData();
  const { currentSymbol } = useCurrentSymbol();
  const symbolData = data?.find((item) => item.MA === currentSymbol);

  return (
    <div className="flex h-full w-full gap-10">
      <div className="flex flex-1 flex-col items-center gap-6">
        {/* <div className="bg-landing-rainbow rounded-full p-[1px]">
          <div className="w-fit rounded-full bg-background p-2 text-sm">
            Cổ phiếu đang trong xu hướng tăng tốt. Về thế nến, cổ phiếu xuất
            hiện Bullish Engulfing.
          </div>
        </div> */}
        <div className="flex w-full flex-1">
          <TradingViewChart />
        </div>
      </div>
      <ScrollArea>
        <div className="flex w-[340px] flex-col gap-4">
          <div className="flex min-h-[100px] flex-col items-center gap-2 rounded-[6px] border-1 border-neutral-800 p-3">
            <div className="relative mb-2 flex h-7 items-center overflow-hidden rounded-full bg-[#CFF8EB] px-2 pl-9 text-sm font-semibold text-[#16594E]">
              <div className="bg-lineargreen absolute -left-2 top-[-6px] flex h-10 w-10 items-center justify-center rounded-full text-[#1FAD8E]">
                <BulkStar />
              </div>
              AI nhận định
            </div>
            <div className="text-sm">
              {symbolData?.cmtTA || "Chưa có nhận định từ AI"}
            </div>
          </div>
          <div className="flex min-h-[200px] flex-col items-center gap-3 rounded-[6px] border-1 border-neutral-800 p-3">
            <div className="text-md font-semibold text-white">
              Giá so với Chỉ báo MA
            </div>
            <div className="grid h-[28px] w-full grid-cols-3 items-center text-sm">
              <div>MA20</div>
              <div className="text-center">{symbolData?.pMA20}</div>
              <div className="flex justify-end">
                <ChiBaoMABadge value={symbolData?.pMA20} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-3 items-center text-sm">
              <div>MA50</div>
              <div className="text-center">{symbolData?.pMA50}</div>
              <div className="flex justify-end">
                <ChiBaoMABadge value={symbolData?.pMA50} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-3 items-center text-sm">
              <div>MA100</div>
              <div className="text-center">{symbolData?.pMA100}</div>
              <div className="flex justify-end">
                <ChiBaoMABadge value={symbolData?.pMA100} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-3 items-center text-sm">
              <div>MA200</div>
              <div className="text-center">{symbolData?.pMA200}</div>
              <div className="flex justify-end">
                <ChiBaoMABadge value={symbolData?.pMA200} />
              </div>
            </div>
          </div>
          <div className="flex min-h-[200px] flex-col items-center gap-3 rounded-[6px] border-1 border-neutral-800 p-2">
            <div className="text-md font-semibold text-white">Xu hướng</div>
            <div className="grid h-[28px] w-full grid-cols-2 items-center text-sm">
              <div>Ngắn hạn</div>
              <div className="flex justify-end">
                <ChiBaoXuHuongBadge value={symbolData?.NGANHAN} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-2 items-center text-sm">
              <div>Trung hạn</div>
              <div className="flex justify-end">
                <ChiBaoXuHuongBadge value={symbolData?.TRUNGHAN} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-2 items-center text-sm">
              <div>Dài hạn</div>
              <div className="flex justify-end">
                <ChiBaoXuHuongBadge value={symbolData?.DAIHAN} />
              </div>
            </div>
            <div className="grid h-[28px] w-full grid-cols-2 items-center text-sm">
              <div>Sức mạnh giá</div>
              <div className="flex justify-end">
                <ChiBaoXuHuongBadge value={symbolData?.SUCMANH} />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
