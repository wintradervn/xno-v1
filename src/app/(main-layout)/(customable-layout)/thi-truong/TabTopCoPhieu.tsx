import TopNuocNgoaiChart from "@/components/charts/TopNuocNgoaiChart";
import TopBienDongTable from "@/components/module/TopBienDongTable";
import TopCoPhieuTable from "@/components/module/TopCoPhieuTable";
import useNuocNgoaiData from "@/hooks/useNuocNgoaiData";
import DoubleArrow from "@/icons/DoubleArrow";
import { formatVeryLargeNumber } from "@/lib/utils";
import { useMemo } from "react";

export default function TabTopCoPhieu() {
  const { data } = useNuocNgoaiData();
  const sumDayBuyVal = useMemo(
    () => data?.reduce((acc, curr) => acc + curr.dayBuyVal, 0),
    [data],
  );
  const sumDaySellVal = useMemo(
    () => data?.reduce((acc, curr) => acc + curr.daySellVal, 0),
    [data],
  );
  return (
    <div className="flex h-full flex-col gap-1 sm:flex-row">
      <div className="card flex h-full flex-1 flex-col gap-3">
        <div className="flex justify-between">
          <div className="text-caption text-white">Top biến động</div>
        </div>
        <TopBienDongTable />
      </div>
      <div className="card flex h-full flex-1 flex-col gap-3">
        <div className="flex justify-between">
          <div className="text-caption text-white">Top đột biến khối lượng</div>
        </div>
        <TopCoPhieuTable />
      </div>
      <div className="card flex h-full flex-1 flex-col gap-3">
        <div className="flex justify-between">
          <div className="text-caption text-white">Top nước ngoài</div>
        </div>
        <div className="flex justify-evenly">
          <div className="flex items-center gap-1.5 text-sm">
            <div className="bg-green h-2 w-2 rounded-[2px]"></div>
            <div>Mua</div>
            <div className="text-green flex items-center font-semibold">
              <DoubleArrow /> {formatVeryLargeNumber(sumDayBuyVal, true)}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <div className="bg-red h-2 w-2 rounded-[2px]"></div>
            <div>Bán</div>
            <div className="text-red flex items-center font-semibold">
              <DoubleArrow rotate={180} />{" "}
              {formatVeryLargeNumber(sumDaySellVal, true)}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <TopNuocNgoaiChart />
        </div>
      </div>
    </div>
  );
}
