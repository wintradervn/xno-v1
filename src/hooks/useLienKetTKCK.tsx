import { create } from "zustand";

const useLienKetTKCKModal = create<any>((set) => ({
  isOpen: false,
  toggle: () => set((state: any) => ({ isOpen: !state.isOpen })),
}));

export default useLienKetTKCKModal;
