import { cn, formatPrice } from "@/lib/utils";
import FavoriteStarButton from "../FavoriteStarButton";
import Table from "../ui/Table";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import { useMemo, useState } from "react";
import Tabs from "../ui/Tabs";
import { Tab } from "@heroui/react";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";

export default function TopBienDongTable() {
  const { data } = useMarketOverviewData();
  const [selectedTab, setSelectedTab] = useState("tanggia");
  const { setChiTietMaCK } = useChiTietMaCK();
  const filteredData = useMemo(
    () =>
      data
        ?.filter(
          (item) =>
            item.dayVolume && item.dayVolume > 0 && item.sectors?.length,
        )
        .sort((a, b) =>
          a.dayChangePercent !== null && b.dayChangePercent !== null
            ? (selectedTab === "tanggia" ? 1 : -1) *
              (b.dayChangePercent - a.dayChangePercent)
            : 0,
        ),
    [data, selectedTab],
  );

  return (
    <>
      <Tabs
        radius="sm"
        variant="solid"
        classNames={{
          base: "w-fit",
          tabList: "flex-1 bg-content1! p-0.5 rounded-[4px]",
          cursor: "bg-background! rounded-[4px]",
          tab: "text-sm py-0 h-7",
        }}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab key="tanggia" title="Tăng giá"></Tab>
        <Tab key="giamgia" title="Giảm giá"></Tab>
      </Tabs>
      <Table
        className="max-h-[600px] min-h-[400px] flex-1 sm:max-h-full"
        onRowClick={(item) => {
          setChiTietMaCK(item.code);
        }}
        columns={[
          {
            title: "Mã CK",
            key: "mack",
            render: (item: TSymbolOverviewData) => (
              <div className="flex w-fit items-center gap-1">
                <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full bg-white">
                  <img
                    src={`https://finance.vietstock.vn/image/${item.code}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="font-semibold">{item.code}</div>
                <div className="shrink-0">
                  <FavoriteStarButton symbol={item.code} size={14} />
                </div>
              </div>
            ),
          },
          {
            title: "Giá",
            key: "gia",
            className: "text-end",
            render: (item: TSymbolOverviewData) => (
              <>{formatPrice(item.price)}</>
            ),
          },
          {
            title: "% Hôm nay",
            key: "homnay",
            className: "text-end",
            render: (item: TSymbolOverviewData) =>
              item.dayChangePercent && (
                <div
                  className={cn(
                    "text-green flex items-center justify-end font-semibold",
                    item.dayChangePercent && item.dayChangePercent > 0
                      ? "text-green"
                      : item.dayChangePercent
                        ? "text-red"
                        : "text-yellow",
                  )}
                >
                  {item.dayChangePercent > 0 && "+"}
                  {item.dayChangePercent.toFixed(2)}%
                </div>
              ),
            sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
              a.dayChangePercent &&
              b.dayChangePercent &&
              a.dayChangePercent - b.dayChangePercent,
          },
          {
            title: "% 1M",
            key: "tuannay",
            className: "text-end",
            render: (item: TSymbolOverviewData) =>
              item.weekChangePercent && (
                <div
                  className={cn(
                    "text-green flex items-center justify-end font-semibold",
                    item.weekChangePercent > 0
                      ? "text-green"
                      : item.weekChangePercent
                        ? "text-red"
                        : "text-yellow-400",
                  )}
                >
                  {item.weekChangePercent > 0 && "+"}
                  {item.weekChangePercent.toFixed(2)}%
                </div>
              ),
            sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
              a.weekChangePercent &&
              b.weekChangePercent &&
              a.weekChangePercent - b.weekChangePercent,
          },
        ]}
        data={filteredData}
      ></Table>
    </>
  );
}
