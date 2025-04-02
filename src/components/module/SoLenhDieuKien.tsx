import { TDNSEDeal } from "@/hooks/dnse/useDNSEDeals";
import Table from "../ui/Table";
import { cn, formatPrice } from "@/lib/utils";
import { useState } from "react";
import ThongTinLaiLoTaiKhoan from "./ThongTinLaiLoTaiKhoan";
import Input from "../ui/Input";
import { AltArrowDown, RoundedMagnifer } from "solar-icon-set";
import Popover from "../ui/Popover";
import { PopoverContent, PopoverTrigger } from "@heroui/react";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";

const mapStatusLabel: Record<string, string> = {
  Filled: "Đã khớp",
  New: "Mới",
  Canceled: "Đã hủy",
};

const mapStatusColor: Record<string, string> = {
  Filled: "text-green",
  New: "text-white",
  Canceled: "text-red",
};

const columns = [
  {
    key: "symbol",
    title: "Mã",
    render: (item: TDNSEDeal) => <div>{item.symbol}</div>,
  },
  {
    key: "klmo",
    title: "KL mở",
    render: (item: TDNSEDeal) => <div>{item.openQuantity}</div>,
  },
  {
    key: "duocgd",
    title: "Được GD",
    render: (item: TDNSEDeal) => <div>0</div>,
  },
  {
    key: "giahoavon",
    title: "Giá hòa vốn",
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
    render: (item: TDNSEDeal) => <div>{formatPrice(item.marketPrice)}</div>,
  },
  {
    key: "gthientai",
    title: "GT hiện tại",
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
    render: (item: TDNSEDeal) => {
      const value =
        (item.marketPrice - item.breakEvenPrice) * item.openQuantity;
      const color = value > 0 ? "text-green" : "text-red";
      return (
        <div className={color}>
          {Math.round(
            item.unrealizedProfit -
              item.estimateRemainTaxAndFee -
              item.unrealizedOpenTaxAndFee,
          ).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}
        </div>
      );
    },
  },
  {
    key: "%lai",
    title: "% lãi",
    render: (item: TDNSEDeal) => {
      const value =
        (item.marketPrice - item.breakEvenPrice) / item.breakEvenPrice;
      const color = value > 0 ? "text-green" : "text-red";
      return (
        <div className={color}>
          {(value * 100).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          %
        </div>
      );
    },
  },
];
const filterData = [
  { key: "chogui", name: "Chờ gửi" },
  { key: "chokhop", name: "Chờ khớp" },
  { key: "dakhop", name: "Đã khớp" },
  { key: "dangkhop", name: "Đang khớp" },
  { key: "dahuy", name: "Đã hủy" },
  { key: "tuchoi", name: "Từ chối" },
  { key: "hethieuluc", name: "Hết hiệu lực" },
  { key: "chohuy", name: "Chờ hủy" },
];

export default function SoLenhDieuKien() {
  const [onlyBuy, setOnlyBuy] = useState(false);
  const [onlySell, setOnlySell] = useState(false);
  const [filter, setFilter] = useState<string[]>([]);

  return (
    <div className="">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <ThongTinLaiLoTaiKhoan />
        <div className="flex w-fit items-center gap-3">
          <Button className="bg-red/20 border-red dark:bg-content1 h-[32px] w-fit min-w-fit rounded-[4px] border-1 px-3 py-2 text-sm text-white">
            Hủy tất cả
          </Button>
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
              {Object.entries(mapStatusLabel).map(([key, name]) => (
                <div
                  key={key}
                  className={cn(
                    "data-[hover=true]:bg-default-600/40 flex w-full justify-start rounded-[4px] p-1 py-1 text-xs!",
                  )}
                >
                  <Checkbox
                    size="sm"
                    classNames={{
                      label: "text-sm pl-0",
                    }}
                    isSelected={filter.includes(key)}
                    onValueChange={(checked) => {
                      if (checked) setFilter([...filter, key]);
                      else setFilter(filter.filter((f) => f !== key));
                    }}
                  >
                    {name}
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
      <Table columns={columns} data={[]} noDataText="Chưa có lệnh trong ngày" />
    </div>
  );
}
