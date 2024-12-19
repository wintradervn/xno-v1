import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

const defaultListFilter = [
  "giaTriGiaoDichRong",
  "bienDoGiaDongCua",
  "pe",
  "vonhoa",
];
const useLocCoPhieuStore = create(
  persist(
    (set) => ({
      listFilter: ["giaTriGiaoDichRong", "bienDoGiaDongCua", "pe", "vonhoa"],
      addFilter: (filter: string) =>
        set((state: any) =>
          state.listFilter.includes(filter)
            ? { istFilter: [...state.listFilter] }
            : { listFilter: [...state.listFilter, filter] },
        ),
      removeFilter: (filter: string) =>
        set((state: any) => ({
          listFilter: state.listFilter.filter(
            (item: string) => item !== filter,
          ),
        })),
      setDefaultFilter: () => set({ listFilter: defaultListFilter }),
    }),
    {
      name: "locCoPhieuListFilter",
    },
  ),
);

export default function useLocCoPhieuState() {
  const state = usePersistStore(useLocCoPhieuStore, (state: any) => state);
  return { ...state };
}
