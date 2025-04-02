import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";
import { getAccountBalances } from "@/lib/dnse-api";
import useDNSEAccounts from "./useDNSEAccounts";

export interface IAccountBalances {
  investorId: string;
  custodyCode: string;
  investorAccountId: string;
  totalCash: number; // Tiền mặt
  availableCash: number;
  termDeposit: number;
  depositInterest: number;
  stockValue: number; // Giá trị cổ phiếu
  marginableAmount: number;
  nonMarginableAmount: number;
  totalDebt: number;
  netAssetValue: number; // Tài sản ròng
  receivingAmount: number;
  secureAmount: number;
  depositFeeAmount: number;
  maxLoanLimit: number;
  withdrawableCash: number;
  collateralValue: number;
  orderSecured: number;
  purchasingPower: number;
  cashDividendReceiving: number;
  marginDebt: number;
  marginRate: number;
  ppWithdraw: number;
  blockMoney: number;
  totalRemainDebt: number; // tổng nợ
  totalUnrealizedDebt: number;
  blockedAmount: number;
  id: string;
}

export default function useDNSEAccountBalances() {
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { data: accounts } = useDNSEAccounts();
  const account = accounts?.default.id;
  const { data, isLoading } = useSWR<IAccountBalances>(
    jwtToken && account ? ["dnse-accounts-balances", jwtToken, account] : null,
    ([, token, account]) =>
      getAccountBalances(token as string, account as string),
  );
  return { data, isLoading };
}
