import { create } from "zustand";

export enum MODALS {
  TIM_KIEM,
}

const modalsStore = create((set) => ({
  isOpen: new Set(),
  openModal: (modal: MODALS) => {
    set((state: any) => {
      const updatedSet = new Set(state.isOpen);
      updatedSet.add(modal);
      return { isOpen: updatedSet };
    });
  },
  closeModal: (modal: MODALS) => {
    set((state: any) => {
      const updatedSet = new Set(state.isOpen);
      updatedSet.delete(modal);
      return { isOpen: updatedSet };
    });
  },
}));

export default function useModalsState(modal: MODALS) {
  const { isOpen, openModal, closeModal } = modalsStore() as any;

  return {
    isOpen: isOpen.has(modal),
    closeModal: () => closeModal(modal),
    openModal: () => openModal(modal),
  };
}
