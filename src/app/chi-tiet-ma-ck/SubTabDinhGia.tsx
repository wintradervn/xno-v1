import DinhGiaLineChart from "@/components/charts/DinhGiaLineChart";

export default function SubTabDinhGia() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-black"></div>
          GF Value (VNĐ)
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#7B61FF]"></div>
          Price (VNĐ)
        </div>
        <div className="bg-linearpurple rounded-full px-3 py-1 text-sm font-semibold text-black">
          Được định giá quá cao
        </div>
      </div>
      <DinhGiaLineChart />
    </div>
  );
}
