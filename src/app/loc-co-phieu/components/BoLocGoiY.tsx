"use client";
import useLocCoPhieuState from "@/hooks/useLocCoPhieuState";
import { cn } from "@/lib/utils";
import { useState } from "react";

const defaultFilters = [
  {
    id: "1",
    name: "Bộ lọc Cổ phiếu tăng trưởng",
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
    name: "Bộ lọc Cổ phiếu giá trị",
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
    name: "Bộ lọc Cổ phiếu xu hướng mạnh",
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
    name: "Bộ lọc Cổ phiếu phục hồi",
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
    <div className="flex flex-col gap-5">
      <div className="text-lineargreen text-sm font-bold uppercase">
        Bộ lọc gợi ý
      </div>
      <div className="flex w-full flex-col items-center gap-1">
        {defaultFilters.map((filter) => (
          <div
            className={cn(
              "font-semibold= w-full cursor-pointer select-none rounded-[8px] border-l-2 p-2 text-md transition-all",
              selectedFilter === filter.id
                ? "border-[#67E1C0] bg-content1"
                : "border-transparent hover:bg-content1/40",
            )}
            onClick={() => {
              setSelectedFilter(filter.id);
              setFilter(filter.state);
            }}
            key={filter.id}
          >
            {filter.name}
          </div>
        ))}
      </div>
    </div>
  );
}
