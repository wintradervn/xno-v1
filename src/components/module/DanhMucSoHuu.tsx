import useDNSEDeals, { TDNSEDeal } from "@/hooks/dnse/useDNSEDeals";
import Table from "../ui/Table";
import {
  cn,
  formatNumber,
  formatPrice,
  getPriceColorFromOverviewData,
} from "@/lib/utils";
import Popover from "../ui/Popover";
import { PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Button from "../ui/Button";
import { AltArrowDown, RoundedMagnifer } from "solar-icon-set";
import Checkbox from "../ui/Checkbox";
import { useMemo, useState } from "react";
import Input from "../ui/Input";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useRightPanelState from "@/hooks/useRightPanelState";

const filterData = [
  { key: "OPEN, ODD_LOT", name: "Đang mở" },
  { key: "PENDING_CLOSE", name: "Chờ đóng" },
];

export default function DanhMucSoHuu() {
  const [filter, setFilter] = useState<string[]>([filterData[0].key]);
  const [symbolSearch, setSymbolSearch] = useState("");
  const [onlyBuy, setOnlyBuy] = useState(false);
  const [onlySell, setOnlySell] = useState(false);
  const { setCurrentSymbol } = useCurrentSymbol();
  const { data: deals } = useDNSEDeals();
  const { data: marketOverview } = useMarketOverviewData();

  const filteredDeals = useMemo(() => {
    return (
      deals?.filter(
        (item) =>
          item.symbol
            .toLocaleLowerCase()
            .includes(symbolSearch.toLocaleLowerCase()) &&
          ((onlyBuy && item.side === "NB") ||
            (onlySell && item.side === "NS") ||
            (!onlyBuy && !onlySell)) &&
          (!filter.length || filter.some((f) => f.includes(item.status))),
      ) || []
    );
  }, [deals, symbolSearch, onlySell, onlyBuy, filter]);

  const columns = useMemo(
    () => [
      {
        key: "symbol",
        title: "Mã",
        render: (item: TDNSEDeal) => {
          const symbolData = marketOverview?.find(
            (i) => i.code === item.symbol,
          );
          return (
            <div
              className={cn(
                "flex items-center gap-2",
                getPriceColorFromOverviewData(symbolData),
              )}
            >
              <div className="relative h-4 w-4 overflow-hidden rounded-full bg-white">
                <img
                  src={`https://finance.vietstock.vn/image/${item.symbol}`}
                  className="h-full w-full object-contain"
                />
              </div>
              {item.symbol}
            </div>
          );
        },
      },
      {
        key: "klmo",
        title: "KL mở",
        className: "text-right",
        render: (item: TDNSEDeal) => <div>{item.openQuantity}</div>,
      },
      {
        key: "duocgd",
        title: "Được GD",
        className: "text-right",
        render: (item: TDNSEDeal) => <div>{item.tradeQuantity}</div>,
      },
      {
        key: "giahoavon",
        title: "Giá hòa vốn",
        className: "text-right",
        render: (item: TDNSEDeal) => (
          <div className="text-linearpurple">
            {Math.round(item.breakEvenPrice).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </div>
        ),
      },
      {
        key: "giahientai",
        title: "Giá hiện tại",
        className: "text-right",
        render: (item: TDNSEDeal) => {
          const symbolData = marketOverview?.find(
            (i) => i.code === item.symbol,
          );
          return (
            <div className={getPriceColorFromOverviewData(symbolData)}>
              {formatPrice(item.marketPrice)}
            </div>
          );
        },
      },
      {
        key: "gthientai",
        title: "GT hiện tại",
        className: "text-right",
        render: (item: TDNSEDeal) => (
          <div>
            {Math.round(item.marketPrice * item.openQuantity).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 0,
              },
            )}
          </div>
        ),
      },
      {
        key: "tonglai",
        title: "Tổng lãi",
        className: "text-right",
        render: (item: TDNSEDeal) => {
          const value =
            item.unrealizedProfit -
            item.estimateRemainTaxAndFee -
            item.unrealizedOpenTaxAndFee -
            item.currentInterest;
          const color =
            value > 0 ? "text-green" : value < 0 ? "text-red" : "text-white";
          return (
            <div className={color}>
              {value
                ? Math.round(value).toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })
                : ""}
            </div>
          );
        },
      },
      {
        key: "%lai",
        title: "% lãi",
        className: "text-right",
        render: (item: TDNSEDeal) => {
          const value =
            (item.unrealizedProfit -
              item.estimateRemainTaxAndFee -
              item.unrealizedOpenTaxAndFee -
              item.currentInterest) /
            item.accumulateSecure;
          const color =
            value > 0 ? "text-green" : value < 0 ? "text-red" : "text-white";
          return (
            <div className={color}>
              {value
                ? (value * 100).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) + "%"
                : ""}
            </div>
          );
        },
      },
    ],
    [],
  );

  const summaryData: {
    vonThuc: number;
    vonVay: number;
    tongLaiLo: number;
    laiLoPercent: number;
  } = useMemo(() => {
    const result = { vonThuc: 0, vonVay: 0, tongLaiLo: 0, laiLoPercent: 0 };

    deals?.forEach((item) => {
      if (item.status !== "OPEN") return;
      result.vonThuc += item.accumulateSecure;
      result.vonVay += item.currentDebt;
      result.tongLaiLo +=
        item.unrealizedProfit -
        item.estimateRemainTaxAndFee -
        item.unrealizedOpenTaxAndFee -
        item.currentInterest;
      result.laiLoPercent = (result.tongLaiLo * 100) / result.vonThuc;
    });

    return result;
  }, [deals]);

  return (
    <div className="relative">
      <div className="mb-5 flex justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <div className="text-sm text-muted">Vốn thực:</div>
            <div className="text-md font-semibold">
              {formatNumber(summaryData.vonThuc)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-muted">Vốn vay:</div>
            <div className="text-md font-semibold">
              {formatNumber(summaryData.vonVay)}
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col",
              summaryData.tongLaiLo > 0
                ? "text-green"
                : summaryData.tongLaiLo < 0
                  ? "text-red"
                  : "text-white",
            )}
          >
            <div className="text-sm text-muted">Tổng lãi lỗ:</div>
            <div className="text-md font-semibold">
              {formatNumber(summaryData.tongLaiLo)} (
              {summaryData.laiLoPercent
                ? summaryData.laiLoPercent.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                : "-"}
              ) %
            </div>
          </div>
        </div>
        <div className="flex w-fit items-center gap-3">
          <Input
            placeholder="Tìm mã CK"
            value={symbolSearch}
            variant="bordered"
            onValueChange={setSymbolSearch}
            size="sm"
            classNames={{ base: "w-[140px]" }}
            startContent={<RoundedMagnifer size={16} />}
          />
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <Button
                className="h-[36px] w-fit min-w-fit rounded-[4px] bg-content1 px-4 py-3 text-sm text-white"
                color="default"
              >
                Trạng thái
                <AltArrowDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {filterData.map((item) => (
                <div
                  key={item.key}
                  className="flex w-full justify-start rounded-[4px] p-1 py-1 !text-xs data-[hover=true]:bg-default-600/40"
                >
                  <Checkbox
                    size="sm"
                    classNames={{
                      label: "text-sm pl-0",
                    }}
                    isSelected={filter.includes(item.key)}
                    onValueChange={(checked) => {
                      if (checked) setFilter([...filter, item.key]);
                      else setFilter(filter.filter((f) => f !== item.key));
                    }}
                  >
                    {item.name}
                  </Checkbox>
                </div>
              ))}
            </PopoverContent>
          </Popover>{" "}
          <Checkbox
            classNames={{ label: "text-sm text-green w-[50px]" }}
            checked={onlyBuy}
            onValueChange={setOnlyBuy}
          >
            Mua
          </Checkbox>
          <Checkbox
            classNames={{ label: "text-sm text-red w-[50px]" }}
            checked={onlySell}
            onValueChange={setOnlySell}
          >
            Bán
          </Checkbox>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredDeals}
        onRowClick={(item) => {
          setCurrentSymbol(item.symbol);
        }}
      />
    </div>
  );
}
