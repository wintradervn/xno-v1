import { cn } from "@/lib/utils";

export default function SymbolIcon({
  symbol,
  className,
}: {
  symbol?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white",
        className,
      )}
    >
      <img
        src={`https://finance.vietstock.vn/image/${symbol}`}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
