"use client";
import Input from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn } from "@/lib/utils";
import { Tooltip } from "@nextui-org/react";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import { InfoCircle, RoundedMagnifer } from "solar-icon-set";
import MucQuanTam from "./MucQuanTam";
import BangGiaItem from "./BangGiaItem";
import useBangGiaColumnsOrder from "@/hooks/useBangGiaColumnsOrder";
import DefaultLoader from "@/components/ui/DefaultLoader";
import ChevronUpDown from "@/icons/ChevronUpDown";
import IndexLineChart from "@/components/charts/IndexLineChart";
import IndexMiniChart from "./IndexMiniChart";

const labelMap: { [key: string]: string } = {
  consumer: "Tiêu dùng",
  realEstate: "Bất động sản",
  stock: "Chứng khoán",
  bank: "Ngân hàng",
  defensive: "Phòng thủ",
  oilGas: "Dầu khí",
  logistics: "Vận chuyển",
};

const colors = [
  "#0FDEE6",
  "#98e5e7",
  "#F04438",
  "#F97066",
  "#FDA19B",
  "#FECDC9",
  "#FEE4E2",
  "#F1C617",
  "#CFF8EB",
  "#9FF0D7",
  "#67E1C1",
  "#38C9A7",
  "#1FAD8E",
  "#B7B1FF",
  "#DC6BDE",
];

