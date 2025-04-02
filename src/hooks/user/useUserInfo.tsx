import { useAuthStore } from "@/store/auth";
import useSWR from "swr";

export default function useUserInfo() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isLoading } = useSWR(["userInfo", accessToken], async () => {
    const res = await fetch("/api/indexchart");
    const data = await res.json();
    return data.data.indexs;
  });
  return { data, isLoading };
}
