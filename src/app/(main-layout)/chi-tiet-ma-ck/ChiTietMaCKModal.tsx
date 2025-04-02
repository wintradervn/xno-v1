"use client";
import FavoriteStarButton from "@/components/FavoriteStarButton";
import DefaultLoader from "@/components/ui/DefaultLoader";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import Popover from "@/components/ui/Popover";
import Tabs from "@/components/ui/Tabs";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useCompanyEvents from "@/hooks/useCompanyEvents";
import useCompanyProfile from "@/hooks/useCompanyProfile";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import SearchResultUI from "@/components/SearchSymbol/SearchResultUI";
import useSymbolInfo from "@/hooks/useSymbolInfo";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatPrice } from "@/lib/utils";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  PopoverContent,
  PopoverTrigger,
  Tab,
} from "@heroui/react";
import { ChevronDown, X } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import UnfinishedFeature from "@/components/ui/UnfinishedFeature";
import TabBaoCaoPhanTich from "./TabBaoCaoPhanTich";

const TabTongQuan = lazy(() => import("./TabTongQuan"));
const TabPhanTichTaiChinh = lazy(() => import("./TabPhanTichTaiChinh"));
const TabPhanTichKyThuat = lazy(() => import("./TabPhanTichKyThuat"));
const TabThongTinDoanhNghiep = lazy(() => import("./TabThongTinDoanhNghiep"));
const TabTinTucSuKien = lazy(() => import("./TabTinTucSuKien"));

