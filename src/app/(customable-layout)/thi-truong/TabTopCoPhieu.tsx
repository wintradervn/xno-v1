import TopNuocNgoaiChart from "@/components/charts/TopNuocNgoaiChart";
import TopBienDongTable from "@/components/module/TopBienDongTable";
import TopDotBienKhoiLuongTable from "@/components/module/TopDotBienKhoiLuongTable";
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
    <div className="flex h-full gap-1">
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
        <TopDotBienKhoiLuongTable />
      </div>
      <div className="card flex h-full flex-1 flex-col gap-3">
        <div className="flex justify-between">
          <div className="text-caption text-white">Top nước ngoài</div>
        </div>
        <div className="flex justify-evenly">
          <div className="flex items-center gap-1.5 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-green"></div>
            <div>Mua</div>
            <div className="flex items-center font-semibold text-green">
              <DoubleArrow /> {formatVeryLargeNumber(sumDayBuyVal, true)}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <div className="h-2 w-2 rounded-[2px] bg-red"></div>
            <div>Bán</div>
            <div className="flex items-center font-semibold text-red">
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
