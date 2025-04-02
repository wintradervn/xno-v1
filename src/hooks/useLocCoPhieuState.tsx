import { create } from "zustand";
import usePersistStore from "./usePersistStore";

function removeEmptyArrayProperties(obj: any) {
  Object.keys(obj).forEach((key) => {
    if (Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key];
    }
  });
  return obj;
}

const defaultFilter = {
  NGANH: {},
  KL1KLTB: {},
  NGANHAN: {},
  TRUNGHAN: {},
  DAIHAN: {},
  SUCMANH: {},
} as const;

const useLocCoPhieuStore = create((set) => ({
  listFilter: [],
  filterState: {},
  addFilter: (filter: string) =>
    set((state: any) =>
      state.listFilter.includes(filter)
        ? { listFilter: [...state.listFilter] }
        : { listFilter: [...state.listFilter, filter] },
    ),
  removeFilter: (filter: string) =>
    set((state: any) => {
      const newState = { ...state.filterState };
      delete newState[filter];

      return {
        listFilter: state.listFilter.filter((item: string) => item !== filter),
        filterState: newState,
      };
    }),
  setFilter(state: any) {
    set({ filterState: state, listFilter: Object.keys(state) });
  },
  updateFilterState: (newFilter: any) =>
    set({
      filterState: removeEmptyArrayProperties(newFilter),
    }),
  setDefaultFilter: () => set({ filterState: defaultFilter }),
}));

export default function useLocCoPhieuState() {
  const state = usePersistStore(useLocCoPhieuStore, (state: any) => state);
  return { ...state };
}
