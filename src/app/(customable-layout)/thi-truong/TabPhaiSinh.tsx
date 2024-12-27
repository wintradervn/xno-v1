import FavoriteStarButton from "@/components/FavoriteStarButton";
import Table from "@/components/ui/Table";
import Tabs from "@/components/ui/Tabs";
import { cn, formatPrice } from "@/lib/utils";
import { Tab } from "@nextui-org/react";
import SubTabViTheNDT from "./SubTabViTheNDT";
import { useState } from "react";
import SubTabPhaiSinh from "./SubTabPhaiSinh";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";

const data = {
  symbol: "VCB",
  price: "140,415",
  changeDay: 2.9412,
  tongKL: "140,415",
  tongGD: "140,415",
  KLOL: "140,415",
};

export default function TabPhaiSinh() {
  const [selectedTab, setSelectedTab] = useState("phaisinh");
  return (
    <div className="flex h-full flex-col gap-3 pt-1">
      <Tabs
        radius="sm"
        variant="solid"
        classNames={{
          base: "w-fit",
          tabList: "flex-1 !bg-neutral-800 p-0.5 rounded-[6px]",
          cursor: "!bg-linearpurple rounded-[4px]",
          tab: "text-sm py-0 h-6 font-semibold w-fit",
          tabContent: "group-data-[selected=true]:!text-black",
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
