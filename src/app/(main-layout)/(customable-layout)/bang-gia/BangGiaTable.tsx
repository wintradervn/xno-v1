import useBangGiaColumnsOrder, {
  useBangGiaColumnsOrderStore,
} from "@/hooks/useBangGiaColumnsOrder";
import useIsMobile from "@/hooks/useIsMobile";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import React, { use, useMemo, useRef, useState } from "react";
import { DANH_MUC_BANG_GIA } from "./constant";
import DefaultLoader from "@/components/ui/DefaultLoader";
import MucQuanTam from "./MucQuanTam";
import { AnimatePresence, Reorder } from "framer-motion";
import Popover from "@/components/ui/Popover";
import { PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react";
import Button from "@/components/ui/Button";
import { AltArrowDown, InfoCircle } from "solar-icon-set";
import Checkbox from "@/components/ui/Checkbox";
import { Select, SelectItem } from "@/components/ui/Select";
import DragItem from "./DragItem";
import usePersistStore from "@/hooks/usePersistStore";
import ProFeatureLocker from "@/components/ui/ProFeatureLocker";
import { useAuthStore } from "@/store/auth";

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

export default function BangGiaTable() {
  const { data } = useMarketOverviewData();

  const { columnsOrder, setColumnsOrder, removeColumn, addColumn } =
    useBangGiaColumnsOrder();

  const isMobile = useIsMobile();

  const groupedData = useMemo(() => {
    const grouped: any = {};
    if (!data) return {};
    Object.keys(DANH_MUC_BANG_GIA).forEach((key) => {
      const group = DANH_MUC_BANG_GIA[key];
      const items = data.filter((item) => group.symbols.includes(item.code));
      const totalValue = items.reduce(
        (acc, item) => acc + (item.dayValue || 0),
        0,
      );
      if (items.length) {
        grouped[key] = {
          id: key,
          name: group.name,
          items,
          totalChange: items.reduce(
            (acc, item) =>
              acc +
              ((item.dayChangePercent || 0) * (item.dayValue || 0)) /
                totalValue,
            0,
          ),
        };
      }
    });
    return grouped;
  }, [data]);

  const nganhSelectedNameStr = useMemo(() => {
    if (!columnsOrder || columnsOrder.length === 0) {
      return "Chọn ngành";
    }
    if (columnsOrder.length === Object.keys(DANH_MUC_BANG_GIA).length) {
      return "Tất cả các ngành";
    }
    return columnsOrder
      .map((key: string) => DANH_MUC_BANG_GIA[key]?.name)
      .join(", ");
  }, [columnsOrder]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const user = useAuthStore((state) => state.user);

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
  if (isMobile) return <MobileBangGiaTable data={groupedData} />;
  return (
    <>
      <div className="flex shrink-0 justify-between">
        <div className="text-muted flex items-center gap-5 text-sm">
          {/* <div className="flex items-center gap-2">
            <div>Chế độ hiển thị:</div>
            <div>
              <Select
                variant="bordered"
                classNames={{
                  base: "w-[140px]",
                  trigger: "text-foreground",
                  value: "text-sm",
                  listbox: "text-sm!",
                  popoverContent: "bg-content1 border-1 ",
                  listboxWrapper: "border-neutral-700",
                }}
                size="sm"
                defaultSelectedKeys={["thanhngang"]}
              >
                <SelectItem
                  key="thanhngang"
                  classNames={{
                    title: "text-sm",
                    base: "data-[hover=true]:bg-light-surface-main! dark:data-[hover=true]:bg-default-700!",
                  }}
                >
                  Thanh ngang
                </SelectItem>
                <SelectItem
                  key="thanhdoc"
                  classNames={{
                    title: "text-sm",
                    base: "data-[hover=true]:bg-light-surface-main! dark:data-[hover=true]:bg-default-700!",
                  }}
                >
                  Thanh dọc
                </SelectItem>
              </Select>
            </div>
          </div> */}
          <div className="flex items-center gap-2">
            <div>Ngành hiển thị:</div>
            <div>
              <Popover
                placement="bottom-start"
                classNames={{
                  content: "bg-content1 ",
                  base: "w-[200px] bg-content1 border-1  max-h-[300px] overflow-y-auto no-scrollbar rounded-[8px]",
                }}
              >
                <PopoverTrigger>
                  <Button
                    variant="bordered"
                    className="border-border text-foreground h-[32px] w-[120px] min-w-fit justify-between rounded-[6px] border-1 bg-white px-3 py-3 text-sm shadow-sm dark:bg-transparent"
                    color="default"
                  >
                    <div className="max-w-[200px] overflow-hidden text-ellipsis">
                      {nganhSelectedNameStr}
                    </div>
                    <AltArrowDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div
                    key={"tatca"}
                    className="data-[hover=true]:bg-default-600/40 flex min-h-fit w-full justify-start rounded-[4px] p-1 py-1 text-xs!"
                  >
                    <Checkbox
                      size="sm"
                      classNames={{
                        label: "text-sm pl-0 rounded-[4px] ",
                      }}
                      isSelected={
                        columnsOrder.length ===
                        Object.keys(DANH_MUC_BANG_GIA).length
                      }
                      onValueChange={() => {
                        if (
                          columnsOrder.length ===
                          Object.keys(DANH_MUC_BANG_GIA).length
                        ) {
                          setColumnsOrder([]);
                        } else {
                          setColumnsOrder([
                            ...columnsOrder,
                            ...Object.keys(DANH_MUC_BANG_GIA).filter(
                              (key) => !columnsOrder.includes(key),
                            ),
                          ]);
                        }
                      }}
                    >
                      Tất cả
                    </Checkbox>
                  </div>
                  {Object.keys(DANH_MUC_BANG_GIA).map((key) => {
                    const item = DANH_MUC_BANG_GIA[key];
                    const selected = columnsOrder.includes(key);
                    return (
                      <div
                        key={key}
                        className="data-[hover=true]:bg-default-600/40 flex min-h-fit w-full justify-start rounded-[4px] p-1 py-1 text-xs!"
                      >
                        <Checkbox
                          size="sm"
                          classNames={{
                            label: "text-sm pl-0 rounded-[4px] ",
                          }}
                          isSelected={selected}
                          onValueChange={() => {
                            if (selected) {
                              removeColumn(key);
                            } else {
                              addColumn(key);
                            }
                          }}
                        >
                          {item.name}
                        </Checkbox>
                      </div>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="text-muted hover:text-foreground flex gap-1">
          <Tooltip
            content={
              <div className="text-muted flex flex-col gap-2 p-2">
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
        className="no-scrollbar h-full w-full cursor-grab overflow-x-auto active:cursor-grabbing"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex h-full flex-1 items-stretch gap-1">
          <div className="relative shrink-0 sm:w-[240px]">
            {!user ? (
              <ProFeatureLocker
                bgUrl="/image/blur-bang-gia.png"
                mobileUrl="/image/blur-bang-gia-mobile.png"
              />
            ) : (
              <MucQuanTam />
            )}
          </div>
          <ReorderContainer groupedData={groupedData} />
        </div>
      </div>
    </>
  );
}

const ReorderContainer = React.memo(function ReorderContainer({
  groupedData,
}: {
  groupedData: any;
}) {
  const { isLoading } = useMarketOverviewData();
  const columnsOrder = usePersistStore(
    useBangGiaColumnsOrderStore,
    (state) => state.columnsOrder,
  );
  const setColumnsOrder = useBangGiaColumnsOrderStore(
    (state) => state.setColumnsOrder,
  );
  const pinnedColumns = usePersistStore(
    useBangGiaColumnsOrderStore,
    (state) => state.pinnedColumns,
  );

  return (
    <>
      {!isLoading && columnsOrder ? (
        <>
          <Reorder.Group
            as="ul"
            axis="x"
            onReorder={(order) => {
              setColumnsOrder(order);
            }}
            className="flex w-full gap-1"
            values={columnsOrder}
          >
            <AnimatePresence initial={false}>
              {columnsOrder.map((key: string) => {
                const item = groupedData[key];
                if (!item) return null;
                return (
                  <DragItem
                    item={item}
                    isPinned={pinnedColumns?.includes(item.id)}
                    key={item.id}
                  />
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        </>
      ) : null}
    </>
  );
});

function MobileBangGiaTable({ data }: { data: any }) {
  const pinnedColumns = usePersistStore(
    useBangGiaColumnsOrderStore,
    (state) => state.pinnedColumns,
  );
  return (
    <div className="pt-2">
      <div className="grid grid-cols-2 gap-1">
        <MucQuanTam />
        {Object.keys(data).map((key) => {
          const item = data[key];
          return (
            <DragItem
              item={item}
              isPinned={pinnedColumns?.includes(item.id)}
              key={item.id}
            />
          );
        })}
      </div>
    </div>
  );
}
