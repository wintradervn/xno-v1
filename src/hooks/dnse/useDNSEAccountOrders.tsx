import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";
import { getAccountOrders } from "@/lib/dnse-api";
import useDNSEAccounts from "./useDNSEAccounts";

export default function useDNSEAccountOrders() {
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { data: accounts } = useDNSEAccounts();
  const account = accounts?.default.id;
  const { data, isLoading } = useSWR(
    jwtToken && account ? ["dnse-accounts-orders", jwtToken, account] : null,
    ([, token, account]) => getAccountOrders(token, account),
  );
  return { data, isLoading };
}
