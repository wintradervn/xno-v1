import useDNSELoanPackages, {
  IDNSELoanPackage,
  IDNSELoanProduct,
} from "@/hooks/dnse/useDNSELoanPackages";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useSelectedGoiVayStore from "@/hooks/useSelectedGoiVay";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { DoubleAltArrowDown } from "solar-icon-set";
import Button from "../../ui/Button";
import Dropdown, { DropdownItem } from "../../ui/Dropdown";
import { DropdownMenu, DropdownTrigger } from "@heroui/react";
import BulkStar from "@/icons/BulkStar";
import useTheme from "@/hooks/useTheme";

function GoiVayItem({
  item,
  currentSymbol,
  selected,
  onClick,
}: {
  item: IDNSELoanPackage & { loanProduct: IDNSELoanProduct };
  currentSymbol: string;
  selected: boolean;
  onClick?: () => void;
}) {
  const loanProduct = item.loanProducts?.find(
    (item) => item.symbol === currentSymbol,
  );
  if (!loanProduct) return null;

  return (
    <Button
      className={cn(
        "bg-card flex h-fit w-fit flex-1 flex-col gap-1 rounded-[12px] border-2 p-2 shadow-none",
        selected ? "border-[#67E1C0]" : "",
      )}
      onPress={onClick}
    >
      <div className="flex w-full gap-3">
        <div className="flex flex-col items-start">
          <div className="text-sm font-semibold">{item.name}</div>
          <div className="flex items-center gap-2">
            <div className="text-muted text-xs font-semibold">
              Vay:{" "}
              {item.loanProduct?.initialRate
                ? ((1 - item.loanProduct.initialRate) * 100).toFixed(0) + "%"
                : "Miễn phí"}
            </div>
            <div className="text-muted text-xs font-semibold">
              Phí:{" "}
              {item.brokerFirmBuyingFeeRate
                ? item.brokerFirmBuyingFeeRate * 100 + "%"
                : "Miễn phí"}
            </div>
          </div>
        </div>
      </div>
    </Button>
  );
}
export default function ChonGoiVay() {
  const { data } = useDNSELoanPackages();
  const [forceRender, setForceRender] = useState(0);
  const { currentSymbol } = useCurrentSymbol();
  const { selectedGoiVay, setSelectedGoiVay } = useSelectedGoiVayStore();
  const { isDarkMode } = useTheme();

  const loanProducts = useMemo(() => {
    if (!data) return [];
    return data
      .map((item) => ({
        ...item,
        loanProduct: item.loanProducts?.find(
          (item) => item.symbol.toLowerCase() === currentSymbol.toLowerCase(),
        ),
      }))
      .filter((item) => !!item.loanProduct)
      .sort((a, b) =>
        a.loanProduct && b.loanProduct
          ? a?.loanProduct.interestRate - b?.loanProduct.interestRate
          : 0,
      );
  }, [data, currentSymbol]);

  const noLoanProduct = loanProducts?.length === 0;

  const compiledData: any = useMemo(() => {
    if (!loanProducts?.length) return [];
    return [
      loanProducts.find((item) => item.id === selectedGoiVay),
      loanProducts.filter((item) => item.id !== +selectedGoiVay)[0],
    ].filter(Boolean);
  }, [loanProducts, selectedGoiVay]);

  if (noLoanProduct) return null;
  return (
    <div className="flex items-center gap-2">
      {compiledData.map((item: any) => (
        <GoiVayItem
          key={item.id}
          item={item}
          currentSymbol={currentSymbol}
          selected={item.id === selectedGoiVay}
          onClick={() => setSelectedGoiVay(item.id)}
        />
      ))}
      <div>
        <Dropdown
          placement="bottom-end"
          classNames={{
            content: "bg-white dark:bg-background shadow-md rounded-[8px]",
          }}
        >
          <DropdownTrigger className="cursor-pointer">
            <DoubleAltArrowDown />
          </DropdownTrigger>
          <DropdownMenu>
            {loanProducts ? (
              <>
                <DropdownItem
                  className={cn(
                    "data-[hover=true]:bg-light-surface-sub! data-[hover=true]:dark:bg-default-800! flex flex-row! items-center justify-between gap-4 rounded-[8px] border-[1.5px] p-2",
                    1775 === selectedGoiVay
                      ? "border-[#67E1C0]"
                      : "border-border",
                  )}
                  onClick={() => setSelectedGoiVay(1775)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-1 flex-col gap-1">
                      <div>Rocketx</div>
                      <div className="text-muted flex gap-2 text-sm">
                        <div>
                          Tiền mặt: <span className="text-white">100%</span>
                        </div>
                        <div>
                          Vay: <span className="text-white">0%</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-lineargreen dark:bg-background/80 h-fit rounded-full bg-white px-2 py-1 text-sm font-semibold shadow-sm"
                      style={{
                        boxShadow: isDarkMode
                          ? "2px 2px 4px 0px rgba(130, 151, 177, 0.10), -2px -2px 8px 0px #181819, 2px 2px 8px 0px rgba(111, 140, 176, 0.20)"
                          : "",
                      }}
                    >
                      Miễn phí
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem
                  isReadOnly
                  isDisabled
                  className="mb-2 opacity-100"
                >
                  <div className="text-lineargreen text-md relative flex w-full items-center justify-center pb-2 font-semibold">
                    Gói vay{" "}
                    <div className="bg-lineargreen absolute bottom-0 h-[1px] w-full"></div>
                    <div className="bg-background absolute -bottom-1 flex h-[8px] w-[20px] items-center justify-center">
                      <div className="bg-lineargreen h-[6px] w-[6px] rotate-45"></div>
                    </div>
                  </div>
                </DropdownItem>
                {loanProducts
                  .filter((item) => item.id !== 1775)
                  .map((item, index) => (
                    <DropdownItem
                      key={item.id}
                      className={cn(
                        "data-[hover=true]:bg-light-surface-sub! data-[hover=true]:dark:bg-default-800! mb-2 flex flex-row! items-center justify-between gap-4 rounded-[8px] border-[1.5px] p-2",
                        item.id === selectedGoiVay
                          ? "border-[#67E1C0]"
                          : "border-border",
                      )}
                      onClick={() => {
                        setSelectedGoiVay(item.id);
                        setForceRender(forceRender + 1);
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-1 flex-col gap-1">
                          <div>{item.name}</div>
                          <div className="text-muted flex gap-2 text-sm">
                            <div>
                              Tiền mặt:{" "}
                              <span className="text-white">
                                {(item.loanProduct?.initialRate || 0) * 100}%
                              </span>
                            </div>
                            <div>
                              Vay:{" "}
                              <span className="text-white">
                                {(
                                  (1 - (item.loanProduct?.initialRate || 0)) *
                                  100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                          </div>
                          {index === 0 && (
                            <div className="relative overflow-hidden rounded-full bg-[#FEEFC6] px-2 py-0.5 pl-8 text-xs font-semibold text-[#792E0D]">
                              <div className="absolute top-[-6px] -left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#FEDF89] text-[#F79009]">
                                <BulkStar />
                              </div>
                              Lãi suất ưu đãi nhất
                            </div>
                          )}
                        </div>
                        <div
                          className="text-lineargreen dark:bg-background/80 h-fit rounded-full bg-white px-2 py-1 text-sm font-semibold shadow-sm"
                          style={{
                            boxShadow: isDarkMode
                              ? "2px 2px 4px 0px rgba(130, 151, 177, 0.10), -2px -2px 8px 0px #181819, 2px 2px 8px 0px rgba(111, 140, 176, 0.20)"
                              : "",
                          }}
                        >
                          {item.brokerFirmBuyingFeeRate ? (
                            <>
                              <span className="text-muted font-normal">
                                Phí:
                              </span>{" "}
                              {item.brokerFirmBuyingFeeRate * 100 + "%"}
                            </>
                          ) : (
                            "Miễn phí"
                          )}
                        </div>
                      </div>
                    </DropdownItem>
                  ))}
              </>
            ) : (
              <></>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
