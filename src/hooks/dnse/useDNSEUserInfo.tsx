import useSWR from "swr";
import useTaiKhoanChungKhoan from "../useTaiKhoanChungKhoan";
import { getUserInfo } from "@/lib/dnse-api";

// createdDate: "2024-12-05T03:50:02.425Z",
// email: "zhangyhun@yahoo.com",
// enId: "5d0100a9-3503-4fbe-b3d0-abfecadd11db",
// id: "1001533789",
// investorId: "1001533789",
// isEmailVerified: false,
// mobile: "0839082127",
// modifiedDate: "2024-12-05T03:50:21.037Z",
// name: "",
// needToChangePassword: false,
// registeredSmartOtp: false,
// status: "VERIFIED",
// unverifiedEmail: "zhangyhun@yahoo.com",\

type UserInfo = {
  createdDate: string;
  email: string;
  enId: string;
  id: string;
  investorId: string;
  isEmailVerified: boolean;
  mobile: string;
  modifiedDate: string;
  name: string;
  needToChangePassword: boolean;
  registeredSmartOtp: boolean;
  status: string;
  unverifiedEmail: string;
  flexCustomerId: string;
};

export default function useDNSEUserInfo() {
  const { name, jwtToken } = useTaiKhoanChungKhoan();
  const { data, isLoading } = useSWR<UserInfo>(
    jwtToken ? [`dnse-user-info`, jwtToken] : null,
    ([, token]) => getUserInfo(token as string),
  );
  return { data, isLoading };
}
