import Popover from "@/components/ui/Popover";
import useMucQuanTam from "@/hooks/useMucQuanTam";
import { PopoverContent, PopoverTrigger, Tooltip } from "@nextui-org/react";
import { CirclePlus, Plus } from "lucide-react";
import { Pen2, TrashBinTrash } from "solar-icon-set";
import ThemDanhMucModal from "./ThemDanhMucModal";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import useFavorites from "@/hooks/useFavorites";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import BangGiaItem from "./BangGiaItem";
import Button from "@/components/ui/Button";
import ThemMaCKModal from "./ThemMaCKModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import XoaDanhMucConfirmation from "./XoaDanhMucConfirmation";
import ChevronDown from "@/icons/ChevronDown";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import FilledStar from "@/icons/FilledStar";
import { cn } from "@/lib/utils";

export default function MucQuanTam() {
  const { listQuanTam, removeList, removeMaCK, addMaCK } = useMucQuanTam();
  const [openThemDanhMuc, setOpenThemDanhMuc] = useState(false);
  const [openThemMaCK, setOpenThemMaCK] = useState(false);
  const [openListDanhMuc, setOpenListDanhMuc] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedDanhMuc, setSelectedDanhMuc] =
    useState<string>("Mục yêu thích");
  const [edittingDanhMuc, setEdittingDanhMuc] = useState("");

  const deletingRef = useRef<string>("");

  const { favorites } = useFavorites();
  const { data } = useMarketOverviewData();

  const listQuanTamData = useMemo(() => {
    if (!listQuanTam || !data) return [];
    const listSymbol: string[] = [];
    if (selectedDanhMuc === "Mục yêu thích") {
      listSymbol.push(...favorites);
    } else {
      const listQuanTamItem = listQuanTam.find(
        (item: any) => item.name === selectedDanhMuc,
      );
      listSymbol.push(...(listQuanTamItem ? listQuanTamItem.list : []));
    }
    return data
      .filter((item) => listSymbol.includes(item.code))
      .sort((a, b) => listSymbol.indexOf(a.code) - listSymbol.indexOf(b.code));
  }, [JSON.stringify(listQuanTam), favorites, data, selectedDanhMuc]);

  const onEditClick = (name: string) => {
    setEdittingDanhMuc(name);
    setOpenThemDanhMuc(true);
  };
  const onDeleteClick = (name: string) => {
    setOpenDeleteConfirmation(true);
    deletingRef.current = name;
  };
  const onDeleteConfirm = () => {
    const deletingName = deletingRef.current;
    if (!deletingName) return;
    setSelectedDanhMuc("Mục yêu thích");
    setOpenDeleteConfirmation(false);
    removeList(deletingName);
    deletingRef.current = "";
    setOpenListDanhMuc(false);
  };

  useEffect(() => {
    !openThemDanhMuc && setEdittingDanhMuc("");
  }, [openThemDanhMuc]);

  return (
    <div
      className={cn(
        "flex h-full w-[200px] flex-shrink-0 flex-col items-center gap-3 rounded-[8px] bg-content1 p-2",
      )}
    >
      <div className="text-lineargreen relative w-full flex-shrink-0 text-center text-md font-bold">
        Mục quan tâm
        <Tooltip content="Thêm danh mục" className="bg-default-800">
          <div
            className="absolute right-0 top-1 cursor-pointer text-muted hover:text-white"
            onClick={() => {
              setOpenThemDanhMuc(true);
            }}
          >
            <CirclePlus size={16} strokeWidth={1} />
          </div>
        </Tooltip>
      </div>
      <div
        className="flex h-full w-full cursor-default flex-col gap-2 text-sm"
        onMouseMove={(e) => e.stopPropagation()}
      >
        <Popover
          isOpen={openListDanhMuc}
          onClose={() => setOpenListDanhMuc(false)}
          placement="bottom"
          showArrow
        >
          <PopoverTrigger onClick={() => setOpenListDanhMuc(true)}>
            <div className="flex w-fit flex-shrink-0 cursor-pointer select-none items-center gap-1 rounded-[4px] px-1 py-1.5 hover:bg-neutral-800">
              {selectedDanhMuc || "Danh mục"} <ChevronDown />
            </div>
          </PopoverTrigger>
          <PopoverContent className="flex min-w-[160px] select-none flex-col items-stretch rounded-[8px] !p-1 text-sm">
            <div
              className="flex cursor-pointer items-center gap-1 px-1 py-2 hover:bg-card"
              onClick={() => {
                setSelectedDanhMuc("Mục yêu thích");
                setOpenListDanhMuc(false);
              }}
            >
              <FilledStar size={10} /> Mục yêu thích
            </div>
            {listQuanTam?.map((item: any) => (
              <div
                key={item.name}
                className="flex cursor-pointer justify-between px-1 py-2 hover:bg-card"
                onClick={() => {
                  setSelectedDanhMuc(item.name);
                  setOpenListDanhMuc(false);
                }}
              >
                <div>{item.name}</div>
                <div className="flex items-center gap-1">
                  <div
                    className="cursor-pointer text-muted transition-colors hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(item.name);
                    }}
                  >
                    <Pen2 size={12} />
                  </div>
                  <div
                    className="cursor-pointer text-muted transition-colors hover:text-red"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(item.name);
                    }}
                  >
                    <TrashBinTrash size={12} />
                  </div>
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1">
            {listQuanTamData?.length ? (
              listQuanTamData.map((item: any) => (
                <Fragment key={item.symbol}>
                  {selectedDanhMuc !== "Mục yêu thích" ? (
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <BangGiaItem key={item.symbol} stock={item} />
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          className="text-red"
                          onClick={() =>
                            removeMaCK(selectedDanhMuc, item.symbol)
                          }
                        >
                          <TrashBinTrash /> Xóa khỏi danh mục
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ) : (
                    <BangGiaItem key={item.symbol} stock={item} />
                  )}
                </Fragment>
              ))
            ) : (
              <div className="px-2 text-center text-muted">
                Chưa có mã nào trong danh mục
              </div>
            )}
            {selectedDanhMuc !== "Mục yêu thích" && (
              <div className="flex justify-center py-2">
                <Button
                  color="primary"
                  className="h-[24px] w-fit rounded-[4px] text-xs font-bold"
                  size="sm"
                  onClick={() => setOpenThemMaCK(true)}
                >
                  Thêm mã CK
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
        <ThemDanhMucModal
          isOpen={openThemDanhMuc}
          onClose={() => setOpenThemDanhMuc(false)}
          editting={edittingDanhMuc}
          onSuccess={setSelectedDanhMuc}
        />
        <ThemMaCKModal
          isOpen={openThemMaCK}
          onClose={() => {
            setOpenThemMaCK(false);
            deletingRef.current = "";
          }}
          onAdd={(symbol) => {
            addMaCK(selectedDanhMuc, symbol);
          }}
        />
        <XoaDanhMucConfirmation
          isOpen={openDeleteConfirmation}
          onClose={() => setOpenDeleteConfirmation(false)}
          onConfirm={onDeleteConfirm}
        />
      </div>
    </div>
  );
}
