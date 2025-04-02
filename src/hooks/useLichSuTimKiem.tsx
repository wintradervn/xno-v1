import { create } from "zustand";
import usePersistStore from "./usePersistStore";
import { persist } from "zustand/middleware";

const lichSuTimKiemStore = create(
  persist(
    (set) => ({
      symbols: [],
      addSymbol: (symbol: string) =>
        set((state: any) => ({
          symbols: [
            symbol,
            ...state.symbols.filter((s: string) => s !== symbol),
          ],
        })),
      removeSymbol: (symbol: string) =>
        set((state: any) => ({
          symbols: [...state.symbols.filter((s: string) => s !== symbol)],
        })),
    }),
    {
      name: "dongtienndt-coso-columnsOrder",
    },
  ),
);

export default function useLichSuTimKiem() {
  const state = usePersistStore(lichSuTimKiemStore, (state: any) => state);
  return { ...state };
}
