import { getAccountsList } from "@/lib/dnse-api";
import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";

// {
//   "default": {
//     "id": "0001986886",
//     "custodyCode": "064C6DL2XC",
//     "investorId": "1001533789",
//     "name": "Phạm Huy Điệp",
//     "accountType": "0449",
//     "currency": "VND",
//     "accountTypeName": "SpaceX",
//     "accountTypeBriefName": "Loại hình: Giao dịch theo DEAL; Phí giao dịch không vay: miễn phí",
//     "marginAccount": true,
//     "dealAccount": true,
//     "derivativeAccount": false,
//     "derivative": {
//       "status": "WAIT_TRADING"
//     },
//     "coinvestingAccount": false,
//     "properties": {
//       "Loại hình": "Giao dịch theo DEAL",
//       "Phí giao dịch không vay": "miễn phí"
//     }
//   },
//   "accounts": [
//     {
//       "id": "0001986886",
//       "custodyCode": "064C6DL2XC",
//       "investorId": "1001533789",
//       "name": "Phạm Huy Điệp",
//       "accountType": "0449",
//       "currency": "VND",
//       "accountTypeName": "SpaceX",
//       "accountTypeBriefName": "Loại hình: Giao dịch theo DEAL; Phí giao dịch không vay: miễn phí",
//       "marginAccount": true,
//       "dealAccount": true,
//       "derivativeAccount": false,
//       "derivative": {
//         "status": "WAIT_TRADING"
//       },
//       "coinvestingAccount": false,
//       "properties": {
//         "Loại hình": "Giao dịch theo DEAL",
//         "Phí giao dịch không vay": "miễn phí"
//       }
//     }
//   ]
// }

export default function useDNSEAccounts() {
  const { jwtToken } = useTaiKhoanChungKhoan();
  const { data, isLoading } = useSWR(
    jwtToken ? ["dnse-accounts", jwtToken] : null,
    ([, token]) => getAccountsList(token),
  );
  return { data, isLoading };
}
