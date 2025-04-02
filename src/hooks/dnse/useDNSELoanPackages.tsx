import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";
import { getLoanPackages } from "@/lib/dnse-api";
import useDNSEAccounts from "./useDNSEAccounts";

export interface IDNSELoanProduct {
  id: string;
  name: string;
  symbol: string;
  initialRate: number;
  initialRateForWithdraw: number;
  maintenanceRate: number;
  liquidRate: number;
  interestRate: number;
  preferentialPeriod: number;
  preferentialInterestRate: number;
  term: number;
  allowExtendLoanTerm: boolean;
  allowEarlyPayment: boolean;
  productCategoryId: number;
}
export interface IDNSELoanPackage {
  id: number;
  label: string;
  basketId: number;
  brokerFirmBuyingFeeRate: number;
  brokerFirmSellingFeeRate: number;
  description: string;
  loanProducts: IDNSELoanProduct[];
  name: string;
  productCategoryId: number;
  transferFee: number;
  type: string;
}

export default function useDNSELoanPackages() {
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { data: accounts } = useDNSEAccounts();
  const { data, isLoading } = useSWR<IDNSELoanPackage[]>(
    jwtToken && accounts?.default?.id
      ? ["dnse-loan-packages", jwtToken, accounts.default.id]
      : null,
    ([, token, accountId]) =>
      getLoanPackages(token as string, accountId as string),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  );
  return { data, isLoading };
}
