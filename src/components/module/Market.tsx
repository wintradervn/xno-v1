import Tabs from "@/components/ui/Tabs";
import { DropdownMenu, DropdownTrigger, Tab } from "@nextui-org/react";
import Button from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AltArrowDown,
  RoundedMagnifer,
  TransferHorizontal,
  Tuning2,
} from "solar-icon-set";
import Input from "@/components/ui/Input";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import { Fragment, useMemo, useState } from "react";
import {
  cn,
  formatNumber,
  formatPrice,
  formatPriceWithType,
  formatVeryLargeNumber,
} from "@/lib/utils";
import Table from "../ui/Table";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import { X } from "lucide-react";
import useMarketOverviewData, {
  TSymbolOverviewData,
} from "@/hooks/useMarketOverview";
import FavoriteStarButton from "../FavoriteStarButton";
import useFavorites from "@/hooks/useFavorites";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useIndexOverview from "@/hooks/useIndexOverview";
import TopDotBienKhoiLuongTable from "./TopDotBienKhoiLuongTable";

const topmoveData = [
  {
    symbol: "VCB",
    change: "+2.9%",
    text: "Tăng trong 5 phút",
    time: "09:06 17/10",
  },
];

const filterMarketData: any = [
  { key: "mucyeuthich", name: "Mục yêu thích" },
  { key: "HOSE", name: "HOSE" },
  { key: "HNX", name: "HNX" },
  { key: "UPCOM", name: "UPCOM" },
  { key: "phaisinh", name: "Phái sinh" },
  { key: "chungquyen", name: "Chứng quyển" },
];

const chiSo: any = [
  {
    key: "chisoVn",
    name: "Chỉ số VN",
  },
  {
    key: "cophieu",
    name: "Cổ phiếu",
  },
  {
    key: "chisoTG",
    name: "Chỉ số TG",
  },
  {
    key: "vimo",
    name: "Vĩ mô",
  },
];

const IndexNameMap: Record<string, string> = {
  VNIndex: "VNINDEX",
  HNXIndex: "HNX",
  HNXUpcomIndex: "UPCOM",
  VN30: "VN30",
};

