import { useSymbolWSData } from "@/hooks/websocket/useSymbolInfoWebsocket";
import { formatPrice } from "@/lib/utils";
import clsx from "clsx";

export function LiveSymbolPrice({
  className,
  symbol,
  defaultValue,
}: {
  className?: string;
  symbol?: string;
  defaultValue?: string | number;
}) {
  const { siData } = useSymbolWSData(symbol);

  const price = siData?.price
    ? formatPrice(siData.price * 1000)
    : defaultValue || 0;

  return (
    <span
      className={clsx("animate-change-background-cyan", className)}
      key={price}
    >
      {price}
    </span>
  );
}
