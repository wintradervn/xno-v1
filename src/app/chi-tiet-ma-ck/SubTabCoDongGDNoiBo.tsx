import CoDongPieChart from "@/components/charts/CoDongPieChart";
import GiaoDichNoiBoLineChart from "@/components/charts/GiaoDichNoiBoLineChart";
import GiaoDichNoiBoLuyKeBarChart from "@/components/charts/GiaoDichNoiBoLuyKeBarChart";
import Divider from "@/components/ui/Divider";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SubTabCoDongGDNoiBo() {
  return (
    <div className="flex h-full w-full gap-6 pr-4">
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-lg font-bold">Giao dịch nội bộ</div>
        <div className="flex flex-1">
          <GiaoDichNoiBoLineChart />
        </div>
        <div className="text-lg font-bold">Giao dịch nội bộ lũy kế</div>
        <div className="flex flex-1">
          <GiaoDichNoiBoLuyKeBarChart />
        </div>
      </div>
      <Divider className="h-full !w-[2px] flex-shrink-0" />
      <div className="flex w-fit max-w-[360px] flex-shrink-0 flex-col">
        <div className="text-lg font-bold">Cổ đông</div>
        <div className="flex h-[170px] flex-shrink-0">
          <CoDongPieChart />
        </div>
        <div className="text-lg font-bold">Danh sách cổ đông lớn</div>
        <div className="font-muted grid grid-cols-3 py-4 text-sm text-muted">
          <div>Họ tên</div>
          <div className="text-end">Số CP</div>
          <div className="text-end">Tỷ lệ(%)</div>
        </div>
        <ScrollArea className="flex-1">
          {new Array(10).fill(0).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-3 border-t py-3 text-sm font-bold"
            >
              <div>Nguyễn Thanh Tùng</div>
              <div className="text-end">1,000,000</div>
              <div className="text-end text-green">10%</div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
