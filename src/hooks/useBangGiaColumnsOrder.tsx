import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";
import { DANH_MUC_BANG_GIA } from "@/app/(main-layout)/(customable-layout)/bang-gia/constant";

type BangGiaColumnsOrder = {
  pinnedColumns: string[];
  columnsOrder: string[];
  setColumnsOrder: (newOrders: any) => void;
  addColumn: (column: string) => void;
  removeColumn: (column: string) => void;
  togglePinColumn: (column: string) => void;
};

export const useBangGiaColumnsOrderStore = create(
  persist<BangGiaColumnsOrder>(
    (set, get) => ({
      pinnedColumns: [],
      columnsOrder: Object.keys(DANH_MUC_BANG_GIA),
      setColumnsOrder: (newOrders: any) =>
        set((state) => {
          const { pinnedColumns } = state;
          if (pinnedColumns.every((id, index) => id === newOrders[index])) {
            return { columnsOrder: newOrders };
          }
          return { columnsOrder: state.columnsOrder };
        }),
      removeColumn: (column: string) => {
        set((state) => {
          return {
            columnsOrder: state.columnsOrder.filter((item) => item !== column),
          };
        });
      },
      addColumn: (column: string) => {
        set((state) => {
          return {
            columnsOrder: [...state.columnsOrder, column],
          };
        });
      },
      togglePinColumn: (column: string) => {
        const state = get();
        if (state.pinnedColumns?.includes(column)) {
          set((state) => {
            const newpinnedColumns = state.pinnedColumns.filter(
              (item) => item !== column,
            );
            return {
              pinnedColumns: newpinnedColumns,
              columnsOrder: [
                ...newpinnedColumns,
                ...state.columnsOrder.filter(
                  (item) => !newpinnedColumns.includes(item),
                ),
              ],
            };
          });
        } else {
          set((state) => {
            const newpinnedColumns = [...state.pinnedColumns, column];
            return {
              pinnedColumns: newpinnedColumns,
              columnsOrder: [
                ...newpinnedColumns,
                ...state.columnsOrder.filter(
                  (item) => !newpinnedColumns.includes(item),
                ),
              ],
            };
          });
        }
      },
    }),
    {
      name: "banggia-columnsOrder-v4",
    },
  ),
);

export default function useBangGiaColumnsOrder() {
  const state = usePersistStore(
    useBangGiaColumnsOrderStore,
    (state: any) => state,
  );
  return { ...state };
}
