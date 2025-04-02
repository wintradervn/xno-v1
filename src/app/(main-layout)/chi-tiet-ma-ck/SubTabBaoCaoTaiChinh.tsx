import BaoCaoTaiChinhSankeyChart from "@/components/charts/BaoCaoTaiChinhSankeyChart";
import Tabs from "@/components/ui/Tabs";
import useCanDoiKeToanData from "@/hooks/useCanDoiKeToanData";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useKetQuaKinhDoanhData from "@/hooks/useKetQuaKinhDoanhData";
import Documents from "@/icons/Documents";
import { Tab } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { Chart } from "solar-icon-set";
import CanDoiKeToanTable from "./CanDoiKeToanTable";
import KetQuaKinhDoanhTable from "./KetQuaKinhDoanhTable";
import LuuChuyenTienTeTable from "./LuuChuyenTienTeTable";
import useLuuChuyenTienTeData from "@/hooks/useLuuChuyenTienTeData";
import useMarketOverviewData from "@/hooks/useMarketOverview";

export default function SubTabBaoCaoTaiChinh() {
  const [selectedTab, setSelectedTab] = useState("chart");
  const [selectedData, setSelectedData] = useState("candoiketoan");
  const [yearly, setYearly] = useState(false);

  const { symbol } = useChiTietMaCK();
  const { data: overviewData } = useMarketOverviewData();

  const isBankSymbol = useMemo(() => {
    if (!overviewData) return false;
    const item = overviewData.find((item) => item.code === symbol);
    if (!item || !item.sectors) return false;
    return item.sectors.includes("bank");
  }, [overviewData, symbol]);

  const { data: candoiketoanData, isLoading: isLoadingCandoiketoan } =
    useCanDoiKeToanData(symbol, yearly);
  const { data: ketquakinhdoanhData, isLoading: isLoadingKetquakinhdoanh } =
    useKetQuaKinhDoanhData(symbol, yearly);
  const { data: luuchuyentienteData, isLoading: isLoadingluuchuyentiente } =
    useLuuChuyenTienTeData(symbol, yearly);

  return (
    <div className="relative flex h-full flex-col gap-4">
      <div className="-top-11 right-0 flex justify-end sm:absolute">
        <Tabs
          color="primary"
          classNames={{
            tabList: "p-0.5 rounded-[6px] w-full",
            tab: "h-[26px] rounded-[4px] px-1 sm:px-4 flex-1",
            cursor: "rounded-[4px]",
            base: "w-full sm:w-fit",
          }}
          selectedKey={selectedData}
          onSelectionChange={(k) => setSelectedData(k as string)}
        >
          <Tab key="candoiketoan" title="Cân đối kế toán"></Tab>
          <Tab key="ketquakinhdoanh" title="Kết quả kinh doanh"></Tab>
          <Tab key="luuchuyentiente" title="Lưu chuyển tiền tệ"></Tab>
        </Tabs>
      </div>
      <div className="flex justify-between">
        <div className="hidden items-center gap-2 sm:flex">
          <div className="text-xs font-medium text-muted">Đơn vị: </div>
          <div className="text-sm font-semibold">Tỷ VND</div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-fit sm:justify-start">
          <Tabs
            color="default"
            classNames={{
              tabList: "p-0.5 rounded-[6px]",
              tab: "h-[26px] rounded-[4px] text-sm",
              cursor: "rounded-[4px]",
            }}
            selectedKey={yearly ? "hangnam" : "hangquy"}
            onSelectionChange={(k) => setYearly(k === "hangnam")}
          >
            <Tab key="hangquy" title="Hàng quý"></Tab>
            <Tab key="hangnam" title="Hàng năm"></Tab>
          </Tabs>
          {selectedData === "candoiketoan" && !isBankSymbol && (
            <Tabs
              color="primary"
              classNames={{
                tabList: "p-0.5 rounded-[6px]",
                tab: "h-[26px] rounded-[4px] px-2",
                cursor: "rounded-[4px]",
              }}
              selectedKey={selectedTab}
              onSelectionChange={(k) => setSelectedTab(k as string)}
            >
              <Tab key="chart" title={<Chart />}></Tab>
              <Tab key="data" title={<Documents />}></Tab>
            </Tabs>
          )}
        </div>
      </div>
      <div className="flex flex-1">
        {selectedData === "candoiketoan" &&
          (selectedTab === "data" || isBankSymbol ? (
            <CanDoiKeToanTable
              data={candoiketoanData}
              isLoading={isLoadingCandoiketoan}
              yearly={yearly}
            />
          ) : (
            <div className="relative min-h-[300px] flex-1">
              <BaoCaoTaiChinhSankeyChart yearly={yearly} />
            </div>
          ))}
        {selectedData === "ketquakinhdoanh" && (
          <KetQuaKinhDoanhTable
            data={ketquakinhdoanhData}
            isLoading={isLoadingKetquakinhdoanh}
            yearly={yearly}
          />
        )}
        {selectedData === "luuchuyentiente" && (
          <LuuChuyenTienTeTable
            data={luuchuyentienteData}
            isLoading={isLoadingluuchuyentiente}
            yearly={yearly}
          />
        )}
      </div>
    </div>
  );
}
