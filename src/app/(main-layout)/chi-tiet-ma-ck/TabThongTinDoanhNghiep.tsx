import { Suspense, useState } from "react";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";
import DefaultLoader from "@/components/ui/DefaultLoader";
import SubTabHoSoCongTy from "./SubTabHoSoCongTy";
import SubTabCoDongGDNoiBo from "./SubTabCoDongGDNoiBo";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";

export default function TabThongTinDoanhNghiep() {
  const [state, setState] = useState("hosocongty");
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex shrink-0 justify-between">
        <Tabs
          color="primary"
          classNames={{
            base: "w-full md:w-fit",
            tabList: "p-0.5 rounded-[6px] w-full",
            tab: "h-[26px] px-3 py-1 rounded-[4px] text-sm font-semibold flex-1 md:flex-none",
            panel: "h-full flex-1 overflow-hidden pb-0",
            cursor: "rounded-[4px]",
          }}
          selectedKey={state}
          onSelectionChange={(k) => setState(k as string)}
        >
          <Tab key="hosocongty" title="Hồ sơ công ty"></Tab>
          <Tab key="codong" title="Cổ đông & GD nội bộ"></Tab>
        </Tabs>
      </div>
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<DefaultLoader />}>
          {state === "hosocongty" && <SubTabHoSoCongTy />}
          {state === "codong" && (
            <UnfinishedFeature>
              <SubTabCoDongGDNoiBo />
            </UnfinishedFeature>
          )}
        </Suspense>
      </div>
    </div>
  );
}