const DragItem = React.memo(function DragItem({ item }: { item: any }) {
  const controls = useDragControls();
  const [sortField, setSortField] = useState("change");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "nosort">(
    "desc",
  );

  const updateSortDirection = (field: string) => {
    if (sortDirection === "desc") {
      setSortDirection("asc");
    }
    if (sortDirection === "asc") {
      setSortDirection("nosort");
    }
    if (sortDirection === "nosort") {
      setSortDirection("desc");
    }
  };
  const updateSortField = (field: string) => {
    if (sortField === field) {
      updateSortDirection(field);
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  const sortedItems = useMemo(() => {
    const items = [...item.items];
    return items.sort((a: any, b: any) => {
      if (sortDirection === "nosort") return 0;

      if (sortField === "change") {
        return sortDirection === "asc"
          ? a.dayChangePercent - b.dayChangePercent
          : b.dayChangePercent - a.dayChangePercent;
      }
      if (sortField === "volume") {
        return sortDirection === "asc"
          ? a.dayVolume - b.dayVolume
          : b.dayVolume - a.dayVolume;
      }
      return 0;
    });
  }, [item, sortField, sortDirection]);

  return (
    <Reorder.Item
      value={item.id}
      key={item.name}
      className={cn(
        "flex min-w-[200px] flex-1 flex-col rounded-[8px] bg-content1 p-2",
      )}
      dragListener={false}
      dragControls={controls}
    >
      <div
        className="text-lineargreen mb-2 cursor-move select-none text-center text-md font-bold"
        onPointerDown={(e) => {
          e.stopPropagation();
          controls.start(e);
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {item.name}
      </div>
      <div
        className={cn(
          "mb-3 flex select-none items-center justify-center text-sm font-medium",
          item.totalChange > 0 ? "text-green" : "text-red",
        )}
      >
        {item.totalChange > 0 ? (
          <DoubleArrow />
        ) : item.totalChange < 0 ? (
          <DoubleArrow rotate={180} />
        ) : null}
        {item.totalChange && item.items?.length
          ? (item.totalChange > 0 ? "+" : "") +
            (item.totalChange / item.items.length).toFixed(2) +
            "%"
          : "-"}
      </div>
      <div className="grid cursor-pointer grid-cols-4 px-2 text-sm text-muted">
        <div>Mã</div>
        <div className="text-center">Giá</div>
        <div
          className="flex items-center justify-center gap-1 hover:text-white"
          onClick={() => updateSortField("change")}
        >
          +/-{" "}
          {sortField !== "change" || sortDirection === "nosort" ? (
            <ChevronUpDown />
          ) : sortDirection === "desc" ? (
            <ChevronDown />
          ) : (
            <ChevronUp />
          )}
        </div>
        <div
          className="flex items-center justify-end gap-1 hover:text-white"
          onClick={() => updateSortField("volume")}
        >
          KL{" "}
          {sortField !== "volume" || sortDirection === "nosort" ? (
            <ChevronUpDown />
          ) : sortDirection === "desc" ? (
            <ChevronDown />
          ) : (
            <ChevronUp />
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {sortedItems.map((stock: any) => (
            <BangGiaItem key={stock.code} stock={stock} />
          ))}
        </div>
      </ScrollArea>
    </Reorder.Item>
  );
});

export default function BangGia() {
  const { data, isLoading } = useMarketOverviewData();
  const { columnsOrder, setColumnsOrder } = useBangGiaColumnsOrder();

  const groupedData = useMemo(() => {
    const grouped: any = [];
    if (!data) return [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.sectors) {
        for (let j = 0; j < item.sectors.length; j++) {
          const sector = item.sectors[j];
          const found = grouped.find((x: any) => x.name === sector);

          if (found) {
            found.items.push(item);
            found.totalChange += item.dayChangePercent;
          } else {
            grouped.push({
              name: sector,
              items: [item],
              totalChange: item.dayChangePercent,
            });
          }
        }
      }
    }
    return grouped
      .map((item: any) => {
        return {
          ...item,
          id: item.name,
          name: labelMap[item.name],
          items: item.items.sort((a: any, b: any) =>
            a.change > b.change ? -1 : 1,
          ),
        };
      })
      .sort((a: any, b: any) =>
        columnsOrder
          ? columnsOrder.indexOf(a.id) - columnsOrder.indexOf(b.id)
          : 0,
      );
  }, [data, columnsOrder]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: any) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: any) => {
    if (!scrollContainerRef.current) return;
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startX;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  if (!columnsOrder) return <DefaultLoader />;
  return (
    <>
      <div className="mb-1 flex h-[156px] w-full gap-1">
        <IndexMiniChart />
        <IndexMiniChart symbol="VN30" />
        <IndexMiniChart symbol="HNX" />
        <IndexMiniChart symbol="UPCOM" />
      </div>
      <div className="card flex h-full flex-col gap-2 p-2">
        <div className="flex flex-shrink-0 justify-end">
          <div className="flex gap-1 text-muted hover:text-white">
            <Tooltip
              content={
                <div className="flex flex-col gap-2 p-2 text-muted">
                  <div>Dãy màu cổ phiếu theo mức tăng/giảm giá</div>
                  <div className="flex overflow-hidden rounded-[4px]">
                    {colors.map((c, index) => (
                      <div
                        key={index}
                        className="h-7 w-7"
                        style={{ backgroundColor: c }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <div>&lt; -6,7%</div>
                    <div>0%</div>
                    <div>&gt; +6,7%</div>
                  </div>
                </div>
              }
              placement="bottom"
            >
              <InfoCircle size={16} iconStyle="Broken" />
            </Tooltip>
          </div>
        </div>

        <div
          className="h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex h-full flex-1 items-stretch gap-1">
            <MucQuanTam />
            {!isLoading && columnsOrder ? (
              <Reorder.Group
                as="ul"
                axis="x"
                onReorder={setColumnsOrder}
                className="flex w-full gap-1"
                values={columnsOrder}
              >
                <AnimatePresence initial={false}>
                  {groupedData.map((item: any) => (
                    <DragItem item={item} key={item.id} />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
    >
      <path
        d="M5.2503 0.750977H0.750295C0.676084 0.750918 0.603525 0.77288 0.541802 0.814081C0.480079 0.855283 0.431969 0.913872 0.403562 0.982431C0.375155 1.05099 0.367728 1.12644 0.382222 1.19922C0.396716 1.272 0.432478 1.33884 0.484983 1.39129L2.73498 3.64129C2.76981 3.67616 2.81117 3.70382 2.85669 3.72269C2.90222 3.74156 2.95101 3.75127 3.0003 3.75127C3.04958 3.75127 3.09837 3.74156 3.1439 3.72269C3.18942 3.70382 3.23078 3.67616 3.26561 3.64129L5.51561 1.39129C5.56811 1.33884 5.60387 1.272 5.61837 1.19922C5.63286 1.12644 5.62544 1.05099 5.59703 0.982431C5.56862 0.913872 5.52051 0.855283 5.45879 0.814081C5.39707 0.77288 5.32451 0.750918 5.2503 0.750977Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="3"
      viewBox="0 0 6 3"
      fill="none"
    >
      <path
        d="M0.403626 2.76873C0.375202 2.70022 0.367735 2.62481 0.382169 2.55206C0.396604 2.4793 0.432292 2.41246 0.484719 2.35998L2.73472 0.109982C2.76955 0.0751163 2.81091 0.0474566 2.85643 0.028585C2.90195 0.00971341 2.95075 0 3.00003 0C3.04931 0 3.09811 0.00971341 3.14363 0.028585C3.18916 0.0474566 3.23052 0.0751163 3.26534 0.109982L5.51534 2.35998C5.56785 2.41243 5.60361 2.47927 5.61811 2.55205C5.6326 2.62484 5.62517 2.70028 5.59677 2.76884C5.56836 2.8374 5.52025 2.89599 5.45853 2.93719C5.3968 2.97839 5.32424 3.00035 5.25003 3.0003H0.750032C0.675865 3.00028 0.603367 2.97827 0.541707 2.93705C0.480048 2.89584 0.431995 2.83726 0.403626 2.76873Z"
        fill="currentColor"
      />
    </svg>
  );
}
