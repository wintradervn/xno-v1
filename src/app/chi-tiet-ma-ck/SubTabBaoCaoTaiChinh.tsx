import BaoCaoTaiChinhSankeyChart from "@/components/charts/BaoCaoTaiChinhSankeyChart";
import Tabs from "@/components/ui/Tabs";
import useCanDoiKeToanData from "@/hooks/useCanDoiKeToanData";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useKetQuaKinhDoanhData from "@/hooks/useKetQuaKinhDoanhData";
import Documents from "@/icons/Documents";
import { Tab } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { Chart } from "solar-icon-set";
import CanDoiKeToanTable from "./CanDoiKeToanTable";
import KetQuaKinhDoanhTable from "./KetQuaKinhDoanhTable";
import LuuChuyenTienTeTable from "./LuuChuyenTienTeTable";
import useLuuChuyenTienTeData from "@/hooks/useLuuChuyenTienTeData";

export default function SubTabBaoCaoTaiChinh() {
  const [selectedTab, setSelectedTab] = useState("chart");
  const [selectedData, setSelectedData] = useState("candoiketoan");
  const [yearly, setYearly] = useState(false);

  const { symbol } = useChiTietMaCK();
  const { data: candoiketoanData, isLoading: isLoadingCandoiketoan } =
    useCanDoiKeToanData(symbol, yearly);
  const { data: ketquakinhdoanhData, isLoading: isLoadingKetquakinhdoanh } =
    useKetQuaKinhDoanhData(symbol, yearly);
  const { data: luuchuyentienteData, isLoading: isLoadingluuchuyentiente } =
    useLuuChuyenTienTeData(symbol, yearly);

  return (
    <div className="relative flex h-full flex-col gap-4">
      <div className="absolute -top-11 right-0 flex justify-end">
        <Tabs
          color="primary"
          classNames={{
            tabList: "p-0.5 rounded-[6px]",
            tab: "h-[26px] rounded-[4px] px-4",
            cursor: "rounded-[4px]",
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
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-muted">Đơn vị: </div>
          <div className="text-sm font-semibold">Tỷ VND</div>
        </div>
        <div className="flex items-center gap-3">
          {/* <div className="flex items-center gap-3 text-sm text-muted">
            Từ{" "}
            <Select
              variant="bordered"
              placeholder="--"
              size="sm"
              className="w-[92px]"
              selectedKeys={range[0] && [range[0]]}
              onChange={(e: any) =>
                setRange((prev) => [e.target.value, prev[1]])
              }
              aria-label="from-date"
            >
              {fromDateOptions?.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
            đến
            <Select
              variant="bordered"
              placeholder="--"
              size="sm"
              className="w-[92px]"
              selectedKeys={range[1] && [range[1]]}
              aria-label="to-date"
              onChange={(e: any) =>
                setRange((prev) => [prev[0], e.target.value])
              }
            >
              {toDateOptions?.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
          </div> */}
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
        </div>
      </div>
      <div className="flex flex-1">
        {selectedTab === "data" ? (
          <>
            {selectedData === "candoiketoan" && (
              <CanDoiKeToanTable
                data={candoiketoanData}
                isLoading={isLoadingCandoiketoan}
                yearly={yearly}
              />
            )}
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
          </>
        ) : (
          <BaoCaoTaiChinhSankeyChart />
        )}
      </div>
    </div>
  );
}
