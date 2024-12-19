"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

const defaultFilters = [
  { id: "1", name: "Bộ lọc 1" },
  { id: "2", name: "Bộ lọc 2" },
  { id: "3", name: "Bộ lọc 3" },
  { id: "4", name: "Bộ lọc 4" },
];

export default function BoLocGoiY() {
  const [selectedFilter, setSelectedFilter] = useState("1");

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
            onClick={() => setSelectedFilter(filter.id)}
            key={filter.id}
          >
            {filter.name}
          </div>
        ))}
      </div>
    </div>
  );
}
