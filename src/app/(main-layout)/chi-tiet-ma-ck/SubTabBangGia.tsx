import MarketHistory from "@/components/module/MarketHistory";
import Orderbook from "@/components/module/Orderbook";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";

export default function SubTabBangGia() {
  const { symbol } = useChiTietMaCK();

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <div>
        <Orderbook symbol={symbol} />
      </div>

      <div className="text-md font-bold">Khớp lệnh</div>
      <div className="flex min-h-0 flex-1 shrink-0 flex-col">
        <MarketHistory symbol={symbol} />
      </div>
    </div>
  );
}
