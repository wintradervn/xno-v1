// export default function useDNSEAccounts() {
//   const { jwtToken } = useTaiKhoanChungKhoan();
//   const { data, isLoading } = useSWR(
//     jwtToken ? ["dnse-accounts", jwtToken] : null,
//     ([, token]) => getAccountsList(token),
//   );
//   return { data, isLoading };
// }
