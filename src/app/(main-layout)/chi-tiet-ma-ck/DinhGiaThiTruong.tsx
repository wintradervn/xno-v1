import DinhGiaThiTruongLineChart from "@/components/charts/DinhGiaThiTruongLineChart";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";
import { useState } from "react";

export default function DinhGiaThiTruongScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1Y");
  return (
    <div>
      <div className="flex w-full items-center justify-between pb-3">
        <div className="text-sm">Chỉ số thị trường Việt Nam</div>
        <div>
          <Tabs
            color="primary"
            classNames={{
              tabList: "",
              base: "shrink-0 right-5",
            }}
            selectedKey={selectedTimeframe}
            onSelectionChange={(key) => setSelectedTimeframe(key as string)}
          >
            <Tab key="1Y" title="1Y"></Tab>
            <Tab key="3Y" title="3Y"></Tab>
            <Tab key="5Y" title="5Y"></Tab>
          </Tabs>
        </div>
      </div>
      <DinhGiaThiTruongLineChart symbol="VCB" timeframe={selectedTimeframe} />
      {/* <div className="rounded-[6px] border-1 p-2">
        <div>Vốn hóa, Lợi nhuận, Doanh thu</div>
        <div></div>
      </div> */}
    </div>
  );
}
