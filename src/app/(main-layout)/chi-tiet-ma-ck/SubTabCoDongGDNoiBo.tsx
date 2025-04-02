"use client";
import GiaoDichNoiBoLineChart from "@/components/charts/GiaoDichNoiBoLineChart";
import GiaoDichNoiBoLuyKeBarChart from "@/components/charts/GiaoDichNoiBoLuyKeBarChart";
import Divider from "@/components/ui/Divider";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDNSEShareHolders from "@/hooks/dnse/useDNSEShareHolders";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import { formatNumber } from "@/lib/utils";

export default function SubTabCoDongGDNoiBo() {
  const { currentSymbol } = useCurrentSymbol();
  const { data } = useDNSEShareHolders(currentSymbol);
  return (
    <div className="flex h-full w-full flex-col gap-6 sm:flex-row md:pr-4">
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-md font-bold sm:text-lg">Giao dịch nội bộ</div>
        <div className="flex flex-1">
          <GiaoDichNoiBoLineChart />
        </div>
        <div className="text-md font-bold sm:text-lg">
          Giao dịch nội bộ lũy kế
        </div>
        <div className="flex flex-1">
          <GiaoDichNoiBoLuyKeBarChart />
        </div>
      </div>
      <Divider className="h-full w-[2px]! shrink-0" />
      <div className="flex shrink-0 flex-col sm:w-fit sm:max-w-[320px]">
        {/* <div className="text-md font-bold sm:text-lg">Cổ đông</div>
        <div className="flex h-[170px] shrink-0">
          <CoDongPieChart />
        </div> */}
        <div className="text-md font-bold sm:text-lg">
          Danh sách cổ đông lớn
        </div>
        <div className="font-muted text-muted grid grid-cols-[2fr_1fr_1fr] py-4 text-sm">
          <div>Họ tên</div>
          <div className="text-end">Số CP</div>
          <div className="text-end">Tỷ lệ(%)</div>
        </div>
        <ScrollArea className="flex-1">
          {data?.shareHolders.map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr_1fr_1fr] border-t py-3 text-sm font-bold"
            >
              <div>{_.name}</div>
              <div className="text-end">{formatNumber(_.value)}</div>
              <div className="text-green text-end">
                {formatNumber(_.ratio, 2)}%
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
