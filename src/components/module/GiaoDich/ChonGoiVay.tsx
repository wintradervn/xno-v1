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
import { DropdownMenu, DropdownTrigger } from "@nextui-org/react";

const BulkStar = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.2619 3.47301L11.2019 5.35301C11.3286 5.61301 11.6686 5.85967 11.9552 5.91301L13.6553 6.19301C14.7419 6.37301 14.9953 7.15967 14.2153 7.94634L12.8886 9.27301C12.6686 9.49301 12.5419 9.92634 12.6153 10.2397L12.9952 11.8797C13.2952 13.173 12.6019 13.6797 11.4619 12.9997L9.86858 12.053C9.58191 11.8797 9.10192 11.8797 8.81525 12.053L7.22191 12.9997C6.08191 13.673 5.38859 13.173 5.68859 11.8797L6.06859 10.2397C6.14192 9.93301 6.01526 9.49968 5.79526 9.27301L4.46859 7.94634C3.68859 7.16634 3.94193 6.37968 5.02859 6.19301L6.72858 5.91301C7.01525 5.86634 7.35525 5.61301 7.48192 5.35301L8.42192 3.47301C8.92192 2.45301 9.7486 2.45301 10.2619 3.47301Z"
      fill="#F79009"
    />
    <path
      opacity="0.4"
      d="M5.33594 3.83301H1.33594C1.0626 3.83301 0.835938 3.60634 0.835938 3.33301C0.835938 3.05967 1.0626 2.83301 1.33594 2.83301H5.33594C5.60927 2.83301 5.83594 3.05967 5.83594 3.33301C5.83594 3.60634 5.60927 3.83301 5.33594 3.83301Z"
      fill="#F79009"
    />
    <path
      opacity="0.4"
      d="M3.33594 13.167H1.33594C1.0626 13.167 0.835938 12.9403 0.835938 12.667C0.835938 12.3937 1.0626 12.167 1.33594 12.167H3.33594C3.60927 12.167 3.83594 12.3937 3.83594 12.667C3.83594 12.9403 3.60927 13.167 3.33594 13.167Z"
      fill="#F79009"
    />
    <path
      opacity="0.4"
      d="M2.0026 8.5H1.33594C1.0626 8.5 0.835938 8.27333 0.835938 8C0.835938 7.72667 1.0626 7.5 1.33594 7.5H2.0026C2.27594 7.5 2.5026 7.72667 2.5026 8C2.5026 8.27333 2.27594 8.5 2.0026 8.5Z"
      fill="#F79009"
    />
  </svg>
);
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
        "flex h-fit w-fit flex-1 flex-col gap-1 rounded-[12px] border-2 border-neutral-800 bg-card p-2 shadow-md",
        selected ? "border-[#67E1C0]" : "",
      )}
      onPress={onClick}
    >
      <div className="flex w-full gap-3">
        <div className="flex flex-col items-start">
          <div className="text-sm font-semibold">{item.name}</div>
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-muted">
              Vay:{" "}
              {item.loanProduct?.initialRate
                ? ((1 - item.loanProduct.initialRate) * 100).toFixed(0) + "%"
                : "Miễn phí"}
            </div>
            <div className="text-xs font-semibold text-muted">
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

  if (noLoanProduct)
    return (
      // <div className="flex w-fit gap-2 rounded-[8px] border-1 border-[#67E1C0] p-2 py-2 text-sm">
      //   <div>Tiền mặt 100%</div> <div>Vay 0 %</div>{" "}
      //   <div className="text-green">Miễn phí</div>
      // </div>
      null
    );
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
        <Dropdown placement="bottom-end">
          <DropdownTrigger className="cursor-pointer">
            <DoubleAltArrowDown />
          </DropdownTrigger>
          <DropdownMenu>
            {loanProducts ? (
              <>
                <DropdownItem
                  className={cn(
                    "flex !flex-row items-center justify-between gap-4 rounded-[8px] border-1.5 border-neutral-800 p-2 shadow-md",
                    1775 === selectedGoiVay ? "border-[#67E1C0]" : "",
                  )}
                  onClick={() => setSelectedGoiVay(1775)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-1 flex-col gap-1">
                      <div>Rocketx</div>
                      <div className="flex gap-2 text-sm text-muted">
                        <div>
                          Tiền mặt: <span className="text-white">100%</span>
                        </div>
                        <div>
                          Vay: <span className="text-white">0%</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-lineargreen h-fit rounded-full bg-background/80 px-2 py-1 text-sm font-semibold"
                      style={{
                        boxShadow:
                          "2px 2px 4px 0px rgba(130, 151, 177, 0.10), -2px -2px 8px 0px #181819, 2px 2px 8px 0px rgba(111, 140, 176, 0.20)",
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
                  <div className="text-lineargreen relative flex w-full items-center justify-center pb-2 text-md font-semibold">
                    Gói vay{" "}
                    <div className="bg-lineargreen absolute bottom-0 h-[1px] w-full"></div>
                    <div className="absolute -bottom-1 flex h-[8px] w-[20px] items-center justify-center bg-background">
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
                        "mb-2 flex !flex-row items-center justify-between gap-4 rounded-[8px] border-1.5 border-neutral-800 p-2 shadow-md",
                        item.id === selectedGoiVay ? "border-[#67E1C0]" : "",
                      )}
                      onClick={() => {
                        setSelectedGoiVay(item.id);
                        setForceRender(forceRender + 1);
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-1 flex-col gap-1">
                          <div>{item.name}</div>
                          <div className="flex gap-2 text-sm text-muted">
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
                              <div className="absolute -left-1 top-[-6px] flex h-8 w-8 items-center justify-center rounded-full bg-[#FEDF89]">
                                <BulkStar />
                              </div>
                              Lãi suất ưu đãi nhất
                            </div>
                          )}
                        </div>
                        <div
                          className="text-lineargreen h-fit rounded-full bg-background/80 px-2 py-1 text-sm font-semibold"
                          style={{
                            boxShadow:
                              "2px 2px 4px 0px rgba(130, 151, 177, 0.10), -2px -2px 8px 0px #181819, 2px 2px 8px 0px rgba(111, 140, 176, 0.20)",
                          }}
                        >
                          {item.brokerFirmBuyingFeeRate ? (
                            <>
                              <span className="font-normal text-muted">
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