function TabMarket() {
  const { setChiTietMaCK } = useChiTietMaCK();
  const { favorites } = useFavorites();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedChiSo, setSelectedChiSo] = useState("cophieu");
  const [isShowPercents, setIsShowPercents] = useState(true);
  const { data, isLoading } = useMarketOverviewData();
  const { data: indexesData } = useIndexOverview();

  const filteredData = useMemo(() => {
    if (selectedChiSo === "chisoVn") {
      return indexesData
        ? indexesData.map((item) => ({
            ...item,
            code: IndexNameMap[item.code] || item.code,
          }))
        : [];
    }
    if (!data) return [];
    return (
      data?.filter((item) => {
        const isMatchSearch = item.code.includes(search.toUpperCase());
        if (filter === "mucyeuthich") {
          if (!favorites) return false;
          return isMatchSearch && favorites.includes(item.code);
        }
        if (filter === "phaisinh") {
          return isMatchSearch && item.secType === "FU";
        }
        if (filter === "chungquyen") {
          return isMatchSearch && item.secType === "W";
        }
        if (filter) {
          return isMatchSearch && item.exchange === filter;
        }
        return isMatchSearch;
      }) || []
    ).sort((a, b) => {
      if (b.dayVolume && a.dayVolume) return b.dayVolume - a.dayVolume;
      return 0;
    });
  }, [data, search, filter, favorites, indexesData, selectedChiSo]);

  const columns = useMemo(() => {
    return [
      {
        title: "Mã CK",
        key: "mack",
        render: (item: TSymbolOverviewData) => (
          <div className="flex w-fit items-center gap-1">
            <div className="h-4 w-4 flex-shrink-0 overflow-hidden rounded-full bg-white">
              <img
                src={`https://finance.vietstock.vn/image/${item.code}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="font-semibold">{item.code}</div>
            <div className="flex-shrink-0">
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
          <div
            className={cn(
              "",
              item.dayChangePercent
                ? item.dayChangePercent > 0
                  ? "text-green"
                  : "text-red"
                : "text-yellow",
              item.price === item.ceiling && "text-purple",
              item.price === item.floor && "text-cyan",
              item.dayChangePercent === 0 && "text-yellow",
            )}
          >
            {formatPriceWithType(item.price, item.secType)}
          </div>
        ),
        sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
          a.price !== null && b.price !== null ? a.price - b.price : 0,
      },
      {
        title: (
          <div className="inline-flex items-center justify-end gap-2">
            <div
              className="h-4 text-neutral-600 hover:text-muted"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsShowPercents((prev) => !prev);
              }}
            >
              <TransferHorizontal size={14} />
            </div>
            {isShowPercents ? "%" : "Thay đổi"}
          </div>
        ),
        key: "thaydoi",
        className: "text-end",
        render: (item: TSymbolOverviewData) => {
          return isShowPercents ? (
            item.dayChangePercent !== null ? (
              <div
                className={cn(
                  "flex items-center justify-end font-semibold text-green",
                  item.dayChangePercent
                    ? item.dayChangePercent > 0
                      ? "text-green"
                      : "text-red"
                    : "text-yellow",
                  item.price === item.ceiling && "text-purple",
                  item.price === item.floor && "text-cyan",
                  item.dayChangePercent === 0 && "text-yellow",
                )}
              >
                {(item.dayChangePercent > 0 ? "+" : "") +
                  item.dayChangePercent.toFixed(2) +
                  "%"}
              </div>
            ) : (
              "-"
            )
          ) : (
            <div
              className={cn(
                "flex items-center justify-end font-semibold text-green",
                item.dayChangePercent
                  ? item.dayChangePercent > 0
                    ? "text-green"
                    : "text-red"
                  : "text-yellow",
                item.price === item.ceiling && "text-purple",
                item.price === item.floor && "text-cyan",
                item.dayChangePercent === 0 && "text-yellow",
              )}
            >
              {formatPrice(item.dayChange)}
            </div>
          );
        },
        sortFn: isShowPercents
          ? (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
              a.dayChangePercent !== null && b.dayChangePercent !== null
                ? a.dayChangePercent - b.dayChangePercent
                : 0
          : (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
              a.dayChange !== null && b.dayChange !== null
                ? a.dayChange - b.dayChange
                : 0,
      },
      {
        title: "KLGD",
        key: "klgd",
        className: "text-end",
        render: (item: TSymbolOverviewData) => (
          <>{(item.dayVolume || 0).toLocaleString()}</>
        ),
        sortFn: (a: TSymbolOverviewData, b: TSymbolOverviewData) =>
          a.dayVolume !== null && b.dayVolume !== null
            ? a.dayVolume - b.dayVolume
            : 0,
      },
    ];
  }, [isShowPercents]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex select-none justify-stretch gap-2 text-nowrap">
        {chiSo.map((item: any) => (
          <Fragment key={item.key}>
            {selectedChiSo === item.key ? (
              <div className="bg-lineargreen flex-1 cursor-pointer rounded-[6px] p-[1.5px] text-center text-xs">
                <div className="rounded-[4.5px] bg-card px-2 py-1 hover:bg-default-800">
                  <div className="text-lineargreen flex items-center justify-center text-center">
                    {item.name}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "flex min-w-fit flex-1 cursor-pointer items-center justify-center rounded-[6px] bg-background text-center text-xs text-muted hover:bg-default-800",
                )}
                onClick={() => setSelectedChiSo(item.key)}
              >
                {item.name}
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div className="py-3">
        <Input
          placeholder="Tìm kiếm"
          size="sm"
          startContent={<RoundedMagnifer size={18} />}
          classNames={{ inputWrapper: "pr-1 rounded-[6px]" }}
          value={search}
          onValueChange={(value) => setSearch(value)}
          endContent={
            <>
              <Dropdown
                placement="bottom-end"
                classNames={{ content: "min-w-[150px]" }}
              >
                <DropdownTrigger>
                  <Button
                    className="h-fit w-fit min-w-fit rounded-[4px] px-2 py-1 text-sm"
                    color="default"
                  >
                    <Tuning2 size={12} />
                    {filter
                      ? filterMarketData.find((f: any) => f.key === filter)
                          ?.name || "Bộ lọc"
                      : "Bộ lọc"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {filter ? (
                    <DropdownItem
                      key="close"
                      className="rounded-[4px] p-1 data-[hover=true]:bg-default-600/40"
                      classNames={{ wrapper: "text-sm" }}
                      onClick={() => setFilter("")}
                    >
                      <div className="flex items-center gap-1">
                        <X size={14} />
                        <span className="text-sm">Bỏ lựa chọn</span>
                      </div>
                    </DropdownItem>
                  ) : (
                    <></>
                  )}
                  <DropdownItem
                    key="mucyeuthich"
                    className="rounded-[4px] p-1 data-[hover=true]:bg-default-600/40"
                    classNames={{ wrapper: "text-sm" }}
                    onClick={() => setFilter("mucyeuthich")}
                  >
                    <span className="text-sm">Mục yêu thích</span>
                  </DropdownItem>
                  <DropdownItem
                    key="HOSE"
                    className="rounded-[4px] p-1 data-[hover=true]:bg-default-600/40"
                    classNames={{ title: "text-xs" }}
                    onClick={() => setFilter("HOSE")}
                  >
                    <span className="text-sm">HOSE</span>
                  </DropdownItem>
                  <DropdownItem
                    key="HNX"
                    className="rounded-[4px] p-1 data-[hover=true]:bg-default-600/40"
                    onClick={() => setFilter("HNX")}
                  >
                    <span className="text-sm">HNX</span>
                  </DropdownItem>

                  <DropdownItem
                    key="UPCOM"
                    className="rounded-[4px] p-1 data-[hover=true]:bg-default-600/40"
                    onClick={() => setFilter("UPCOM")}
                  >
                    <span className="text-sm">UPCOM</span>
                  </DropdownItem>
                  <DropdownItem
                    key="VN30"
                    className="rounded-[4px] p-1 data-[hover=true]:bg-default-600/40"
                    onClick={() => setFilter("VN30")}
                  >
                    <span className="text-sm">VN30</span>
                  </DropdownItem>
                  <DropdownItem
                    key="phaisinh"
                    className="rounded-[4px] p-1 data-[hover=true]:bg-default-600/40"
                    onClick={() => setFilter("phaisinh")}
                  >
                    <span className="text-sm">Phái sinh</span>
                  </DropdownItem>
                  <DropdownItem
                    key="chungquyen"
                    className="rounded-[4px] p-1 data-[hover=true]:bg-default-600/40"
                    onClick={() => setFilter("chungquyen")}
                  >
                    <span className="text-sm">Chứng quyền</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          }
        />
      </div>

      <Table
        data={filteredData}
        isLoading={isLoading}
        columns={columns}
        defaultSort={{ field: "klgd", order: "desc" }}
        onRowClick={(item) => {
          setChiTietMaCK(item.code);
        }}
      />
    </div>
  );
}

const filterData = [
  {
    key: "tatca",
    name: "Tất cả",
  },
  {
    key: "caotrongngay",
    name: "Cao trong ngày",
  },
  {
    key: "thaptrongngay",
    name: "Thấp trong ngày",
  },
  {
    key: "tangtrong5phut",
    name: "Tăng trong 5 phút",
  },
  {
    key: "giamtrong5phut",
    name: "Giảm trong 5 phút",
  },
  {
    key: "muavoisoluonglon",
    name: "Mua với số lượng lớn",
  },
  {
    key: "banvoisoluonglon",
    name: "Bán với số lượng lớn",
  },
];

const topBienDong = [
  { key: "bungnokl", name: "Bùng nổ KL" },
  { key: "cancung", name: "Cạn cung" },
  { key: "vuotdinh", name: "Vượt đỉnh" },
  { key: "phaday", name: "Phá đáy" },
];

function TabTopMovers() {
  return (
    <div className="flex h-full flex-col gap-2">
      <TopDotBienKhoiLuongTable type={2} />
    </div>
  );
}

function Market() {
  return (
    <div className="flex h-full w-full min-w-[250px] flex-col">
      <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          tab: "px-2 py-0 text-sm font-semibold",
          panel: "h-full flex-1 overflow-hidden pb-0",
          cursor: "w-full",
          tabContent: "group-data-[selected=true]:!text-lineargreen",
        }}
        defaultSelectedKey={"thitruong"}
      >
        <Tab key="thitruong" title="Thị trường">
          <TabMarket />
        </Tab>
        <Tab key="topmovers" title="Top biến động">
          <TabTopMovers />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Market;