export default function ChiTietMaCKModal() {
  const [debouncedSymbol, setDebouncedSymbol] = useState("");
  const { setChiTietMaCK, symbol, isOpen } = useChiTietMaCK();
  const { data: symbolInfo, isLoading } = useSymbolInfo(symbol || "");
  const [selectedTab, setSelectedTab] = useState("tongquan");

  // Prefetch
  useCompanyProfile(debouncedSymbol);
  useCompanyEvents(debouncedSymbol);

  useEffect(() => {
    if (symbol) {
      setDebouncedSymbol(symbol);
    } else {
      setTimeout(() => {
        setDebouncedSymbol("");
      }, 500);
    }
  }, [symbol]);

  useEffect(() => {
    if (!debouncedSymbol) return;
    setSelectedTab("tongquan");
  }, [debouncedSymbol]);

  if (!debouncedSymbol || !symbolInfo) return null;

  return (
    <Modal
      isOpen={isOpen}
      backdrop="blur"
      classNames={{
        base: "w-[90%] max-w-[90vw] max-w-[1400px] h-[90vh] max-h-[1000px] bg-card rounded-[8px] shadow-lg",
        closeButton: "hover:bg-background active:bg-background",
        backdrop: "bg-neutral-800/30",
      }}
      onClose={() => setChiTietMaCK("")}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex h-[48px] items-center gap-8">
            <SearchPopover symbolInfo={symbolInfo} />
            {isLoading ? (
              <div className="h-[48px]"></div>
            ) : (
              <div className="flex items-center gap-8">
                <div
                  className={cn(
                    "flex flex-col items-end gap-0.5",
                    symbolInfo?.changePercent
                      ? symbolInfo.changePercent > 0
                        ? "text-green"
                        : "text-red"
                      : "text-yellow",
                    symbolInfo?.closePrice === symbolInfo?.ceiling &&
                      "text-ceiling",
                    symbolInfo?.closePrice === symbolInfo?.floor &&
                      "text-floor",
                  )}
                >
                  <div className="text-xl font-semibold">
                    {formatPrice(symbolInfo?.closePrice)}
                  </div>
                  <div className={cn("flex items-center text-sm font-medium")}>
                    {symbolInfo?.changePercent ? (
                      symbolInfo.changePercent > 0 ? (
                        <DoubleArrow size={14} />
                      ) : (
                        <DoubleArrow rotate={180} size={14} />
                      )
                    ) : null}
                    {symbolInfo?.changePercent?.toFixed(2)}%
                  </div>
                </div>

                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-muted text-xs">Giá sàn</div>
                  <div className="text-md text-cyan font-semibold">
                    {formatPrice(symbolInfo?.floor)}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-muted text-xs">Giá tham chiếu</div>
                  <div className="text-md text-yellow font-semibold">
                    {formatPrice(symbolInfo?.reference)}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-muted text-xs">Giá trần</div>
                  <div className="text-md text-ceiling font-semibold">
                    {formatPrice(symbolInfo?.ceiling)}
                  </div>
                </div>
                <Divider />
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-muted text-xs">Giá trị khớp</div>
                  {symbolInfo?.totalTradingValue ? (
                    <div className="text-md font-semibold">
                      {(
                        symbolInfo.totalTradingValue / 1000_000_000
                      ).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                      <span className="text-muted ml-1 text-sm font-normal">
                        tỷ
                      </span>
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-muted text-xs">Khối lượng khớp</div>
                  {symbolInfo?.totalTrading ? (
                    <div className="text-md font-semibold">
                      {(+symbolInfo.totalTrading).toLocaleString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-muted text-xs">NN mua ròng</div>
                  {symbolInfo?.foreignBuy ? (
                    <div className="text-md text-green font-semibold">
                      {(+symbolInfo.foreignBuy).toLocaleString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-muted text-xs">NN bán ròng</div>
                  {symbolInfo?.foreignSell ? (
                    <div className="text-md text-red font-semibold">
                      {(+symbolInfo.foreignSell).toLocaleString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            )}
          </div>
        </ModalHeader>
        <ModalBody className="mb-4 flex h-full flex-col gap-5">
          <div className="shrink-0">
            <Tabs
              variant="underlined"
              color="secondary"
              classNames={{
                tabList: "p-0",
                tab: "py-0 text-sm font-semibold",
                panel: "h-full flex-1 overflow-hidden pb-0",
                cursor: "w-full",
              }}
              selectedKey={selectedTab}
              onSelectionChange={(k) => setSelectedTab(k as string)}
            >
              <Tab key="tongquan" title="Tổng quan"></Tab>
              <Tab key="phantichtaichinh" title="Tài chính"></Tab>
              <Tab key="phantichkythuat" title="Phân tích kỹ thuật"></Tab>
              {/* <Tab key="baocaophantich" title="Báo cáo phân tích"></Tab> */}
              <Tab key="thongtindoanhnghiep" title="Hồ sơ"></Tab>
              {/* <Tab key="tintucsukien" title="Tin tức & Sự kiện"></Tab> */}
            </Tabs>
          </div>
          <div className="flex-1">
            <Suspense fallback={<DefaultLoader />}>
              {selectedTab === "tongquan" && <TabTongQuan />}
              {selectedTab === "phantichtaichinh" && <TabPhanTichTaiChinh />}
              {selectedTab === "phantichkythuat" && <TabPhanTichKyThuat />}
              {/* {selectedTab === "baocaophantich" && (
                <UnfinishedFeature>
                  <TabBaoCaoPhanTich />
                </UnfinishedFeature>
              )} */}
              {selectedTab === "thongtindoanhnghiep" && (
                <TabThongTinDoanhNghiep />
              )}
              {selectedTab === "tintucsukien" && <TabTinTucSuKien />}
            </Suspense>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function SearchPopover({ symbolInfo }: { symbolInfo: any }) {
  const { currentSymbol, setCurrentSymbol } = useCurrentSymbol();
  const [searchSymbol, setSearchSymbol] = useState("");
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [firstSymbol, setFirstSymbol] = useState<string | undefined>();

  useEffect(() => {
    setSearchSymbol("");
  }, [currentSymbol, isOpenSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchSymbol("");
  }, []);

  return (
    <Popover
      placement="bottom-start"
      isOpen={isOpenSearch}
      onOpenChange={setIsOpenSearch}
    >
      <PopoverTrigger>
        <div className="cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 overflow-hidden rounded-full bg-white">
              <img
                src={`https://finance.vietstock.vn/image/${currentSymbol}`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-[20px] leading-[44px] font-semibold text-white">
              {currentSymbol}
            </div>
            <div>
              <ChevronDown />
            </div>
            <div>
              <FavoriteStarButton symbol={currentSymbol} />
            </div>
            <div className="text-medium flex items-center gap-2">
              <div className="bg-purple dark:bg-lineargreen h-2 w-2 rounded-full"></div>
              <div className="text-lineargreen">{symbolInfo?.exchange}</div>
            </div>
          </div>
          <div className="h-5 shrink-0 text-sm font-normal">
            {symbolInfo?.FullName}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent autoFocus>
        <div className="flex max-w-[500px] flex-col gap-2">
          <Input
            autoFocus
            placeholder="Tìm mã CK"
            value={searchSymbol}
            onValueChange={setSearchSymbol}
            endContent={
              searchSymbol && (
                <button
                  className="hover:text-foreground/80 transition-all hover:bg-neutral-800 active:bg-neutral-700"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchSymbol("");
                  }}
                >
                  <X size={20} />
                </button>
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleClearSearch();
              }
              if (e.key === "Enter" && firstSymbol && searchSymbol) {
                setCurrentSymbol(firstSymbol);
                setIsOpenSearch(false);
              }
            }}
          />
          <SearchResultUI
            search={searchSymbol}
            onSearch={(s) => {
              setCurrentSymbol(s);
              setIsOpenSearch(false);
            }}
            hiddenIndex
            onDataChanged={(data) => {
              setFirstSymbol(data?.[0]?.code);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
