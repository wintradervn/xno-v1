import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

const useFavoritesStore = create(
  persist(
    (set) => ({
      favorites: ["VCB", "VNM", "VHM"],
      addFavorite: (symbol: string) =>
        set((state: any) => ({ favorites: [...state.favorites, symbol] })),

      removeFavorite: (symbol: string) =>
        set((state: any) => ({
          favorites: state.favorites.filter((item: string) => item !== symbol),
        })),
    }),
    {
      name: "favorites",
    },
  ),
);

export default function useFavorites() {
  const state = usePersistStore(useFavoritesStore, (state: any) => state);
  return { ...state };
}
