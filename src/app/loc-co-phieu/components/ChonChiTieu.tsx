"use client";
import Input from "@/components/ui/Input";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RoundedMagnifer } from "solar-icon-set";
import { NHOM_TIEU_CHI_LOC, TTieuChiLoc } from "../constant";
import { Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChonChiTieu() {
  const [selectedChiTieu, setSelectedChiTieu] = useState("1");
  const { listFilter, removeFilter, addFilter } = useLocCoPhieuState();

  return (
    <div className="flex min-h-[250px] flex-1 flex-col">
      <div className="card flex w-fit items-center gap-1 rounded-b-none px-4 text-md font-medium text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 8c0-2.828 0-4.243.879-5.121C4.757 2 6.172 2 9 2h6c2.828 0 4.243 0 5.121.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22H9c-2.828 0-4.243 0-5.121-.879C3 20.243 3 18.828 3 16z" />
            <path
              strokeLinecap="round"
              d="M8 2.5V22M2 12h2m-2 4h2M2 8h2m7.5-1.5h5m-5 3.5h5"
            />
          </g>
        </svg>
        Chọn chỉ tiêu
      </div>
      <div className="card flex flex-1 gap-5 rounded-tl-none p-3">
        <div className="flex flex-col items-center gap-1">
          {NHOM_TIEU_CHI_LOC.map((chitieu) => (
            <div
              className={cn(
                "font-semibold= w-full cursor-pointer select-none rounded-[8px] border-l-2 p-2 text-md transition-all",
                selectedChiTieu === chitieu.id
                  ? "border-[#67E1C0] bg-content1"
                  : "border-transparent hover:bg-content1/40",
              )}
              onClick={() => setSelectedChiTieu(chitieu.id)}
              key={chitieu.id}
            >
              {chitieu.name}
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Input
            placeholder="Tìm điều kiện cho bộ lọc"
            startContent={<RoundedMagnifer size={20} />}
          />
          <ScrollArea className="max-h-[260px] pr-2">
            {NHOM_TIEU_CHI_LOC.find(
              (item) => item.id === selectedChiTieu,
            )?.list?.map((filter: TTieuChiLoc) => (
              <div
                className={cn(
                  "group flex cursor-pointer items-center justify-between px-1 py-2 text-sm font-bold hover:bg-content1/60 hover:text-purple",
                  listFilter?.includes(filter.key)
                    ? "text-linearpurple"
                    : "text-muted",
                )}
                key={filter.key}
                onClick={() => addFilter(filter.key)}
              >
                <div>{filter.name}</div>
                {listFilter?.includes(filter.key) && (
                  <div
                    className="cursor-pointer text-fuchsia-200 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFilter(filter.key);
                    }}
                  >
                    <X
                      size={16}
                      className="hidden text-muted hover:text-red hover:brightness-125 group-hover:block"
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
