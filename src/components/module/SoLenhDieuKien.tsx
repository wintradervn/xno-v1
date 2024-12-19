import useDNSEDeals, { TDNSEDeal } from "@/hooks/dnse/useDNSEDeals";
import Table from "../ui/Table";
import { formatPrice } from "@/lib/utils";

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
  return (
    <div className="pt-2">
      <Table columns={columns} data={[]} noDataText="Chưa có lệnh trong ngày" />
    </div>
  );
}
