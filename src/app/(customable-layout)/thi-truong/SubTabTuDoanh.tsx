import TuDoanhMuaRong10PhienBarChart from "@/components/charts/TuDoanhMuaRong10PhienBarChart";
import TuDoanhTreeChart from "@/components/charts/TuDoanhTreeChart";
import useTuDoanhData from "@/hooks/useTuDoanhData";
import { cn, formatVeryLargeNumber } from "@/lib/utils";
import { Tooltip } from "@nextui-org/react";
import { useMemo } from "react";
import { DangerCircle } from "solar-icon-set";

export default function SubTabTuDoanh({ exchange }: { exchange?: string }) {
  const { data } = useTuDoanhData();

  const filteredData = useMemo(
    () =>
      data?.filter((item) => (exchange ? item.exchange === exchange : true)),
    [data, exchange],
  );

  const tongLuongGiaoDichStats = useMemo(() => {
    const mua = filteredData?.reduce(
      (acc, curr) => acc + curr.proprietaryTotalBuyTradeVolume,
      0,
    );
    const ban = filteredData?.reduce(
      (acc, curr) => acc + curr.proprietaryTotalSellTradeVolume,
      0,
    );
    const muaVal = filteredData?.reduce(
      (acc, curr) => acc + curr.proprietaryTotalBuyTradeValue,
      0,
    );
    const banVal = filteredData?.reduce(
      (acc, curr) => acc + curr.proprietaryTotalSellTradeValue,
      0,
    );
    return {
      mua,
      ban,
      muaVal,
      banVal,
      muaBan: mua !== undefined && ban !== undefined ? mua - ban : 0,
      muaBanVal:
        muaVal !== undefined && banVal !== undefined ? muaVal - banVal : 0,
    };
  }, [filteredData]);

  return (
    <div className="flex h-full min-h-[500px] gap-8">
      <div className="z-0 flex flex-1 flex-col">
        <TuDoanhTreeChart data={filteredData} />
      </div>
      <div className="z-1 flex min-h-0 w-5/12 max-w-[500px] flex-col gap-5 bg-card text-sm">
        <div>
          <div className="mb-3 flex justify-between font-semibold">
            <div>Giao dịch tự doanh</div>
            <Tooltip content="Dữ liệu được cập nhật cuối ngày" showArrow>
              <div className="text-muted">
                <DangerCircle iconStyle="Broken" />
              </div>
            </Tooltip>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3">
              <div></div>
              <div>Khối lượng</div>
              <div>Giá trị giao dịch</div>
            </div>
            <div className="grid grid-cols-3 px-1 py-2">
              <div className="text-muted">Mua</div>
              <div className="font-bold text-green">
                {tongLuongGiaoDichStats.mua
                  ? tongLuongGiaoDichStats.mua.toLocaleString("en-US")
                  : "0"}
              </div>
              <div className="font-bold text-green">
                {tongLuongGiaoDichStats.muaVal
                  ? formatVeryLargeNumber(tongLuongGiaoDichStats.muaVal)
                  : "0"}
              </div>
            </div>
            <div className="grid grid-cols-3 px-1 py-2">
              <div className="text-muted">Bán</div>
              <div className="font-bold text-red">
                {tongLuongGiaoDichStats.ban
                  ? tongLuongGiaoDichStats.ban.toLocaleString("en-US")
                  : "0"}
              </div>
              <div className="font-bold text-red">
                {tongLuongGiaoDichStats.banVal
                  ? formatVeryLargeNumber(tongLuongGiaoDichStats.banVal)
                  : "0"}
              </div>
            </div>
            <div className="grid grid-cols-3 px-1 py-2">
              <div className="text-muted">Mua - Bán</div>
              <div
                className={cn(
                  "font-bold",
                  tongLuongGiaoDichStats.muaBan > 0
                    ? "text-green"
                    : tongLuongGiaoDichStats.muaBan < 0
                      ? "text-red"
                      : "text-white",
                )}
              >
                {tongLuongGiaoDichStats.muaBan
                  ? tongLuongGiaoDichStats.muaBan.toLocaleString("en-US")
                  : "0"}
              </div>
              <div
                className={cn(
                  "font-bold",
                  tongLuongGiaoDichStats.muaBanVal > 0
                    ? "text-green"
                    : tongLuongGiaoDichStats.muaBanVal < 0
                      ? "text-red"
                      : "text-white",
                )}
              >
                {tongLuongGiaoDichStats.muaBanVal
                  ? formatVeryLargeNumber(tongLuongGiaoDichStats.muaBanVal)
                  : "0"}
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold">
              GT tự doanh mua ròng 10 phiên
            </div>
          </div>
          <TuDoanhMuaRong10PhienBarChart exchange={exchange} />
        </div>
      </div>
    </div>
  );
}