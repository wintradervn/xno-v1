import Table from "../ui/Table";
import { cn, formatPrice } from "@/lib/utils";
import useDNSEOrders, { IOrder } from "@/hooks/dnse/useDNSEOrders";
import { format } from "date-fns";
import Button from "../ui/Button";
import {
  AltArrowDown,
  Copy,
  Pen,
  RoundedMagnifer,
  TrashBinTrash,
} from "solar-icon-set";
import ThongTinLaiLoTaiKhoan from "./ThongTinLaiLoTaiKhoan";
import Input from "../ui/Input";
import { useMemo, useState } from "react";
import useDNSEDeals from "@/hooks/dnse/useDNSEDeals";
import Popover from "../ui/Popover";
import { PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Checkbox from "../ui/Checkbox";

const mapStatusLabel: Record<string, string> = {
  Filled: "Đã khớp",
  New: "Mới",
  Canceled: "Đã hủy",
};

const columns = [
  {
    key: "symbol",
    title: "Mã",
    render: (item: IOrder) => (
      <div className="flex items-center gap-2">
        <div className="relative h-4 w-4 overflow-hidden rounded-full bg-white">
          <img
            src={`https://finance.vietstock.vn/image/${item.symbol}`}
            className="h-full w-full object-contain"
          />
        </div>
        {item.symbol}
      </div>
    ),
  },
  {
    key: "lenh",
    title: "Lệnh",
    render: (item: IOrder) => (
      <div className={item.side === "NB" ? "text-green" : "text-red"}>
        {item.side === "NB" ? "Mua" : "Bán"}
      </div>
    ),
  },
  {
    key: "thoigian",
    title: "Thời gian",
    render: (item: IOrder) => (
      <div>{format(item.createdDate, "dd/MM/yyyy hh:mm")}</div>
    ),
  },
  {
    key: "giadat",
    title: "Giá đặt",
    render: (item: IOrder) => <div>{formatPrice(item.priceSecure)}</div>,
  },
  {
    key: "giakhop",
    title: "Giá khớp",
    render: (item: IOrder) => <div>{formatPrice(item.lastPrice)}</div>,
  },
  {
    key: "khoiluong",
    title: "Khối lượng",
    render: (item: IOrder) => (
      <div
        className={cn(
          item.fillQuantity === item.quantity ? "text-green" : "text-muted",
        )}
      >{`${item.fillQuantity}/${item.quantity}`}</div>
    ),
  },
  {
    key: "trangthai",
    title: "Trạng thái",
    render: (item: IOrder) => (
      <div>{mapStatusLabel[item.orderStatus] || item.orderStatus}</div>
    ),
  },
  {
    key: "action",
    title: "",
    render: (item: IOrder) => (
      <div className="flex justify-end gap-2">
        <Button
          isIconOnly
          className="h-6 w-6 min-w-6 rounded-full bg-transparent p-1 text-muted hover:text-white"
        >
          <Copy />
        </Button>
        <Button
          isIconOnly
          className="h-6 w-6 min-w-6 rounded-full bg-transparent p-1 text-muted hover:text-white"
        >
          <Pen />
        </Button>
        <Button
          isIconOnly
          className="h-6 w-6 min-w-6 rounded-full bg-transparent p-1 text-muted hover:text-red"
        >
          <TrashBinTrash />
        </Button>
      </div>
    ),
  },
];

export default function SoLenhThuong() {
  const { data } = useDNSEOrders();
  const [onlyBuy, setOnlyBuy] = useState(false);
  const [onlySell, setOnlySell] = useState(false);
  const [filter, setFilter] = useState<string[]>([]);
  const [symbolSearch, setSymbolSearch] = useState("");
  const filteredOrders = useMemo(() => {
    return (
      data?.filter(
        (item) =>
          item.symbol
            .toLocaleLowerCase()
            .includes(symbolSearch.toLocaleLowerCase()) &&
          ((onlyBuy && item.side === "NB") ||
            (onlySell && item.side === "NS") ||
            (!onlyBuy && !onlySell)) &&
          (!filter.length || filter.some((f) => f.includes(item.orderStatus))),
      ) || []
    );
  }, [data, symbolSearch, onlySell, onlyBuy, filter]);

  return (
    <div className="">
      <div className="mb-5 flex justify-between">
        <ThongTinLaiLoTaiKhoan />
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
              {Object.entries(mapStatusLabel).map(([key, name]) => (
                <div
                  key={key}
                  className="flex w-full justify-start rounded-[4px] p-1 py-1 !text-xs data-[hover=true]:bg-default-600/40"
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
      <Table
        columns={columns}
        data={filteredOrders}
        noDataText="Chưa có lệnh trong ngày"
      />
    </div>
  );
}
