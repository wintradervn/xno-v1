"use client";
import Tabs from "@/components/ui/Tabs";
import { Accordion, AccordionItem, Tab } from "@nextui-org/react";
import { ScrollArea } from "../ui/scroll-area";
import Button from "../ui/Button";
import useChiTietDanhMucModal from "@/hooks/useChiTietDanhMucModal";
import useDNSEAccountBalances from "@/hooks/dnse/useDNSEAccountBalances";
import {
  cn,
  formatNumber,
  formatPrice,
  getPriceColorFromOverviewData,
} from "@/lib/utils";
import useDNSEDeals, { TDNSEDeal } from "@/hooks/dnse/useDNSEDeals";
import Table from "../ui/Table";
import { useMemo } from "react";
import useMarketOverviewData from "@/hooks/useMarketOverview";

function TaiSan() {
  return (
    <div className="flex h-full w-full flex-col">
      <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          tabList: "gap-0.5",
          tab: "px-1 py-0 text-sm font-semibold text-cyan-400",
          panel: "flex-1 overflow-hidden pb-0",
          cursor: "w-full",
          tabContent: "group-data-[selected=true]:!text-lineargreen",
        }}
        defaultSelectedKey={"taisan"}
      >
        <Tab key="taisan" title="Tài sản">
          <TabTaiSan />
        </Tab>
        <Tab key="cophieu" title="Cổ phiếu">
          <TabCoPhieu />
        </Tab>
        <Tab key="phaisinh" title="Phái sinh">
          <div className="flex h-full flex-col">
            <div className="mb-1 grid grid-cols-5 text-sm">
              <div className="font-semibold text-muted">Mã CK</div>
              <div className="text-end font-semibold text-muted">Giá vốn</div>
              <div className="text-end font-semibold text-muted">+/- (%)</div>
              <div className="text-end font-semibold text-muted">Lãi/Lỗ</div>
              <div className="text-end font-semibold text-muted">KLGD</div>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              <div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">DGW</div>
                  <div className="text-end font-semibold">47.1</div>
                  <div className="text-end font-semibold text-red">-7.01%</div>
                  <div className="text-end font-semibold text-red">
                    -7.250.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
                <div className="grid grid-cols-5 py-1 text-sm">
                  <div className="font-semibold">TCB</div>
                  <div className="text-end font-semibold">24.05</div>
                  <div className="text-end font-semibold text-green">+0.83</div>
                  <div className="text-end font-semibold text-green">
                    +200.000đ
                  </div>
                  <div className="text-end font-semibold">141.942</div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

function TabTaiSan() {
  const { data } = useDNSEAccountBalances();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between rounded-[8px] bg-content1 p-2">
        <div className="text-sm font-semibold text-muted">Tài sản ròng</div>
        <div className="text-sm font-semibold text-white">
          {formatNumber(data?.netAssetValue)}
        </div>
      </div>
      <Accordion className="!px-0">
        <AccordionItem
          title={
            <div className="flex justify-between rounded-[8px] bg-content1 p-2">
              <div className="text-sm font-semibold text-muted">Tiền</div>
              <div className="text-sm font-semibold text-white">
                {formatNumber(data?.totalCash)}
              </div>
            </div>
          }
          hideIndicator
          className="!px-0"
          classNames={{ trigger: "p-0", base: "px-0" }}
        ></AccordionItem>
      </Accordion>
      <div className="flex justify-between rounded-[8px] bg-content1 p-2">
        <div className="text-sm font-semibold text-muted">Giá trị cổ phiếu</div>
        <div className="text-sm font-semibold text-white">
          {formatNumber(data?.stockValue)}
        </div>
      </div>
      <div className="flex justify-between rounded-[8px] bg-content1 p-2">
        <div className="text-sm font-semibold text-muted">Tổng nợ</div>
        <div className="text-sm font-semibold text-white">
          {formatNumber(data?.totalDebt)}
        </div>
      </div>
    </div>
  );
}

function TabCoPhieu() {
  const { data } = useDNSEDeals();
  const { toggle } = useChiTietDanhMucModal();
  const { data: marketOverview } = useMarketOverviewData();

  const tongLaiLo = useMemo(() => {
    const result = { laiLo: 0, tongVon: 0, lailoPercent: 0 };
    if (!data) return result;
    data.forEach((item) => {
      if (item.status !== "OPEN") return;
      result.laiLo +=
        item.unrealizedProfit -
        item.estimateRemainTaxAndFee -
        item.unrealizedOpenTaxAndFee -
        item.currentInterest;
      result.tongVon += item.accumulateSecure;
      result.lailoPercent = result.tongVon
        ? (100 * result.laiLo) / result.tongVon
        : 0;
    });
    return result;
  }, [data]);
  const columns = [
    {
      key: "name",
      title: "Mã",
      render: (item: TDNSEDeal) => {
        const symbolData = marketOverview?.find((i) => i.code === item.symbol);
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
      key: "giavon",
      title: "Giá vốn",
      className: "text-end",
      render: (item: TDNSEDeal) => formatPrice(item.averageCostPrice),
    },
    {
      key: "lailo%",
      title: "+/- (%)",
      className: "text-end",

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
    {
      key: "lailo",
      title: "Lãi/Lỗ",
      className: "text-end",
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
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex justify-between rounded-[4px] bg-content1 p-2 text-xs text-muted">
        <div>Tổng lãi/lỗ</div>
        <div
          className={cn(
            "text-sm font-semibold",
            tongLaiLo.laiLo > 0
              ? "text-green"
              : tongLaiLo.laiLo < 0
                ? "text-red"
                : "text-white",
          )}
        >
          {`${formatNumber(tongLaiLo.laiLo)} | (${tongLaiLo.lailoPercent.toFixed(2)}%)`}
        </div>
      </div>
      <Table
        columns={columns}
        data={data}
        noDataText="Chưa có mã cổ phiếu nào"
      />
      <div>
        <Button
          className="bg-linearpurple h-[28px] rounded-[4px] text-sm font-medium text-black"
          onClick={toggle}
        >
          Chi tiết danh mục
        </Button>
      </div>
    </div>
  );
}

export default TaiSan;
