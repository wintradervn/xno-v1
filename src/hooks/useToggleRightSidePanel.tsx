import { create } from "zustand";

interface IUseToggleRightSidePanelStore {
  isHidden: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const useToggleRightSidePanel = create<IUseToggleRightSidePanelStore>(
  (set) => ({
    isHidden: false,
    toggle: () => set((state: any) => ({ isHidden: !state.isHidden })),
    open: () => set({ isHidden: false }),
    close: () => set({ isHidden: true }),
  }),
);

export default useToggleRightSidePanel;
