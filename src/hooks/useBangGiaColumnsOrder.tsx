import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

const useBangGiaColumnsOrderStore = create(
  persist(
    (set) => ({
      columnsOrder: [
        "bank",
        "realEstate",
        "consumer",
        "logistics",
        "oilGas",
        "defensive",
        "stock",
      ],
      setColumnsOrder: (newOrders: any) =>
        set(() => ({ columnsOrder: newOrders })),
    }),
    {
      name: "banggia-columnsOrder",
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
