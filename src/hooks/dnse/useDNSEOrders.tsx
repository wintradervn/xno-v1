import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";
import useDNSEAccounts from "./useDNSEAccounts";
import { getOrders } from "@/lib/dnse-api";

export interface IOrder {
  id: number;
  side: string;
  accountNo: string;
  investorId: string;
  symbol: string;
  price: number;
  quantity: number;
  orderType: string;
  orderStatus: "New" | "Filled" | "Canceled";
  fillQuantity: number;
  lastQuantity: number;
  lastPrice: number;
  averagePrice: number;
  transDate: string;
  createdDate: string;
  modifiedDate: string;
  reports: any[];
  taxRate: number;
  exchangeFeeRate: number;
  feeRate: number;
  leaveQuantity: number;
  canceledQuantity: number;
  error: string;
  text: string;
  priceSecure: number;
  custody: string;
  execType: string;
  maker: string;
  channel: string;
  loanPackageId: number;
  initialRate: number;
  extraInfo: { orderSession: string; ip: string; maker: string };
}

export default function useDNSEOrders() {
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { data: accounts } = useDNSEAccounts();
  const account = accounts?.default.id;
  const { data, isLoading } = useSWR<IOrder[]>(
    jwtToken && account ? ["dnse-order", jwtToken, account] : null,
    ([, token, account]) => getOrders(token as string, account as string),
    { refreshInterval: 5000 },
  );
  return { data, isLoading };
}
