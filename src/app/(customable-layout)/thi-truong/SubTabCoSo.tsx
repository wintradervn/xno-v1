import DefaultLoader from "@/components/ui/DefaultLoader";
import useCoSoColumnsOrder from "@/hooks/useCoSoColumnsOrder";
import ChevronUpDown from "@/icons/ChevronUpDown";
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
  if (change > 6.7) return "#DC6BDE";
  if (change > 6) return "#B7B1FF";
  if (change > 5) return "#38C9A7";
  if (change > 4) return "#67E1C1";
  if (change > 3) return "#9FF0D7";
  if (change > 2) return "#9FF0D7";
  if (change > 1) return "#CFF8EB";
  if (change > 0) return "#F1FCF9";
  if (+change.toFixed(2) === 0) return "#F1C617";
  if (change > -1) return "#FEF3F2";
  if (change > -2) return "#FEE4E2";
  if (change > -3) return "#FECDC9";
  if (change > -4) return "#FDA19B";
  if (change > -5) return "#F97066";
  if (change > -6) return "#98e5e7";
  if (change > -6.7) return "#0FDEE6";
};

const DragItem = React.memo(function DragItem({ id }: { id: string }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={id}
      key={id}
      className="flex min-w-[220px] flex-1 flex-col gap-2 rounded-[8px] bg-content1 px-3 py-2"
      dragListener={false}
      dragControls={controls}
    >
      <div
        className="text-lineargreen text-caption flex-shrink-0 cursor-move select-none py-1 text-center"
        onPointerDown={(e) => {
          e.stopPropagation();
          controls.start(e);
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {labelMap[id]}
      </div>
      <div className="grid flex-shrink-0 grid-cols-4 px-2 text-sm text-muted">
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
          className="grid !h-[26px] flex-shrink-0 grid-cols-4 items-center rounded-[6px] px-2 py-1.5 text-xs text-black"
          style={{ backgroundColor: getColor(item.change) }}
        >
          <div className="font-semibold">{item.symbol}</div>
          <div className="text-center font-semibold">{item.price}</div>
          <div className={`text-center font-semibold`}>{item.change}%</div>
          <div className="text-end font-semibold">{item.mr}</div>
        </div>
      ))}
    </Reorder.Item>
  );
});

export default function SubTabCoSo() {
  const { columnsOrder, setColumnsOrder } = useCoSoColumnsOrder();
  if (!columnsOrder) return <DefaultLoader />;
  return (
    <div className="flex w-full gap-x-3">
      {columnsOrder && (
        <Reorder.Group
          as="ul"
          axis="x"
          onReorder={setColumnsOrder}
          className="flex w-full gap-3"
          values={columnsOrder}
        >
          <AnimatePresence initial={false}>
            {columnsOrder.map((id: string) => (
              <DragItem id={id} key={id} />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </div>
  );
}
