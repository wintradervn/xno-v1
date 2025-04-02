import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

type SelectedGoiVayStore = {
  selectedGoiVay: number;
  setSelectedGoiVay: (selectedGoiVay: number) => void;
};

const useSelectedGoiVayStore = create(
  persist<SelectedGoiVayStore>(
    (set) => ({
      selectedGoiVay: 1775,
      setSelectedGoiVay: (selectedGoiVay: number) => set({ selectedGoiVay }),
    }),
    {
      name: "selectedGoiVay",
    },
  ),
);

export default function useSelectedGoiVay() {
  const state = usePersistStore(useSelectedGoiVayStore, (state: any) => state);
  return { ...state };
}
