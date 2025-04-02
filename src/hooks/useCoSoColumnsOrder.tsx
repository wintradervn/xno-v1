import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

const useCoSoColumnsOrderStore = create(
  persist(
    (set) => ({
      columnsOrder: ["canhan", "tochuc", "nuocngoai", "tudoanh"],
      setColumnsOrder: (newOrders: any) =>
        set(() => ({ columnsOrder: newOrders })),
    }),
    {
      name: "dongtienndt-coso-columnsOrder",
    },
  ),
);

export default function useCoSoColumnsOrder() {
  const state = usePersistStore(
    useCoSoColumnsOrderStore,
    (state: any) => state,
  );
  return { ...state };
}
