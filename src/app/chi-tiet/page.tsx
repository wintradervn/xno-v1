"use client";
import DefaultLoader from "@/components/ui/DefaultLoader";
import Tabs from "@/components/ui/Tabs";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useSymbolInfo from "@/hooks/useSymbolInfo";
import { Tab } from "@nextui-org/react";
import { Suspense, useEffect, useState } from "react";
import TabTongQuan from "../chi-tiet-ma-ck/TabTongQuan";
import TabPhanTichTaiChinh from "../chi-tiet-ma-ck/TabPhanTichTaiChinh";
import TabPhanTichKyThuat from "../chi-tiet-ma-ck/TabPhanTichKyThuat";
import TabBaoCaoPhanTich from "../chi-tiet-ma-ck/TabBaoCaoPhanTich";
import TabThongTinDoanhNghiep from "../chi-tiet-ma-ck/TabThongTinDoanhNghiep";
import TabTinTucSuKien from "../chi-tiet-ma-ck/TabTinTucSuKien";

export default function ChiTiet() {
  const { symbol } = useChiTietMaCK();
  const [, setDebouncedSymbol] = useState("");
  const { setChiTietMaCK } = useChiTietMaCK();
  const { data: symbolInfo, isLoading } = useSymbolInfo(symbol || "");
  const [selectedTab, setSelectedTab] = useState("tongquan");

  useEffect(() => {
    if (symbol) {
      setDebouncedSymbol(symbol);
    } else {
      setTimeout(() => {
        setDebouncedSymbol("");
      }, 500);
    }
  }, [symbol]);

  return (
    <div className="flex h-full flex-col gap-3 bg-card">
      <div className="h-[24px] flex-shrink-0 font-semibold">
        {symbolInfo?.FullName}
      </div>
      <div className="flex-shrink-0">
        <Tabs
          variant="underlined"
          color="secondary"
          classNames={{
            tabList: "p-0",
            tab: "py-0 text-sm font-semibold",
            panel: "h-full flex-1 overflow-hidden pb-0",
            cursor: "w-full",
            tabContent: "group-data-[selected=true]:!text-lineargreen",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(k) => setSelectedTab(k as string)}
        >
          <Tab key="tongquan" title="Tổng quan"></Tab>
          <Tab key="phantichtaichinh" title="Phân tích tài chính"></Tab>
          <Tab key="phantichkythuat" title="Phân tích kỹ thuật"></Tab>
          <Tab key="baocaophantich" title="Báo cáo phân tích"></Tab>
          <Tab key="thongtindoanhnghiep" title="Thông tin doanh nghiệp"></Tab>
          <Tab key="tintucsukien" title="Tin tức & Sự kiện"></Tab>
        </Tabs>
      </div>
      <div className="flex-1">
        <Suspense fallback={<DefaultLoader />}>
          {selectedTab === "tongquan" && <TabTongQuan />}
          {selectedTab === "phantichtaichinh" && <TabPhanTichTaiChinh />}
          {selectedTab === "phantichkythuat" && <TabPhanTichKyThuat />}
          {selectedTab === "baocaophantich" && <TabBaoCaoPhanTich />}
          {selectedTab === "thongtindoanhnghiep" && <TabThongTinDoanhNghiep />}
          {selectedTab === "tintucsukien" && <TabTinTucSuKien />}
        </Suspense>
      </div>
    </div>
  );
}
