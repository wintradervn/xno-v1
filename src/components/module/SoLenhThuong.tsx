import Table from "../ui/Table";
import { cn, formatPrice } from "@/lib/utils";
import useDNSEOrders, { IOrder } from "@/hooks/dnse/useDNSEOrders";
import { format } from "date-fns";
import Button from "../ui/Button";
import { AltArrowDown, Copy, Pen, TrashBinTrash } from "solar-icon-set";
import ThongTinLaiLoTaiKhoan from "./ThongTinLaiLoTaiKhoan";
import { useCallback, useMemo, useState } from "react";
import Popover from "../ui/Popover";
import { PopoverContent, PopoverTrigger } from "@heroui/react";
import Checkbox from "../ui/Checkbox";
import { deleteOrder } from "@/lib/dnse-api";
import useTaiKhoanChungKhoan from "@/hooks/useTaiKhoanChungKhoan";

const mapStatusLabel: Record<string, string> = {
  Filled: "Đã khớp",
  New: "Chờ khớp",
  Canceled: "Đã hủy",
};

const mapStatusColor: Record<string, string> = {
  Filled: "text-green",
  New: "text-white",
  Canceled: "text-red",
};

export default function SoLenhThuong() {
  const { data } = useDNSEOrders();
  const { jwtToken, tradingToken } = useTaiKhoanChungKhoan();

  const [onlyBuy, setOnlyBuy] = useState(false);
  const [onlySell, setOnlySell] = useState(false);
  const [filter, setFilter] = useState<string[]>([]);
  const filteredOrders = useMemo(() => {
    return (
      data?.filter(
        (item) =>
          ((onlyBuy && item.side === "NB") ||
            (onlySell && item.side === "NS") ||
            (!onlyBuy && !onlySell)) &&
          (!filter.length || filter.some((f) => f.includes(item.orderStatus))),
      ) || []
    );
  }, [data, onlySell, onlyBuy, filter]);

  const handleDeleteOrder = useCallback(
    (id: number, accountNo: string) => {
      deleteOrder(jwtToken, tradingToken, id, accountNo);
    },
    [tradingToken, jwtToken],
  );

  const columns = useMemo(
    () => [
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
          <div className={mapStatusColor[item.orderStatus]}>
            {mapStatusLabel[item.orderStatus] || item.orderStatus}
          </div>
        ),
      },
      {
        key: "action",
        title: "",
        render: (item: IOrder) => (
          <div className="flex justify-end gap-2">
            <div className="w-[60px]">
              <Button
                isIconOnly
                className="text-muted hover:text-foreground h-6 w-6 min-w-6 rounded-full bg-transparent p-1"
              >
                <Copy />
              </Button>
              <Button
                isIconOnly
                className="text-muted hover:text-foreground h-6 w-6 min-w-6 rounded-full bg-transparent p-1"
              >
                <Pen />
              </Button>
              {item.orderStatus === "New" && (
                <Button
                  isIconOnly
                  className="text-muted hover:text-red h-6 w-6 min-w-6 rounded-full bg-transparent p-1"
                  onClick={() => handleDeleteOrder(item.id, item.accountNo)}
                >
                  <TrashBinTrash />
                </Button>
              )}
            </div>
          </div>
        ),
      },
    ],
    [handleDeleteOrder],
  );

  return (
    <div className="relative">
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
                  className="data-[hover=true]:bg-default-600/40 flex w-full justify-start rounded-[4px] p-1 py-1 text-xs!"
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
