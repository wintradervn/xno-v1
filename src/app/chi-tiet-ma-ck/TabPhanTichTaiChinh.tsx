import DefaultLoader from "@/components/ui/DefaultLoader";
import Tabs from "@/components/ui/Tabs";
import ChevronDown from "@/icons/ChevronDown";
import { Accordion, AccordionItem, Tab } from "@nextui-org/react";
import { lazy, Suspense, useState } from "react";
import SubTabDinhGia from "./SubTabDinhGia";
import SubTabChiSoTaiChinh from "./SubTabChiSoTaiChinh";
import SubTabBaoCaoTaiChinh from "./SubTabBaoCaoTaiChinh";

const data = [
  {
    name: "Bất động sản",
    value: 100,
    mr: 50,
    percent1Day: 10,
    percent1Week: 20,
    cashFlow: 30,
    children: [
      {
        name: "Khu công nghiệp",
        value: 100,
        mr: 50,
        percent1Day: 10,
        percent1Week: 20,
        cashFlow: 30,
      },
      {
        name: "Nhà thầu & Nguyên vật liệu",
        value: 100,
        mr: 50,
        percent1Day: 10,
        percent1Week: 20,
        cashFlow: 30,
      },
      {
        name: "Nhà ở",
        value: 100,
        mr: 50,
        percent1Day: 10,
        percent1Week: 20,
        cashFlow: 30,
      },
    ],
  },
  {
    name: "Ngân hàng",
    value: 200,
    mr: 100,
    percent1Day: 20,
    percent1Week: 30,
    cashFlow: 40,
  },
  {
    name: "Tiêu dùng",
    value: 300,
    mr: 150,
    percent1Day: 30,
    percent1Week: 40,
    cashFlow: 50,
  },
  {
    name: "Logistics",
    value: 400,
    mr: 200,
    percent1Day: 40,
    percent1Week: 50,
    cashFlow: 60,
  },
  {
    name: "Chứng khoán",
    value: 500,
    mr: 250,
    percent1Day: 50,
    percent1Week: 60,
    cashFlow: 70,
  },
  {
    name: "Dầu khí",
    value: 500,
    mr: 250,
    percent1Day: 50,
    percent1Week: 60,
    cashFlow: 70,
  },
];

export default function TabPhanTichTaiChinh() {
  const [selectedTab, setSelectedTab] = useState("dinhgia");

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <Tabs
            color="primary"
            classNames={{
              tabList: "p-0.5 rounded-[6px]",
              tab: "h-[26px] px-3 py-1 rounded-[4px] text-sm font-semibold",
              panel: "h-full flex-1 overflow-hidden pb-0",
              cursor: "rounded-[4px]",
            }}
            selectedKey={selectedTab}
            onSelectionChange={(k) => setSelectedTab(k as string)}
          >
            <Tab key="dinhgia" title="Định giá"></Tab>
            <Tab key="chisotaichinh" title="Chỉ số tài chính"></Tab>
            <Tab key="baocaotaichinh" title="Báo cáo tài chính"></Tab>
          </Tabs>
        </div>
      </div>
      <Suspense fallback={<DefaultLoader />}>
        {selectedTab === "dinhgia" && <SubTabDinhGia />}
        {selectedTab === "chisotaichinh" && <SubTabChiSoTaiChinh />}
        {selectedTab === "baocaotaichinh" && <SubTabBaoCaoTaiChinh />}
      </Suspense>
    </div>
  );
}
