import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

const useMucQuanTamStore = create(
  persist(
    (set) => ({
      listQuanTam: [],
      addNewList: (name: string) =>
        set((state: any) => ({
          listQuanTam: [...state.listQuanTam, { name: name, list: [] }],
        })),
      updateListName: (oldName: string, newName: string) => {
        set((state: any) => {
          const index = state.listQuanTam.findIndex(
            (item: any) => item.name === oldName,
          );
          state.listQuanTam[index].name = newName;
          return { ...state };
        });
      },
      removeList: (name: string) =>
        set((state: any) => ({
          listQuanTam: state.listQuanTam.filter(
            (item: any) => item.name !== name,
          ),
        })),
      addMaCK: (name: string, symbol: string) =>
        set((state: any) => {
          const index = state.listQuanTam.findIndex(
            (item: any) => item.name === name,
          );
          state.listQuanTam[index].list.push(symbol);
          return { ...state };
        }),
      removeMaCK: (name: string, symbol: string) => {
        set((state: any) => {
          const index = state.listQuanTam.findIndex(
            (item: any) => item.name === name,
          );
          state.listQuanTam[index].list = state.listQuanTam[index].list.filter(
            (item: string) => item !== symbol,
          );
          return { ...state };
        });
      },
    }),
    {
      name: "muc-quan-tam-bang-gia-v2",
    },
  ),
);

export default function useMucQuanTam() {
  const state = usePersistStore(useMucQuanTamStore, (state: any) => state);
  return { ...state };
}
