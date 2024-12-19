import ThanhKhoanLineChart from "@/components/charts/ThanhKhoanLineChart";
import Tabs from "@/components/ui/Tabs";
import useVNIndexThanhKhoanData from "@/hooks/useVNIndexThanhKhoanData";
import { Tab } from "@nextui-org/react";
import { useState } from "react";

export default function SubTabThanhKhoan() {
  const [selectedTab, setSelectedTab] = useState("5day");
  const { data } = useVNIndexThanhKhoanData(selectedTab);

  return (
    <div className="flex h-full flex-col gap-1">
      <Tabs
        className="pb-2"
        selectedKey={selectedTab}
        onSelectionChange={(k) => setSelectedTab(k as string)}
      >
        {/* <Tab key="intra" title="0D"></Tab> */}
        <Tab key="5day" title="5D"></Tab>
        {/* <Tab key="20day" title="20D"></Tab> */}
      </Tabs>
      {data && <ThanhKhoanLineChart data={data} />}
      {/* <div className="flex justify-center gap-6 pb-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-[2px] bg-green"></div>
          <div>Giao dịch hôm nay</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-[2px] bg-[#7B61FF]"></div>
          <div>Giao dịch hôm qua</div>
        </div>
      </div> */}
    </div>
  );
}
