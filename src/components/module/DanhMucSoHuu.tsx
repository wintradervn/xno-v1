import useDNSEDeals, { TDNSEDeal } from "@/hooks/dnse/useDNSEDeals";
import Table from "../ui/Table";
import {
  cn,
  formatNumber,
  formatPrice,
  getPriceColorFromOverviewData,
} from "@/lib/utils";
import Popover from "../ui/Popover";
import { PopoverContent, PopoverTrigger } from "@heroui/react";
import Button from "../ui/Button";
import { AltArrowDown, RoundedMagnifer } from "solar-icon-set";
import Checkbox from "../ui/Checkbox";
import { useMemo, useState } from "react";
import Input from "../ui/Input";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import ThongTinLaiLoTaiKhoan from "./ThongTinLaiLoTaiKhoan";
import SymbolIcon from "../SymbolIcon";

const filterData = [
  { key: "OPEN, ODD_LOT", name: "Đang mở" },
  { key: "PENDING_CLOSE", name: "Chờ đóng" },
];

export default function DanhMucSoHuu() {
  const [filter, setFilter] = useState<string[]>([]);

  const { setCurrentSymbol } = useCurrentSymbol();
  const { data: deals } = useDNSEDeals();
  const { data: marketOverview } = useMarketOverviewData();

  const filteredDeals = useMemo(() => {
    return (
      deals?.filter(
        (item) => !filter.length || filter.some((f) => f.includes(item.status)),
      ) || []
    );
  }, [deals, filter]);

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
              <SymbolIcon symbol={item.symbol} />
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

  return (
    <div className="relative">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <ThongTinLaiLoTaiKhoan />
        <div className="flex w-fit items-center gap-3">
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <Button
                className="bg-linearpurple dark:bg-content1 h-[32px] w-fit min-w-fit rounded-[4px] px-3 py-2 text-sm text-white"
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
                  className="data-[hover=true]:bg-default-600/40 flex w-full justify-start rounded-[4px] p-1 py-1 text-xs!"
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
