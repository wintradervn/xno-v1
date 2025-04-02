import { ScrollArea } from "@/components/ui/scroll-area";
import useBangGiaColumnsOrder, {
  useBangGiaColumnsOrderStore,
} from "@/hooks/useBangGiaColumnsOrder";
import useIsMobile from "@/hooks/useIsMobile";
import ChevronUpDown from "@/icons/ChevronUpDown";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn } from "@/lib/utils";
import { Reorder, useDragControls } from "framer-motion";
import React, { useMemo, useState } from "react";
import { Pin } from "solar-icon-set";
import BangGiaItem from "./BangGiaItem";
import usePersistStore from "@/hooks/usePersistStore";

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

const Wrapper = ({
  item,
  controls,
  children,
}: {
  item: any;
  controls: any;
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <div className="bg-content1 rounded-[8px] p-1">{children}</div>
  ) : (
    <Reorder.Item
      value={item.id}
      key={item.name}
      className={cn(
        "bg-content1 relative flex min-w-[200px] flex-1 flex-col rounded-[8px] p-2",
      )}
      dragListener={false}
      dragControls={controls}
      layoutId={item.id}
    >
      {children}
    </Reorder.Item>
  );
};

function DragItem({ item, isPinned }: { item: any; isPinned?: boolean }) {
  const togglePinColumn = useBangGiaColumnsOrderStore(
    (state) => state.togglePinColumn,
  );
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
    <Wrapper item={item} controls={controls}>
      <div
        className="text-lineargreen text-md mb-2 cursor-move text-center font-bold select-none"
        onPointerDown={(e) => {
          e.stopPropagation();
          !isPinned && controls.start(e);
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {item.name}
        <div
          className="text-muted hover:text-foreground absolute top-2 right-2 cursor-pointer"
          onPointerDown={(e) => {
            e.stopPropagation();
            togglePinColumn(item.id);
          }}
        >
          <Pin size={16} iconStyle={isPinned ? "Bold" : "Linear"} />
        </div>
      </div>
      <div
        className={cn(
          "mb-3 flex items-center justify-center text-sm font-medium select-none",
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
            item.totalChange.toFixed(2) +
            "%"
          : "-"}
      </div>
      <div className="text-muted grid cursor-pointer grid-cols-4 px-2 pb-1 text-xs">
        <div>Mã</div>
        <div className="text-center">Giá</div>
        <div
          className="hover:text-foreground flex items-center justify-center gap-1"
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
          className="hover:text-foreground flex items-center justify-end gap-1"
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
      <ScrollArea className="max-h-[240px] flex-1 sm:max-h-full">
        <div className="flex flex-col gap-1">
          {sortedItems.map((stock: any) => (
            <BangGiaItem key={stock.code} stock={stock} />
          ))}
        </div>
      </ScrollArea>
    </Wrapper>
  );
}

export default React.memo(
  DragItem,
  (prev, next) =>
    prev.item.id === next.item.id && prev.isPinned === next.isPinned,
);
