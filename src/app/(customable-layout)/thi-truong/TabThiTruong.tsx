import DefaultLoader from "@/components/ui/DefaultLoader";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@nextui-org/react";
import { lazy, Suspense, useState } from "react";
import SubTabCoSo from "./SubTabCoSo";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";

const BienDong = lazy(() => import("./SubTabBienDong"));
const NuocNgoai = lazy(() => import("./SubTabNuocNgoai"));
const TuDoanh = lazy(() => import("./SubTabTuDoanh"));
const ThanhKhoan = lazy(() => import("./SubTabThanhKhoan"));
const TacDongToiIndex = lazy(() => import("./SubTabTacDongToiIndex"));

const tabs = [
  {
    id: "biendong",
    title: "Biến động",
  },
  {
    id: "nuocngoai",
    title: "Nước ngoài",
  },
  {
    id: "tudoanh",
    title: "Tự doanh",
  },
  {
    id: "thanhtoan",
    title: "Thanh khoản",
  },
  {
    id: "tacdong",
    title: "Tác động tới index",
  },
  { id: "dongtienndt", title: "Dòng tiền NĐT" },
];
export default function TabThiTruong() {
  const [selectedTab, setSelectedTab] = useState("biendong");
  const [selectedExchange, setSelectedExchange] = useState("HOSE");

  return (
    <div className="flex h-full flex-col gap-2 pt-2">
      <div className="flex justify-between">
        <Tabs
          variant="solid"
          className="w-fit"
          classNames={{
            tabList: "flex-1 !bg-neutral-800 p-1 rounded-[6px] h-[26px] ",
            cursor: "!bg-linearpurple rounded-[4px]",
            tab: "text-sm h-5 py-0 font-semibold w-fit",
            tabContent: "group-data-[selected=true]:!text-black",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} title={tab.title}></Tab>
          ))}
        </Tabs>
        {selectedTab !== "dongtienndt" && (
          <Tabs
            radius="sm"
            variant="solid"
            className="w-fit"
            classNames={{
              tabList: "flex-1 !bg-neutral-800 p-0.5 rounded-[6px] h-[30px]",
              cursor: "!bg-linearpurple rounded-[6px] h-[24px]",
              tab: "text-sm py-0 h-[24px] font-semibold w-fit",
              tabContent: "group-data-[selected=true]:!text-black",
            }}
            selectedKey={selectedExchange}
            onSelectionChange={(key) => setSelectedExchange(key as string)}
          >
            <Tab key="HOSE" title="HOSE"></Tab>
            <Tab key="HNX" title="HNX"></Tab>
            <Tab key="UPCOM" title="UPCOM"></Tab>
          </Tabs>
        )}
        {selectedTab === "dongtienndt" && (
          <Tabs
            radius="sm"
            variant="solid"
            className="w-fit"
            classNames={{
              tabList: "flex-1 !bg-neutral-800 p-0.5 rounded-[6px] h-[30px]",
              cursor: "!bg-linearpurple rounded-[6px] h-[24px]",
              tab: "text-sm py-0 h-[24px] font-semibold w-fit",
              tabContent: "group-data-[selected=true]:!text-black",
            }}
          >
            <Tab key="1D" title="1D"></Tab>
            <Tab key="10D" title="10D"></Tab>
          </Tabs>
        )}
      </div>
      <div className="min-h-0 flex-1">
        <Suspense fallback={<DefaultLoader />}>
          {selectedTab === "biendong" && (
            <BienDong exchange={selectedExchange} />
          )}
          {selectedTab === "nuocngoai" && (
            <NuocNgoai exchange={selectedExchange} />
          )}
          {selectedTab === "tudoanh" && <TuDoanh exchange={selectedExchange} />}
          {selectedTab === "thanhtoan" && <ThanhKhoan />}
          {selectedTab === "tacdong" && <TacDongToiIndex />}
          {selectedTab === "dongtienndt" && (
            <UnfinishedFeature>
              <SubTabCoSo />
            </UnfinishedFeature>
          )}
        </Suspense>
      </div>
    </div>
  );
}
