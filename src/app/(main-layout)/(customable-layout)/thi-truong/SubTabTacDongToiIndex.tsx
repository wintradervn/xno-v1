import TacDongToiIndexBarChart from "@/components/charts/TacDongToiIndexBarChart";

export default function SubTabTacDongToiIndex() {
  return (
    <div className="flex h-full flex-col pt-2">
      <div className="flex w-full justify-center gap-7 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-[2px] bg-green"></div>
          <div>Tác động tăng</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-[2px] bg-red"></div>
          <div>Tác động giảm</div>
        </div>
      </div>
      <TacDongToiIndexBarChart />
    </div>
  );
}
