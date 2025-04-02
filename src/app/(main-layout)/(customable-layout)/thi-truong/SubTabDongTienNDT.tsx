import DefaultLoader from "@/components/ui/DefaultLoader";
import Tabs from "@/components/ui/Tabs";
import useCoSoColumnsOrder from "@/hooks/useCoSoColumnsOrder";
import useIsMobile from "@/hooks/useIsMobile";
import ChevronUpDown from "@/icons/ChevronUpDown";
import { Tab } from "@heroui/react";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import React, { useState } from "react";

const data = [
  {
    symbol: "VNM",
    price: 47.2,
    change: 6.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: 5.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: 4.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: 3.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: 2.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: 1.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: 0.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: -0.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: -1.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: -2.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: -3.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: -4.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: -5.31,
    mr: "16.4m",
  },
  {
    symbol: "VNM",
    price: 47.2,
    change: -6.31,
    mr: "16.4m",
  },
];

const labelMap: any = {
  canhan: "Cá nhân",
  tochuc: "Tổ chức",
  nuocngoai: "Nước ngoài",
  tudoanh: "Tự doanh",
};

const getColor = (change: number) => {
  if (change > 6) return "#DC6BDE";
  if (change > 5) return "#B7B1FF";
  if (change > 4) return "#166F5E";
  if (change > 3) return "#168B74";
  if (change > 2) return "#1FAD8E";
  if (change > 1) return "#38C9A7";
  if (change > 0) return "#67E1C1";
  if (+change.toFixed(2) === 0) return "#F1C617";
  if (change > -1) return "#FDA19B";
  if (change > -2) return "#F97066";
  if (change > -3) return "#F04438";
  if (change > -4) return "#D92D20";
  if (change > -5) return "#B32318";
  if (change > -6) return "#98e5e7";
  return "#0FDEE6";
};

const DragItem = React.memo(function DragItem({ id }: { id: string }) {
  const controls = useDragControls();

  return (
    <div
      key={id}
      className="border-light-surface-sub flex min-w-[220px] flex-1 flex-col gap-2 rounded-[8px] border-1 px-2 py-2 dark:border-neutral-800"
    >
      <div
        className="text-lineargreen text-caption shrink-0 cursor-move py-1 text-center select-none"
        onPointerDown={(e) => {
          e.stopPropagation();
          controls.start(e);
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {labelMap[id]}
      </div>
      <div className="text-muted grid shrink-0 grid-cols-4 px-2 text-sm">
        <div>Mã</div>
        <div className="text-center">Giá</div>
        <div className="flex items-center justify-center gap-1">
          +/- <ChevronUpDown />
        </div>
        <div className="flex items-center justify-end gap-1">
          MR <ChevronUpDown />
        </div>
      </div>
      {data.map((item, index) => (
        <div
          key={index}
          className="grid h-[40px]! shrink-0 grid-cols-4 items-center rounded-[6px] border-1 px-2 py-1.5 text-sm text-white"
          style={{ borderColor: getColor(item.change) }}
        >
          <div className="flex items-center gap-1 font-semibold">
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white">
              <img
                src={`https://finance.vietstock.vn/image/${item.symbol}`}
                className="h-full w-full object-contain"
              />
            </div>
            {item.symbol}
          </div>
          <div
            className="text-center font-semibold"
            style={{ color: getColor(item.change) }}
          >
            {item.price}
          </div>
          <div
            className={`text-center font-semibold`}
            style={{ color: getColor(item.change) }}
          >
            {item.change}%
          </div>
          <div className="text-end font-semibold">{item.mr}</div>
        </div>
      ))}
    </div>
  );
});

export default function SubTabDongTienNDT() {
  const { columnsOrder, setColumnsOrder } = useCoSoColumnsOrder();
  const [selectedTab, setSelectedTab] = useState("canhan");
  const isMobile = useIsMobile();
  if (!columnsOrder) return <DefaultLoader />;
  return (
    <div className="flex w-full gap-x-2">
      {isMobile ? (
        <div className="flex w-full flex-col gap-2">
          <Tabs
            radius="sm"
            variant="solid"
            className="w-full"
            classNames={{
              tabList:
                "flex-1 bg-background dark:bg-neutral-800! p-0.5 rounded-[6px] h-[30px]",
              cursor: "bg-linearpurple! rounded-[6px] h-[24px]",
              tab: "text-sm py-0 h-[24px] font-semibold flex-1",
              tabContent: "group-data-[selected=true]:text-black!",
              base: "self-end",
            }}
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Tab key="canhan" title="Cá nhân"></Tab>
            <Tab key="tochuc" title="Tổ chức"></Tab>
            <Tab key="nuocngoai" title="Nước ngoài"></Tab>
            <Tab key="tudoanh" title="Tự doanh"></Tab>
          </Tabs>
          <DragItem id={selectedTab} />
        </div>
      ) : (
        <>
          {columnsOrder.map((id: string) => (
            <DragItem id={id} key={id} />
          ))}
        </>
      )}
    </div>
  );
}
