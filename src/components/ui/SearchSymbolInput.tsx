import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import {
  cn,
  formatNumber,
  formatPrice,
  getPriceColorFromOverviewData,
} from "@/lib/utils";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";
import { X } from "lucide-react";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";

export default function SearchSymbolInput() {
  const [nameString, setNameString] = useState<string>("");
  const { currentSymbol, setCurrentSymbol } = useCurrentSymbol();
  const { data, isLoading } = useMarketOverviewData();
  const ref = useRef<any>(null);
  const filterData = useMemo(
    () =>
      data
        ?.filter(
          (item) =>
            (nameString
              ? item.code.toLowerCase().includes(nameString.toLocaleLowerCase())
              : true) && item.secType === "S",
        )
        .sort((a, b) =>
          a.weekValue && b.weekValue ? a.weekValue - b.weekValue : 0,
        )
        .slice(0, 20) || [],
    [data, nameString],
  );
  useEffect(() => {
    if (nameString === "") {
      setNameString(currentSymbol);
    }
  }, [currentSymbol]);

  return (
    <Autocomplete
      variant="bordered"
      inputValue={nameString}
      onInputChange={setNameString}
      selectedKey={currentSymbol}
      onSelectionChange={(item) => {
        setNameString(item as string);
        setCurrentSymbol(item as string);
      }}
      classNames={{
        endContentWrapper: "mr-0",
        selectorButton: "hidden",
      }}
      defaultItems={filterData}
      inputProps={{
        classNames: {
          inputWrapper: cn(
            "border-1 rounded-[4px] border-neutral-800 !bg-card",
          ),
          input: currentSymbol ? "text-white" : "",
        },
      }}
      listboxProps={{
        hideSelectedIcon: true,
        itemClasses: {
          base: [
            "text-muted",
            "transition-opacity",
            "data-[hover=true]:bg-default-800 rounded-[6px]",
          ],
        },
      }}
      placeholder="Nhập mã CK"
      popoverProps={{
        classNames: {
          content: "p-1 bg-background rounded-[4px]",
        },
        placement: "bottom",
      }}
      endContent={
        nameString && (
          <Button
            isIconOnly
            radius="full"
            onClick={() => {
              setNameString("");
              ref.current?.focus();
            }}
            className="h-4 min-h-0 w-4 min-w-0 flex-shrink-0 !p-0 text-muted/50 hover:text-white"
          >
            <X size={12} />
          </Button>
        )
      }
      isClearable={false}
      ref={ref}
      isLoading={isLoading}
    >
      {(item: TSymbolOverviewData) => (
        <AutocompleteItem key={item.code} textValue={item.code}>
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-white">
                <img
                  src={`https://finance.vietstock.vn/image/${item.code}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="text-md text-white">{item.code}</div>
                <div className="!text-xs">{item.symbolName}</div>
              </div>
            </div>
            <div
              className={cn(
                "flex flex-col items-end text-sm",
                getPriceColorFromOverviewData(item),
              )}
            >
              <div>{formatPrice(item.price)}</div>
              <div>{formatNumber(item?.dayChangePercent, 2)}%</div>
            </div>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
