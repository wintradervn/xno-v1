"use client";
import useBoLocCaNhan from "@/hooks/useBoLocCanhan";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { cn } from "@/lib/utils";
import { useState } from "react";

const defaultFilters = [
  {
    id: "bolocgoiy1",
    name: "Cổ phiếu tăng trưởng",
    state: {
      PE: {
        max: 15,
      },
      TTDT: {
        min: 20,
      },
      TTLN: {
        min: 15,
      },
      pMA20: {
        min: 0,
      },
      pMA50: {
        min: 0,
      },
      // PB: {
      //   max: 2,
      // },
    },
  },
  {
    id: "bolocgoiy2",
    name: "Cổ phiếu giá trị",
    state: {
      PE: {
        max: 10,
      },
      // PB: {
      //   max: 1,
      // },
      ROE: {
        min: 15,
      },
      BLNR: {
        min: 15,
      },
      skTaichinh: {
        min: 65,
      },
    },
  },
  {
    id: "bolocgoiy3",
    name: "Cổ phiếu xu hướng mạnh",
    state: {
      RS: {
        min: 80,
      },
      pMA20: {
        min: 0,
      },
      pMA50: {
        min: 0,
      },
      pMA100: {
        min: 0,
      },
      pMA200: {
        min: 0,
      },
      AiTrend: ["Uptrend"],
      NGANHAN: ["Tăng"],
      TRUNGHAN: ["Tăng"],
    },
  },
  {
    id: "bolocgoiy4",
    name: "Cổ phiếu phục hồi",
    state: {
      pattern: ["Tăng giá"],
      NGANHAN: ["Tăng"],
      PE: {
        max: 20,
      },
      pMA20: {
        min: 0,
      },
      plow52W: {
        max: 30,
      },
      ThanhKhoanTB50: {
        min: 2,
      },
      KL1KLTB: {
        min: 20,
      },
    },
  },
];

export default function BoLocGoiY() {
  const { setFilter } = useLocCoPhieuState();
  const { selectedBoLocId, setSelectedBoLocId } = useBoLocCaNhan();

  return (
    <div className="flex flex-col">
      <div className="text-md px-3 py-4 font-semibold">Bộ lọc gợi ý</div>
      <div className="flex w-full flex-col items-center gap-2 px-3">
        {defaultFilters.map((filter) => (
          <div
            className={cn(
              "relative flex h-10 w-full cursor-pointer items-center rounded-[8px] border-1 p-2 px-3 text-sm font-semibold transition-all select-none",
              selectedBoLocId === filter.id
                ? "bg-white dark:bg-neutral-800"
                : "hover:bg-white/70 hover:dark:bg-neutral-800/70",
            )}
            onClick={() => {
              setSelectedBoLocId(filter.id);
              setFilter(filter.state);
            }}
            key={filter.id}
          >
            <div
              className={cn(
                "absolute top-0 left-0 h-full w-[15px] rounded-[8px] border-l-2 bg-transparent transition-all",
                selectedBoLocId === filter.id
                  ? "border-[#67E1C0]"
                  : "border-transparent",
              )}
            ></div>
            {filter.name}
          </div>
        ))}
      </div>
    </div>
  );
}
