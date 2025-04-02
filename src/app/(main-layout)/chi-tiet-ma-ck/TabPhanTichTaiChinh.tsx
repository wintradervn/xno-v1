"use client";
import DefaultLoader from "@/components/ui/DefaultLoader";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";
import { Suspense, useState } from "react";
import SubTabDinhGia from "./SubTabDinhGia";
import SubTabChiSoTaiChinh from "./SubTabChiSoTaiChinh";
import SubTabBaoCaoTaiChinh from "./SubTabBaoCaoTaiChinh";

export default function TabPhanTichTaiChinh() {
  const [selectedTab, setSelectedTab] = useState("dinhgia");

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex justify-between">
        <Tabs
          color="primary"
          classNames={{
            tabList: "p-0.5 rounded-[6px] w-full sm:w-fit",
            tab: "h-[26px] px-3 py-1 rounded-[4px] text-sm font-semibold flex-1 sm:flex-none",
            panel: "h-full flex-1 overflow-hidden pb-0",
            cursor: "rounded-[4px]",
            base: "w-full sm:w-fit",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(k) => setSelectedTab(k as string)}
        >
          <Tab key="dinhgia" title="Định giá"></Tab>
          <Tab key="chisotaichinh" title="Chỉ số tài chính"></Tab>
          <Tab key="baocaotaichinh" title="Báo cáo tài chính"></Tab>
        </Tabs>
      </div>
      <Suspense fallback={<DefaultLoader />}>
        {selectedTab === "dinhgia" && <SubTabDinhGia />}
        {selectedTab === "chisotaichinh" && <SubTabChiSoTaiChinh />}
        {selectedTab === "baocaotaichinh" && <SubTabBaoCaoTaiChinh />}
      </Suspense>
    </div>
  );
}
