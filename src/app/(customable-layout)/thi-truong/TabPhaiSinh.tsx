import FavoriteStarButton from "@/components/FavoriteStarButton";
import Table from "@/components/ui/Table";
import Tabs from "@/components/ui/Tabs";
import { cn, formatPrice } from "@/lib/utils";
import { Tab } from "@nextui-org/react";
import SubTabViTheNDT from "./SubTabViTheNDT";
import { useState } from "react";

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
      {selectedTab === "phaisinh" && (
        <Table
          className="flex-1"
          columns={[
            {
              title: "Mã CK",
              key: "mack",
              render: (item: any) => (
                <div className="flex w-fit items-center gap-1">
                  <div className="h-4 w-4 flex-shrink-0 overflow-hidden rounded-full bg-white">
                    <img
                      src={`https://finance.vietstock.vn/image/${item.symbol}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="font-semibold">{item.symbol}</div>
                  <div className="flex-shrink-0">
                    <FavoriteStarButton symbol={item.symbol} size={14} />
                  </div>
                </div>
              ),
            },
            {
              title: "Giá",
              key: "gia",
              className: "text-end",
              render: (item: any) => <>{formatPrice(item.price)}</>,
              sortFn: (a: any, b: any) => a.price - b.price,
            },
            {
              title: "% 1D",
              key: "homnay",
              className: "text-end",
              render: (item: any) => (
                <div
                  className={cn(
                    "flex items-center justify-end font-semibold text-green",
                    item.changeDay > 0
                      ? "text-green"
                      : item.changeDay
                        ? "text-red"
                        : "text-yellow-400",
                  )}
                >
                  {item.changeDay > 0 && "+"}
                  {item.changeDay.toFixed(2)}%
                </div>
              ),
              sortFn: (a: any, b: any) => a.changeDay - b.changeDay,
            },
            {
              title: "Tổng KL",
              key: "tongkl",
              className: "text-end",
              render: (item: any) => (
                <div
                  className={cn("flex items-center justify-end font-semibold")}
                >
                  {item.tongKL}
                </div>
              ),
              sortFn: (a: any, b: any) => a.tongKL - b.tongKL,
            },
            {
              title: "Tổng GD",
              key: "tonggd",
              className: "text-end",
              render: (item: any) => (
                <div
                  className={cn("flex items-center justify-end font-semibold")}
                >
                  {item.tongGD}
                </div>
              ),
              sortFn: (a: any, b: any) => a.tongGD - b.tongGD,
            },
            {
              title: "KL OL",
              key: "klol",
              className: "text-end",
              render: (item: any) => (
                <div
                  className={cn("flex items-center justify-end font-semibold")}
                >
                  {item.KLOL}
                </div>
              ),
              sortFn: (a: any, b: any) => a.KLOL - b.KLOL,
            },
          ]}
          data={new Array(20).fill(data)}
        ></Table>
      )}

      {selectedTab === "vithendt" && <SubTabViTheNDT />}
    </div>
  );
}
