import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";
import { getPhaiSinhSucMuaSucBan, getSucMuaSucBan } from "@/lib/dnse-api";
import useDNSEAccounts from "./useDNSEAccounts";

export interface ISucMuaSucBan {
  investorId: string;
  investorAccountId: string;
  custodyCode: string;
  ppse: number; // Sức mua
  pp0: number;
  pp0Long: number;
  pp0Short: number;
  qmax: number;
  qmaxLong: number; // mua tối đa
  qmaxShort: number; // bán tối đa
  tradeQuantity: number;
  price: number;
}

export default function useDNSESucMuaBan({
  symbol,
  isPhaiSinh,
  price,
  loanPackageId,
}: {
  symbol: string;
  isPhaiSinh: boolean;
  price: string;
  loanPackageId: string;
}) {
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { data: accounts } = useDNSEAccounts();
  const { data, isLoading } = useSWR<ISucMuaSucBan>(
    jwtToken && accounts?.default?.id && symbol && price && loanPackageId
      ? [
          "dnse-suc-muaban",
          jwtToken,
          accounts.default.id,
          symbol,
          price,
          loanPackageId,
        ]
      : null,
    ([, token, accountId, symbol, price, loanPackageId]) =>
      isPhaiSinh
        ? getPhaiSinhSucMuaSucBan(
            token as string,
            accountId as string,
            symbol as string,
            price as string,
            "1306", // TODO
          )
        : getSucMuaSucBan(
            token as string,
            accountId as string,
            symbol as string,
            price as string,
            loanPackageId as string,
          ),
    { refreshInterval: 10000 },
  );
  return { data, isLoading };
}
