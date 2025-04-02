import { create } from "zustand";

const chiTietDanhMucStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state: any) => ({ isOpen: !state.isOpen })),
}));

export default function useChiTietDanhMucModal() {
  return chiTietDanhMucStore() as any;
}
