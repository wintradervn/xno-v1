import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";
import SubTabViTheNDT from "./SubTabViTheNDT";
import { useState } from "react";
import SubTabPhaiSinh from "./SubTabPhaiSinh";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";

export default function TabPhaiSinh() {
  const [selectedTab, setSelectedTab] = useState("phaisinh");
  return (
    <div className="flex h-full flex-col gap-3 pt-1">
      <Tabs
        radius="sm"
        variant="solid"
        color="secondary"
        classNames={{
          base: "w-fit",
          tabList: "flex-1 bg-neutral-800! p-0.5 rounded-[6px]",
          tab: "text-sm py-0 h-6 font-semibold w-fit",
        }}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab key="phaisinh" title="Phái sinh"></Tab>
        <Tab key="vithendt" title="Vị thế NĐT"></Tab>
      </Tabs>
      {selectedTab === "phaisinh" && <SubTabPhaiSinh />}

      {selectedTab === "vithendt" && (
        <UnfinishedFeature>
          <SubTabViTheNDT />
        </UnfinishedFeature>
      )}
    </div>
  );
}
