"use client";
import Input from "@/components/ui/Input";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { cn, localSearch } from "@/lib/utils";
import { useState } from "react";
import { RoundedMagnifer } from "solar-icon-set";
import { NHOM_TIEU_CHI_LOC, TIEU_CHI_LOC_LIST, TTieuChiLoc } from "../constant";
import { Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChonChiTieuIcon from "@/icons/ChonChiTieuIcon";
import useTheme from "@/hooks/useTheme";

export default function ChonChiTieu({ noTitle }: { noTitle?: boolean }) {
  const [selectedChiTieu, setSelectedChiTieu] = useState("1");
  const [search, setSearch] = useState("");
  const { listFilter, removeFilter, addFilter } = useLocCoPhieuState();
  const { isLightMode } = useTheme();

  return (
    <div className="card flex h-full flex-1 flex-col rounded-[8px] p-0">
      {!noTitle && (
        <div className="text-md flex shrink-0 items-center gap-1 border-b-1 p-3 font-medium text-white">
          <ChonChiTieuIcon fillColor={isLightMode ? "#7B61FF" : ""} />
          Chọn chỉ tiêu
        </div>
      )}
      <div className="flex h-full flex-col gap-2 p-2 sm:flex-row sm:gap-4 sm:p-3">
        <div className="no-scrollbar flex flex-col gap-1 overflow-auto rounded-[8px] sm:w-2/5 sm:border-1">
          <div className="text-md hidden border-b-1 px-3 py-2 font-bold sm:block">
            Nhóm
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:p-2">
            {NHOM_TIEU_CHI_LOC.map((chitieu) => (
              <div
                className={cn(
                  "relative flex h-8 w-full cursor-pointer items-center rounded-[8px] border-1 p-2 text-[11px] font-semibold transition-all select-none hover:bg-white/70 sm:h-10 sm:px-3 sm:text-sm hover:dark:bg-neutral-800/50",
                  selectedChiTieu === chitieu.id
                    ? "bg-white dark:bg-neutral-800"
                    : "",
                )}
                onClick={() => setSelectedChiTieu(chitieu.id)}
                key={chitieu.id}
              >
                <div
                  className={cn(
                    "absolute top-0 left-0 h-full w-[15px] rounded-[8px] border-l-2 bg-transparent transition-all",
                    selectedChiTieu === chitieu.id
                      ? "border-[#67E1C0]"
                      : "border-transparent",
                  )}
                ></div>
                {chitieu.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-[8px] border-1 p-3">
          <Input
            className="shrink-0"
            variant="bordered"
            size="sm"
            placeholder="Tìm điều kiện cho bộ lọc"
            startContent={<RoundedMagnifer size={20} />}
            value={search}
            onValueChange={setSearch}
            endContent={
              search !== "" && (
                <div
                  className="hover:text-foreground cursor-pointer"
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </div>
              )
            }
          />
          <ScrollArea className="pr-2">
            {(search !== ""
              ? TIEU_CHI_LOC_LIST.filter((item: TTieuChiLoc) =>
                  localSearch(item.name, search),
                )
              : NHOM_TIEU_CHI_LOC.find((item) => item.id === selectedChiTieu)
                  ?.list
            )?.map((filter: TTieuChiLoc) => (
              <div
                className={cn(
                  "group hover:text-purple flex cursor-pointer items-center justify-between px-1 py-2 text-sm font-bold hover:bg-white/70 hover:dark:bg-neutral-700/50",
                  listFilter?.includes(filter.key)
                    ? "text-linearpurple"
                    : "text-neutral-500",
                )}
                key={filter.key}
                onClick={() => addFilter(filter.key)}
              >
                <div>{filter.name}</div>
                {listFilter?.includes(filter.key) && (
                  <div
                    className="text-purple hover:text-foreground cursor-pointer dark:text-fuchsia-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFilter(filter.key);
                    }}
                  >
                    <X
                      size={16}
                      className="text-red/50 hover:text-red hidden group-hover:block hover:brightness-125"
                    />
                    <Check size={16} className="group-hover:hidden" />
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
