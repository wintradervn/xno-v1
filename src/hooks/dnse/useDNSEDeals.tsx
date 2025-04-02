import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";
import useDNSEAccounts from "./useDNSEAccounts";
import { getDeals } from "@/lib/dnse-api";

export type TDNSEDeal = {
  id: number;
  symbol: string;
  accountNo: string;
  status: "ODD_LOT" | "CLOSED" | "OPEN" | "PENDING_CLOSE";
  loanPackageId: number;
  side: "NB" | "NS";
  secure: number;
  accumulateQuantity: number;
  accumulateSecure: number;
  accumulateDebt: number;
  accumulateMarginDebt: number;
  tradeQuantity: number;
  closedQuantity: number;
  t0ReceivingQuantity: number;
  t1ReceivingQuantity: number;
  t2ReceivingQuantity: number;
  pendingCloseQuantity: number;
  costPrice: number;
  averageCostPrice: number;
  averageClosePrice: number;
  marketPrice: number;
  realizedProfit: number;
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
  openQuantity: number;
  unrealizedDealManaPrepayDebt: number;
  accumulateDealManaPrepayDebt: number;
  accumulateDealManaDebt: number;
  unrealizedOpenTaxAndFee: number;
  dealManaDebt: number;
};

export default function useDNSEDeals() {
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { data: accounts } = useDNSEAccounts();
  const account = accounts?.default.id;
  const { data, isLoading } = useSWR<TDNSEDeal[]>(
    jwtToken && account ? ["dnse-deals", jwtToken, account] : null,
    ([, token, account]) => getDeals(token as string, account as string),
    {
      refreshInterval: 5000,
    },
  );
  return { data, isLoading };
}
