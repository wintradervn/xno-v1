import { cn } from "@/lib/utils";
import { Spinner } from "@heroui/react";

export default function DefaultLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[300px] min-h-full w-full items-center justify-center sm:h-[250px]",
        className,
      )}
    >
      <Spinner />
    </div>
  );
}
