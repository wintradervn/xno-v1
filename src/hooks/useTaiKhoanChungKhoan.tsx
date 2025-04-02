import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePersistStore from "./usePersistStore";

type TaiKhoanChungKhoanStore = {
  name: string;
  jwtToken: string;
  tradingToken: string;
  expire: number;
  setTaiKhoanChungKhoan: (broker: string, token: string) => void;
  setTradingToken: (token: string) => void;
  clearTaiKhoanChungKhoan: () => void;
};
const useTaiKhoanChungKhoanStore = create(
  persist<TaiKhoanChungKhoanStore>(
    (set) => ({
      name: "",
      jwtToken: "",
      tradingToken: "",
      expire: 0,
      setTaiKhoanChungKhoan: (broker: string, token: string) => {
        set({
          name: broker,
          jwtToken: token,
          tradingToken: "",
          expire: Date.now() + 8 * 60 * 60_000, // 8 hours
        });
      },
      setTradingToken: (token: string) => {
        set({ tradingToken: token });
      },
      clearTaiKhoanChungKhoan: () => {
        set({ name: "", jwtToken: "", tradingToken: "" });
      },
    }),
    {
      name: "tkck-tokendata",
    },
  ),
);

export default function useTaiKhoanChungKhoan() {
  const state = usePersistStore(
    useTaiKhoanChungKhoanStore,
    (state: any) => state,
  );
  return state
    ? {
        ...state,
        jwtToken: Date.now() < state.expire ? state.jwtToken : "",
        tradingToken: Date.now() < state.expire ? state.tradingToken : "",
      }
    : {};
}
