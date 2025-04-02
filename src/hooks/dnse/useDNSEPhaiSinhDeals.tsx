import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";
import useDNSEAccounts from "./useDNSEAccounts";
import { getDeals, getDealsPhaiSinh } from "@/lib/dnse-api";

export type TDNSEPhaiSinhDeal = {
  id: number;
  symbol: string;
  accountNo: string;
  status: "ODD_LOT" | "CLOSED" | "OPEN" | "PENDING_CLOSE";
  loanPackageId: number;
  side: "NB" | "NS";
  secure: number;
  accumulateQuantity: number;
  closedQuantity: number;
  openQuantity: number;
  costPrice: number;
  averageCostPrice: number;
  averageClosePrice: number;
  collectedBuyingFee: number;
  collectedBuyingTax: number;
  collectedSellingFee: number;
  collectedStockTransferFee: number;
  collectedInterestFee: number;
  collectedSellingTax: number;
  collectedSellingDividendTax: number;
  realizedTotalTaxAndFee: number;
  realizedOpenFee: number;
  realizedOpenTax: number;
  estimateRemainTaxAndFee: number;
  unrealizedProfit: number;
  dividendReceivingQuantity: number;
  dividendQuantity: number;
  cashReceiving: number;
  rightReceivingQuantity: number;
  maxRightQuantity: number;
  t0ReceivingCash: number;
  t1ReceivingCash: number;
  t2ReceivingCash: number;
  breakEvenPrice: number;
  currentDebt: number;
  marginDebt: number;
  currentInterest: number;
  accumulatePrepayDebt: number;
  accumulateMarginPrepayDebt: number;
  accumulatePrepayInterest: number;
  unrealizedPrepayDebt: number;
  unrealizedMarginPrepayDebt: number;
  unrealizedPrepayInterest: number;
  blockedQuantity: number;
  restrictedQuantity: number;
  createdDate: string;
  modifiedDate: string;
  active: boolean;
  unrealizedDealManaPrepayDebt: number;
  accumulateDealManaPrepayDebt: number;
  accumulateDealManaDebt: number;
  unrealizedOpenTaxAndFee: number;
  dealManaDebt: number;
};

export default function useDNSEPhaiSinhDeals() {
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { data: accounts } = useDNSEAccounts();
  const account = accounts?.default.id;
  const { data, isLoading } = useSWR<TDNSEPhaiSinhDeal[]>(
    jwtToken && account ? ["dnse-phai-sinh-deals", jwtToken, account] : null,
    ([, token, account]) =>
      getDealsPhaiSinh(token as string, account as string),
    {
      refreshInterval: 15000,
    },
  );
  return { data, isLoading };
}
