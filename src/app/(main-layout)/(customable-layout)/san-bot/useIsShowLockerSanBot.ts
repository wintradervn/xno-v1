import { create } from "zustand";

export const useIsShowLockerSanBot = create<{
  isShowLocker: boolean;
  setIsShowLocker: (isShowLocker: boolean) => void;
}>((set) => ({
  isShowLocker: false,
  setIsShowLocker: (isShowLocker: boolean) => set({ isShowLocker }),
}));
