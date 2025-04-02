import DinhGiaLineChart from "@/components/charts/DinhGiaLineChart";

import useCurrentSymbol from "@/hooks/useCurrentSymbol";

export default function SubTabDinhGia() {
  const { currentSymbol } = useCurrentSymbol();

  return (
    <div className="flex flex-1 flex-col">
      <DinhGiaLineChart symbol={currentSymbol} />
    </div>
  );
}
