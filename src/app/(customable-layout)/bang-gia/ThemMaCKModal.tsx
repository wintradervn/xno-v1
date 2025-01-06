"use client";
import Button from "@/components/ui/Button";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import useMucQuanTam from "@/hooks/useMucQuanTam";
import {
  cn,
  formatNumber,
  formatPrice,
  getPriceColorFromOverviewData,
} from "@/lib/utils";
import {
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { RoundedMagnifer } from "solar-icon-set";

export default function ThemMaCKModal({
  isOpen,
  onAdd,
  onClose,
}: {
  isOpen: boolean;
  onAdd: (symbol: string) => void;
  onClose: () => void;
}) {
  const [nameString, setNameString] = useState<string>("");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const { data, isLoading } = useMarketOverviewData();

  const filterData = useMemo(
    () =>
      data
        ?.filter((item) =>
          nameString
            ? item.code.toLowerCase().includes(nameString.toLocaleLowerCase())
            : true && item.secType === "S",
        )
        .sort((a: any, b: any) => (a.volume > b.volume ? -1 : 1))
        .sort((a, b) => {
          const startsWithA = a.code
            .toLowerCase()
            .startsWith(nameString.toLowerCase());
          const startsWithB = b.code
            .toLowerCase()
            .startsWith(nameString.toLowerCase());

          // If both start with the search string, maintain original order
          if (startsWithA && startsWithB) return 0;
          // If only 'a' starts with the search string, it ranks higher
          if (startsWithA) return -1;
          // If only 'b' starts with the search string, it ranks higher
          if (startsWithB) return 1;

          // If neither starts with the search string, sort alphabetically
          return a.code.localeCompare(b.code);
        })
        .slice(0, 20) || [],
    [data, nameString],
  );

  const handleThemMaCK = () => {
    if (nameString.trim() === "") return;
    onAdd(nameString);
    onClose();
    setTimeout(() => {
      setNameString("");
      setSelectedSymbol("");
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <div className="text-caption text-lineargreen flex w-full items-center justify-center">
            Thêm mã chứng khoán
          </div>
        </ModalHeader>
        <ModalBody className="px-5 py-1">
          <div className="text-sm text-muted">Tên Mã CK</div>

          {isLoading ? null : (
            <Autocomplete
              inputValue={nameString}
              onInputChange={setNameString}
              selectedKey={selectedSymbol}
              onSelectionChange={(item) => {
                setSelectedSymbol(item as string);
                setNameString(item as string);
              }}
              classNames={{
                endContentWrapper: "mr-0",
                selectorButton: "text-muted",
              }}
              defaultItems={filterData}
              inputProps={{
                classNames: {
                  input: "ml-1 text-muted",
                  inputWrapper:
                    "rounded-[4px] border-none bg-background text-muted group-data-[focus=true]:bg-slate-800 group-data-[focus=true]:text-neutral-500 data-[hover=true]:bg-slate-900",
                },
              }}
              listboxProps={{
                hideSelectedIcon: true,
                itemClasses: {
                  base: [
                    "text-muted",
                    "transition-opacity",
                    "data-[hover=true]:bg-default-800",
                  ],
                },
              }}
              placeholder="Nhập mã CK"
              popoverProps={{
                classNames: {
                  base: "h-[400px]",
                  content: "p-1 bg-background",
                },
                placement: "bottom",
              }}
              startContent={
                <RoundedMagnifer className="text-muted" size={20} />
              }
              endContent={null}
              isClearable={false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleThemMaCK();
                }
              }}
              autoFocus
            >
              {(item: TSymbolOverviewData) => (
                <AutocompleteItem key={item.code} textValue={item.code}>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 flex-shrink-0 overflow-hidden rounded-full bg-white">
                        <img
                          src={`https://finance.vietstock.vn/image/${item.code}`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      {item.code}
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
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end gap-2">
            <Button color="muted" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button color="primary" onClick={handleThemMaCK}>
              Thêm
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
