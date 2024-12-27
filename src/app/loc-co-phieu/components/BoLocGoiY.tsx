"use client";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { cn } from "@/lib/utils";
import { useState } from "react";

const defaultFilters = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
  const [selectedFilter, setSelectedFilter] = useState("1");
  const { setFilter } = useLocCoPhieuState();
  return (
    <div className="flex flex-col">
      <div className="px-3 py-4 text-md font-semibold">Bộ lọc gợi ý</div>
      <div className="flex w-full flex-col items-center gap-2 px-3">
        {defaultFilters.map((filter) => (
          <div
            className={cn(
              "relative flex h-10 w-full cursor-pointer select-none items-center rounded-[8px] border-1 p-2 px-3 text-sm font-semibold transition-all",
              selectedFilter === filter.id
                ? "bg-neutral-800"
                : "border-neutral-800",
            )}
            onClick={() => {
              setSelectedFilter(filter.id);
              setFilter(filter.state);
            }}
            key={filter.id}
          >
            <div
              className={cn(
                "absolute left-0 top-0 h-full w-[15px] rounded-[8px] border-l-2 bg-transparent transition-all",
                selectedFilter === filter.id
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
