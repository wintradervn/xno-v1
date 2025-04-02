import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

type BangGiaSelectedNganh = {
  selectedNganh: string[];
  addNganh: (id: string) => void;
  removeNganh: (id: string) => void;
};

const useBangGiaSelectedNganhStore = create(
  persist<BangGiaSelectedNganh>(
    (set) => ({
      selectedNganh: [],
      addNganh: (id) =>
        set((state) => {
          const newNganh = [...state.selectedNganh, id];
          return {
            selectedNganh: newNganh.filter(
              (item, index) => newNganh.indexOf(item) === index,
            ),
          };
        }),
      removeNganh: (id) =>
        set((state) => ({
          selectedNganh: state.selectedNganh.filter((item) => item !== id),
        })),
    }),
    { name: "banggia-selected-nganh-v1" },
  ),
);

export default function useBangGiaSelectedNganh<BoLocCaNhanStore>() {
  const state = usePersistStore(
    useBangGiaSelectedNganhStore,
    (state: any) => state,
  );

  return {
    ...state,
  };
}
