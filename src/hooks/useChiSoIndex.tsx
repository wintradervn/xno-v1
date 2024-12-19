import useSWR from "swr";

export default function useChiSoIndex() {
  const { data } = useSWR("chi-so-index", async () => {
    const res = await fetch("/api/indexchart");
    const data = await res.json();
    return data.data.indexs;
  });
  return { data };
}
