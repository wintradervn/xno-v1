import Table from "../ui/Table";
import { cn, formatPrice } from "@/lib/utils";
import useDNSEOrders, { IOrder } from "@/hooks/dnse/useDNSEOrders";
import { format } from "date-fns";

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
    render: (item: IOrder) => <div>--</div>,
  },
  {
    key: "action",
    title: "",
    render: (item: IOrder) => <div>--</div>,
  },
];

export default function SoLenhThuong() {
  const { data } = useDNSEOrders();
  return (
    <div className="pt-2">
      <Table
        columns={columns}
        data={data}
        noDataText="Chưa có lệnh trong ngày"
      />
    </div>
  );
}
