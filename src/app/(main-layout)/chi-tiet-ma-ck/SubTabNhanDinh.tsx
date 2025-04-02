"use client";
import DefaultLoader from "@/components/ui/DefaultLoader";
import DefaultNodata from "@/components/ui/DefaultNodata";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";
import useFINSCNhanDinhChuyenGia from "@/hooks/finsc/useFINSCNhanDinhChuyenGia";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import { cn } from "@/lib/utils";
import { useState } from "react";
const data = { gia: 39.56, kl: "3.3M", change: 12.4 };

export default function SubTabNhanDinh() {
  const { symbol } = useChiTietMaCK();
  const { data, isLoading } = useFINSCNhanDinhChuyenGia(symbol);

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex shrink-0 flex-col gap-2">
        <div className="shrink-0 text-sm font-semibold">Nhận định</div>
        {isLoading ? (
          <DefaultLoader />
        ) : data ? (
          <>
            <div className="text-lineargreen flex shrink-0 items-center gap-2 text-sm font-semibold">
              Góc nhìn chuyên gia ({data.d}) <img src="/slidingStar.svg" />
            </div>
            <div className="no-scrollbar flex-1 overflow-auto">
              <div className={cn("relative text-sm")}>{data.reason}</div>
            </div>
          </>
        ) : (
          <DefaultNodata text="Chưa có nhận định" />
        )}
      </div>
    </div>
  );
}
