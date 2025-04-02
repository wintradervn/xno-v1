import { ROOT_API_URL } from "@/lib/constant";
import useSWR from "swr";

export interface ICanDoiKeToanItem {
  ticker: string; // Stock ticker symbol
  quarter: number; // Fiscal quarter (1-4)
  year: number; // Fiscal year
  shortAsset: number; // Tài sản ngắn hạn
  cash: number; // Tiền mặt
  shortInvest: number; // Giá trị thuần đầu tư ngắn hạn
  shortReceivable: number; // Các khoản phải thu
  inventory: number; // Hàn tồn kho, ròng
  longAsset: number; // Tài sản dài hạn
  fixedAsset: number; // Tài sản cố định
  asset: number; // Tổng cộng tài sản
  debt: number; // Tổng nợ phải trả
  shortDebt: number; // Vay ngắn hạn
  longDebt: number; // Vay dài hạn
  equity: number; // Vốn chủ sở hữu
  capital: number; // Vốn điều lệ
  centralBankDeposit: number | null; // Tiền gửi tại ngân hàng nhà nước VN
  otherBankDeposit: number | null; //
  otherBankLoan: number | null; //
  stockInvest: number | null; //
  customerLoan: number | null; // Cho vay khách hàng
  badLoan: number | null; //
  provision: number | null; // Dự phòng rủi ro cho vay khách hàng
  netCustomerLoan: number | null; // Cho vay khách hàng
  otherAsset: number | null; // Tài sản Có khác
  otherBankCredit: number | null; //
  oweOtherBank: number | null; //
  oweCentralBank: number | null; // Các khoản nợ chính phủ và NHNN Việt Nam
  valuablePaper: number | null; // Phát hành giấy tờ có giá
  payableInterest: number | null; //
  receivableInterest: number | null; //
  deposit: number | null; // Tiền gửi của khách hàng
  otherDebt: number; // Các khoản nợ khác
  fund: number | null; // Quỹ của tổ chức tín dụng
  unDistributedIncome: number; // Lợi nhuận chưa phân phối
  minorShareHolderProfit: number; //
  payable: number; // Tổng nợ phải trả
}

export default function useCanDoiKeToanData(
  symbol: string | undefined,
  yearly: boolean,
) {
  const { data, isLoading } = useSWR<ICanDoiKeToanItem[]>(
    symbol ? ["candoiketoan", symbol, yearly] : null,
    async ([, symbol, yearly]) => {
      const res = await fetch(
        `${ROOT_API_URL}/balancesheet?symbol=${symbol}&yearly=${yearly ? "1" : "0"}`,
      );
      const data = await res.json();
      return (
        data.data
          .sort((a: ICanDoiKeToanItem, b: ICanDoiKeToanItem) =>
            a.year !== b.year ? a.year - b.year : a.quarter - b.quarter,
          )
          .map((item: ICanDoiKeToanItem) =>
            Object.fromEntries(
              Object.entries(item).map(([key, value]) => {
                if (value === null) return [key, 0];
                return [key, value];
              }),
            ),
          ) || []
      );
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );
  return { data, isLoading };
}
