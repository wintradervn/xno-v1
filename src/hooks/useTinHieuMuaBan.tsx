import { useMemo } from "react";
import useFilterProData, { IFilterProData } from "./useFilterProData";
import { add, format } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TinHieuMuaBanStore = {
  listTinHieu: { id: string; data: IFilterProData }[];
  addTinHieu: (id: string, data: IFilterProData) => void;
};

const useTinHieuMuaBanStore = create(
  persist<TinHieuMuaBanStore>(
    (set) => ({
      listTinHieu: [],
      addTinHieu: (id: string, data: IFilterProData) => {
        set((state) => {
          return {
            listTinHieu: [
              ...state.listTinHieu,
              {
                id,
                data,
              },
            ],
          };
        });
      },
    }),
    { name: "tin-hieu-mua-ban" },
  ),
);

export default function useTinHieuMuaBan() {
  const { data, isLoading } = useFilterProData();
  const tinHieuMua = useMemo(() => {
    if (!data) return [];
    return data
      ?.filter((item) => {
        return (
          !!item.CHIENLUOC &&
          !!item.NGAYMUA &&
          new Date(item.NGAYMUA).getTime() + 8 * 24 * 3600_000 > Date.now() &&
          (!item.NGAYBAN || item.NGAYBAN.startsWith("1899")) &&
          item.ThanhKhoanTB50 > 2_000_000_000
          // item.AIPredict20d > item.GIA
        );
      })
      .map((item) => {
        return { ...item, type: "MUA", date: item.NGAYMUA };
      });
  }, [data]);
  const tinHieuBan = useMemo(() => {
    if (!data) return [];
    return data
      ?.filter((item) => {
        return (
          !!item.CHIENLUOC &&
          !!item.NGAYMUA &&
          !!item.NGAYBAN &&
          new Date(item.NGAYBAN).getTime() + 8 * 24 * 3600_000 > Date.now() &&
          item.ThanhKhoanTB50 > 2_000_000_000
          // item.AIPredict20d < item.GIA
        );
      })
      .map((item) => {
        return { ...item, type: "BAN", date: item.NGAYBAN };
      });
  }, [data]);
  return { tinHieuMua, tinHieuBan, isLoading };
}

export function TinHieuMuaBanUpdater() {
  const { tinHieuBan, tinHieuMua } = useTinHieuMuaBan();

  return <></>;
}
