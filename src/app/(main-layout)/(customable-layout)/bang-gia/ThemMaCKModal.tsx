"use client";
import Button from "@/components/ui/Button";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import useMucQuanTam from "@/hooks/useMucQuanTam";
import useTheme from "@/hooks/useTheme";
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
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { RoundedMagnifer } from "solar-icon-set";

export default function ThemMaCKModal({
  isOpen,
  ignoreSymbols,
  onAdd,
  onClose,
}: {
  isOpen: boolean;
  ignoreSymbols?: string[];
  onAdd: (symbols: string[]) => void;
  onClose: () => void;
}) {
  const [nameString, setNameString] = useState<string>("");
  const [selectedSymbol, setSelectedSymbol] = useState<string[]>([]);
  const { data, isLoading } = useMarketOverviewData();
  const { isLightMode } = useTheme();

  const filterData = useMemo(
    () =>
      data
        ?.filter(
          (item) =>
            (nameString
              ? item.code.toLowerCase().includes(nameString.toLocaleLowerCase())
              : true) &&
            item.secType === "S" &&
            (!ignoreSymbols || !ignoreSymbols.includes(item.code)) &&
            !selectedSymbol.includes(item.code),
        )
        .sort((a: any, b: any) => (a.volume > b.volume ? -1 : 1))
        .sort((a, b) => {
          if (!nameString) return 0;
          const startsWithA = a.code
            .toLowerCase()
            .startsWith(nameString?.toLowerCase());
          const startsWithB = b.code
            .toLowerCase()
            .startsWith(nameString?.toLowerCase());

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
    [data, nameString, ignoreSymbols, selectedSymbol],
  );

  const handleThemMaCK = () => {
    if (selectedSymbol.length) {
      onAdd(selectedSymbol);
      onClose();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setNameString("");
      setSelectedSymbol([]);
    }, 1000);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      className="dark:bg-card bg-white shadow-lg"
      classNames={{
        base: "rounded-[8px]",
        closeButton: "hover:dark:bg-neutral-700 active:dark:bg-neutral-600",
      }}
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          <div className="text-caption text-lineargreen flex w-full items-center justify-center">
            Thêm mã chứng khoán
          </div>
        </ModalHeader>
        <ModalBody className="px-5 py-1">
          <div className="text-muted text-sm">Tên Mã CK</div>

          {isLoading ? null : (
            <Autocomplete
              inputValue={nameString}
              onInputChange={setNameString}
              items={filterData}
              // selectedKey={selectedSymbol}
              onSelectionChange={(item) => {
                setSelectedSymbol((prev) => [...prev, item as string]);
                setNameString(item as string);
              }}
              maxListboxHeight={260}
              classNames={{
                endContentWrapper: "mr-0",
                selectorButton: "text-muted",
              }}
              inputProps={{
                variant: "bordered",
                classNames: {
                  input: "ml-1 text-foreground",
                  inputWrapper:
                    "rounded-[8px] border-1 border-border shadow-none bg-white dark:bg-background text-muted dark:group-data-[focus=true]:bg-slate-800 dark:group-data-[focus=true]:text-neutral-500 dark:data-[hover=true]:bg-slate-900",
                },
              }}
              placeholder="Nhập mã CK"
              listboxProps={{
                hideSelectedIcon: true,
                emptyContent: "Không tìm thấy mã chứng khoán",
                itemClasses: {
                  base: [
                    "text-foreground",
                    "transition-opacity",
                    "data-[hover=true]:bg-light-surface-sub data-[hover=true]:dark:bg-default-800 h-10",
                  ],
                },
              }}
              popoverProps={{
                classNames: {
                  base: "",
                  content:
                    "p-1 bg-white dark:bg-background! shadow-md rounded-[6px]",
                },
                placement: "bottom",
              }}
              startContent={
                <RoundedMagnifer className="text-muted" size={20} />
              }
              endContent={null}
              isClearable={false}
              autoFocus
            >
              {(item: TSymbolOverviewData) => (
                <AutocompleteItem key={item.code} textValue={item.code}>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white">
                        <img
                          src={`https://finance.vietstock.vn/image/${item.code}`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      {item.code}
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-end",
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
          {selectedSymbol.length ? (
            <div className="flex gap-2">
              {selectedSymbol.map((symbol) => {
                return (
                  <div
                    className="flex h-8 items-center gap-1.5 rounded-full bg-[#7B61FF33] py-2 pr-2 pl-2.5 text-sm font-medium"
                    key={symbol}
                  >
                    <div>{symbol}</div>
                    <div
                      className={cn(
                        "cursor-pointer",
                        isLightMode
                          ? "[&_path]:fill-[#200B6A] hover:[&_path]:fill-black"
                          : "hover:[&_path]:fill-white",
                      )}
                      onClick={() =>
                        setSelectedSymbol((prev) =>
                          prev.filter((item) => item !== symbol),
                        )
                      }
                    >
                      <CloseCircle />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end gap-2">
            <Button color="muted" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button
              color="primary"
              onClick={handleThemMaCK}
              isDisabled={selectedSymbol.length === 0}
            >
              Thêm mã
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function CloseCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.6654 7.50065C13.6654 11.1825 10.6806 14.1673 6.9987 14.1673C3.3168 14.1673 0.332031 11.1825 0.332031 7.50065C0.332031 3.81875 3.3168 0.833984 6.9987 0.833984C10.6806 0.833984 13.6654 3.81875 13.6654 7.50065ZM4.97845 5.48042C5.17371 5.28516 5.49029 5.28516 5.68556 5.48042L6.99868 6.79354L8.31178 5.48043C8.50705 5.28517 8.82363 5.28517 9.01889 5.48043C9.21415 5.67569 9.21415 5.99228 9.01889 6.18754L7.70578 7.50064L9.01888 8.81374C9.21414 9.009 9.21414 9.32558 9.01888 9.52085C8.82361 9.71611 8.50703 9.71611 8.31177 9.52085L6.99868 8.20775L5.68557 9.52086C5.49031 9.71612 5.17373 9.71612 4.97846 9.52086C4.7832 9.3256 4.7832 9.00901 4.97846 8.81375L6.29157 7.50064L4.97845 6.18752C4.78319 5.99226 4.78319 5.67568 4.97845 5.48042Z"
        fill="url(#paint0_linear_33008_157384)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_33008_157384"
          x1="0.332031"
          y1="0.833984"
          x2="19.7057"
          y2="21.0528"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E9E8FF" />
          <stop offset="1" stopColor="#B7B1FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
