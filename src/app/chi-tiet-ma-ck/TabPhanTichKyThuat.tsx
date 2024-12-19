import DongTienThongMinhLineChart from "@/components/charts/DongTienThongMinhLineChart";
import RRGChart from "@/components/charts/RRGChart";
import DefaultLoader from "@/components/ui/DefaultLoader";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@nextui-org/react";
import { Suspense, useState } from "react";
import SubTabTongQuanPTKT from "./SubTabTongQuanPTKT";

export default function TabPhanTichKyThuat() {
  const [state, setState] = useState("tongquan");
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-shrink-0 justify-between">
        <div>
          <Tabs
            color="primary"
            classNames={{
              tabList: "p-0.5 rounded-[6px]",
              tab: "h-[26px] px-3 py-1 rounded-[4px] text-sm font-semibold",
              panel: "h-full flex-1 overflow-hidden pb-0",
              cursor: "rounded-[4px]",
            }}
            selectedKey={state}
            onSelectionChange={(k) => setState(k as string)}
          >
            <Tab key="tongquan" title="Tổng quan"></Tab>
            <Tab key="bieudorrg" title="Biểu đồ RRG"></Tab>
            <Tab key="dongtienthongminh" title="Dòng tiền thông minh"></Tab>
          </Tabs>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<DefaultLoader />}>
          {state === "tongquan" && <SubTabTongQuanPTKT />}
          {state === "bieudorrg" && <RRGChart />}
          {state === "dongtienthongminh" && <DongTienThongMinhLineChart />}
        </Suspense>
      </div>
    </div>
  );
}
