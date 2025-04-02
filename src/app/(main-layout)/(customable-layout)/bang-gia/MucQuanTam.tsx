import Popover from "@/components/ui/Popover";
import useMucQuanTam from "@/hooks/useMucQuanTam";
import { PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react";
import { CirclePlus, Plus } from "lucide-react";
import { Pen2, TrashBinTrash } from "solar-icon-set";
import ThemDanhMucModal from "./ThemDanhMucModal";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import useFavorites from "@/hooks/useFavorites";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import BangGiaItem from "./BangGiaItem";
import Button from "@/components/ui/Button";
import ThemMaCKModal from "./ThemMaCKModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import XoaDanhMucConfirmation from "./XoaDanhMucConfirmation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import FilledStar from "@/icons/FilledStar";
import { cn } from "@/lib/utils";
import ChevronUpDown from "@/icons/ChevronUpDown";

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

export default function MucQuanTam() {
  const { listQuanTam, removeList, removeMaCK, addMaCK } = useMucQuanTam();
  const { addFavorite, removeFavorite } = useFavorites();
  const [openThemDanhMuc, setOpenThemDanhMuc] = useState(false);
  const [openThemMaCK, setOpenThemMaCK] = useState(false);
  const [openListDanhMuc, setOpenListDanhMuc] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedDanhMuc, setSelectedDanhMuc] =
    useState<string>("Mục yêu thích");
  const [edittingDanhMuc, setEdittingDanhMuc] = useState("");
  const [sortField, setSortField] = useState("change");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "nosort">(
    "desc",
  );

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
      .sort((a: any, b: any) => {
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
  }, [
    JSON.stringify(listQuanTam),
    favorites,
    data,
    selectedDanhMuc,
    sortField,
    sortDirection,
  ]);

  const symbolsInSelectedDanhMuc = useMemo(() => {
    if (selectedDanhMuc === "Mục yêu thích") return favorites;
    const danhMuc = listQuanTam.find(
      (item: any) => item.name === selectedDanhMuc,
    );
    return danhMuc ? danhMuc.list : [];
  }, [listQuanTam, selectedDanhMuc]);

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
        "bg-content1 flex h-full shrink-0 flex-col items-center gap-1 rounded-[8px] p-1 sm:w-[240px] sm:p-2",
      )}
    >
      <div className="text-lineargreen text-md relative w-full shrink-0 text-center font-bold">
        Mục quan tâm
        <Tooltip
          content="Thêm danh mục"
          className="bg-background rounded-[8px] text-sm"
        >
          <div
            className="text-muted hover:text-foreground absolute top-1 right-0 cursor-pointer"
            onClick={() => {
              setOpenThemDanhMuc(true);
            }}
          >
            <CirclePlus size={16} strokeWidth={1} />
          </div>
        </Tooltip>
      </div>
      <div
        className="flex h-full w-full cursor-default flex-col gap-1 text-sm"
        onMouseMove={(e) => e.stopPropagation()}
      >
        <Popover
          isOpen={openListDanhMuc}
          onClose={() => setOpenListDanhMuc(false)}
          placement="bottom"
          showArrow
        >
          <PopoverTrigger onClick={() => setOpenListDanhMuc(true)}>
            <div className="hover:bg-card/90 flex w-fit shrink-0 cursor-pointer items-center gap-1 rounded-[4px] px-1 py-1.5 select-none">
              {selectedDanhMuc || "Danh mục"} <ChevronDown />
            </div>
          </PopoverTrigger>
          <PopoverContent className="flex min-w-[160px] flex-col items-stretch rounded-[8px] p-1! text-sm select-none">
            <div
              className="hover:bg-card flex cursor-pointer items-center gap-1 px-1 py-2"
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
                className="hover:bg-card flex cursor-pointer justify-between px-1 py-2"
                onClick={() => {
                  setSelectedDanhMuc(item.name);
                  setOpenListDanhMuc(false);
                }}
              >
                <div>{item.name}</div>
                <div className="flex items-center gap-1">
                  <div
                    className="text-muted hover:text-foreground cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(item.name);
                    }}
                  >
                    <Pen2 size={12} />
                  </div>
                  <div
                    className="text-muted hover:text-red cursor-pointer transition-colors"
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
        <ScrollArea className="max-h-[258px] flex-1 sm:max-h-full">
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
          <div className="flex flex-col gap-1">
            {listQuanTamData?.length ? (
              listQuanTamData.map((item: TSymbolOverviewData) => (
                <Fragment key={item.code}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <BangGiaItem key={item.code} stock={item} />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="text-red"
                        onClick={() => {
                          if (selectedDanhMuc === "Mục yêu thích") {
                            removeFavorite(item.code);
                          } else {
                            removeMaCK(selectedDanhMuc, item.code);
                          }
                        }}
                      >
                        <TrashBinTrash /> Xóa khỏi danh mục
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </Fragment>
              ))
            ) : (
              <div className="text-muted px-2 text-center">
                Chưa có mã nào trong danh mục
              </div>
            )}
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
          onAdd={(symbols) => {
            if (selectedDanhMuc === "Mục yêu thích") {
              symbols.forEach((s) => addFavorite(s));
            } else {
              symbols.forEach((s) => addMaCK(selectedDanhMuc, s));
            }
          }}
          ignoreSymbols={symbolsInSelectedDanhMuc}
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
