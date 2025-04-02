"use client";
import Tabs from "@/components/ui/Tabs";
import { Accordion, AccordionItem, Tab } from "@heroui/react";
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
import useDNSEPhaiSinhDeals from "@/hooks/dnse/useDNSEPhaiSinhDeals";

function TaiSan() {
  return (
    <div className="flex h-full w-full flex-col">
      <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          tabList: "gap-0.5",
          tab: "px-2 py-0 text-sm font-semibold text-cyan-400",
          panel: "flex-1 overflow-hidden pb-0",
          cursor: "w-full",
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
          <TabPhaiSinh />
        </Tab>
      </Tabs>
    </div>
  );
}

function TabTaiSan() {
  const { data } = useDNSEAccountBalances();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-content1 flex justify-between rounded-[8px] p-2">
        <div className="text-muted text-sm font-semibold">Tài sản ròng</div>
        <div className="text-sm font-semibold text-white">
          {formatNumber(data?.netAssetValue)}
        </div>
      </div>
      <Accordion className="px-0!">
        <AccordionItem
          title={
            <div className="bg-content1 flex justify-between rounded-[8px] p-2">
              <div className="text-muted text-sm font-semibold">Tiền</div>
              <div className="text-sm font-semibold text-white">
                {formatNumber(data?.totalCash)}
              </div>
            </div>
          }
          hideIndicator
          className="px-0!"
          classNames={{ trigger: "p-0", base: "px-0" }}
        ></AccordionItem>
      </Accordion>
      <div className="bg-content1 flex justify-between rounded-[8px] p-2">
        <div className="text-muted text-sm font-semibold">Giá trị cổ phiếu</div>
        <div className="text-sm font-semibold text-white">
          {formatNumber(data?.stockValue)}
        </div>
      </div>
      <div className="bg-content1 flex justify-between rounded-[8px] p-2">
        <div className="text-muted text-sm font-semibold">Tổng nợ</div>
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
      if (item.status !== "OPEN" && item.status !== "ODD_LOT") return;
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
      <div className="bg-content1 text-muted flex justify-between rounded-[4px] p-2 text-xs">
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
          {tongLaiLo &&
            `${formatNumber(tongLaiLo.laiLo)} (${tongLaiLo.lailoPercent.toFixed(2)}%)`}
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

function TabPhaiSinh() {
  const { data } = useDNSEPhaiSinhDeals();
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
      <Table
        columns={columns}
        data={data}
        noDataText="Chưa có deal phái sinh nào"
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
