import DinhGiaLineChart from "@/components/charts/DinhGiaLineChart";
import DefaultNodata from "@/components/ui/DefaultNodata";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";
import useChiSoTaiChinhData from "@/hooks/useChiSoTaiChinhData";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import { useMemo } from "react";

export default function SubTabDinhGia() {
  const { currentSymbol } = useCurrentSymbol();
  const { data: data2 } = useChiSoTaiChinhData(currentSymbol, false);
  const { data: data3 } = useChiSoTaiChinhData(currentSymbol, true);

  const EPSTTM: number = useMemo(() => {
    if (!data2) return 1;
    return data2[0].earningPerShare;
  }, [data2]);

  const EPSAvg5years = useMemo(() => {
    if (!data3) return 0;

    return (
      data3.slice(0, 5).reduce((acc, item) => item.earningPerShare + acc, 0) / 5
    );
  }, [data3]);

  const nhanDinhText = useMemo(() => {
    if (EPSAvg5years <= EPSTTM * 0.7) {
      return "Giá cổ phiếu đang quá thấp so với giá hợp lý";
    } else if (EPSAvg5years <= EPSTTM) {
      return "Giá cổ phiếu đang thấp so với giá hợp lý";
    } else if (EPSAvg5years <= EPSTTM * 1.3) {
      return "Giá cổ phiếu đang cao hơn so với giá hợp lý";
    }
    return "Giá cổ phiếu đang quá cao so với giá hợp lý";
  }, [EPSTTM, EPSAvg5years]);

  if (EPSTTM <= 0 || EPSAvg5years <= 0) {
    return <DefaultNodata text={"Không đủ dữ liệu để phân tích"} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <UnfinishedFeature>
        <div className="flex gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-black"></div>
            Giá hợp lý (VNĐ)
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#7B61FF]"></div>
            Giá thị trường (VNĐ)
          </div>
          <div className="bg-linearpurple rounded-full px-3 py-1 text-sm font-semibold text-black">
            {nhanDinhText}
          </div>
        </div>
        <DinhGiaLineChart symbol={currentSymbol} />
      </UnfinishedFeature>
    </div>
  );
}
