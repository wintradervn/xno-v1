import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

type BoLocCaNhanStore = {
  selectedBoLocId: string;
  listBoLocCaNhan: { name: string; config: string; id: string }[];
  addBoLocCaNhan: (id: string, config: string) => void;
  removeBoLocCaNhan: (id: string) => void;
  editBoLocCaNhan: (id: string, name?: string, config?: string) => void;
  setSelectedBoLocId: (id: string) => void;
};

const useBoLocCaNhanStore = create(
  persist<BoLocCaNhanStore>(
    (set) => ({
      selectedBoLocId: "",
      listBoLocCaNhan: [],
      addBoLocCaNhan: (name, config) =>
        set((state) => {
          const newName =
            name ||
            "Bộ lọc cá nhân " + (state.listBoLocCaNhan.length + 1).toString();
          const id = newName + Date.now().toString();
          return {
            listBoLocCaNhan: [
              ...state.listBoLocCaNhan,
              {
                name: newName,
                config,
                id,
              },
            ],
            selectedBoLocId: id,
          };
        }),
      removeBoLocCaNhan: (id) =>
        set((state) => ({
          listBoLocCaNhan: state.listBoLocCaNhan.filter(
            (item) => item.id !== id,
          ),
        })),
      editBoLocCaNhan: (id, name, config) =>
        set((state) => ({
          listBoLocCaNhan: state.listBoLocCaNhan.map((item) =>
            item.id === id
              ? {
                  ...item,
                  name: name || item.name,
                  config: config || item.config,
                }
              : item,
          ),
        })),
      setSelectedBoLocId: (id) => set({ selectedBoLocId: id }),
    }),
    { name: "bo-loc-ca-nhan" },
  ),
);

export default function useBoLocCaNhan<BoLocCaNhanStore>() {
  const state = usePersistStore(useBoLocCaNhanStore, (state: any) => state);

  return {
    ...state,
  };
}
