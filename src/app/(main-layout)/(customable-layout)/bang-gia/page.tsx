"use client";
import { cn } from "@/lib/utils";
import { Reorder, useDragControls } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import { DoubleAltArrowUp, Pin } from "solar-icon-set";

import IndexMiniChart from "./IndexMiniChart";

import { motion } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";
import BangGiaTable from "./BangGiaTable";
import ProFeatureLocker from "@/components/ui/ProFeatureLocker";
import { useAuthStore } from "@/store/auth";

export default function BangGia() {
  const [expanded, setExpanded] = useState(true);
  const isMobile = useIsMobile();
  return (
    <div className="relative flex h-full flex-col">
      <div className="relative">
        <div className="no-scrollbar overflow-x-auto">
          <motion.div
            animate={
              expanded
                ? {
                    height: isMobile ? 130 : 176,
                  }
                : { height: 60 }
            }
            className="mb-1 flex h-[176px] w-full min-w-[900px] gap-1 overflow-hidden"
          >
            <IndexMiniChart showChart={expanded} />
            <IndexMiniChart showChart={expanded} symbol="VN30" />
            <IndexMiniChart showChart={expanded} symbol="HNX" topThrehold={9} />
            <IndexMiniChart
              showChart={expanded}
              symbol="UPCOM"
              topThrehold={13}
            />
          </motion.div>
        </div>
        <div
          className={cn(
            "border-background bg-card hover:text-foreground absolute top-[calc(100%-10px)] left-1/2 flex -translate-x-1/2 transform cursor-pointer items-center rounded-[8px] border-2 text-neutral-700 transition-all duration-150 hover:-translate-y-1",
            expanded
              ? "top-[calc(100%-10px)] hover:-translate-y-1"
              : "top-[calc(100%-20px)] rotate-180 hover:translate-y-1",
          )}
          onClick={() => {
            setExpanded((prev) => !prev);
          }}
        >
          <DoubleAltArrowUp iconStyle="Bold" size={20} />
        </div>
      </div>
      <div className="card flex h-full flex-1 flex-col gap-2 p-2">
        <BangGiaTable />
      </div>
    </div>
  );
}
