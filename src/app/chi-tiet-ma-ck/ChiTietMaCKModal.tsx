"use client";
import FavoriteStarButton from "@/components/FavoriteStarButton";
import DefaultLoader from "@/components/ui/DefaultLoader";
import Divider from "@/components/ui/Divider";
import Tabs from "@/components/ui/Tabs";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useCompanyEvents from "@/hooks/useCompanyEvents";
import useCompanyProfile from "@/hooks/useCompanyProfile";
import useModalsState, { MODALS } from "@/hooks/useModalsState";
import useSymbolInfo from "@/hooks/useSymbolInfo";
import DoubleArrow from "@/icons/DoubleArrow";
import { cn, formatPrice } from "@/lib/utils";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
} from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

const TabTongQuan = lazy(() => import("./TabTongQuan"));
const TabPhanTichTaiChinh = lazy(() => import("./TabPhanTichTaiChinh"));
const TabPhanTichKyThuat = lazy(() => import("./TabPhanTichKyThuat"));
const TabBaoCaoPhanTich = lazy(() => import("./TabBaoCaoPhanTich"));
const TabThongTinDoanhNghiep = lazy(() => import("./TabThongTinDoanhNghiep"));
const TabTinTucSuKien = lazy(() => import("./TabTinTucSuKien"));

export default function ChiTietMaCKModal() {
  const [debouncedSymbol, setDebouncedSymbol] = useState("");
  const { setChiTietMaCK, symbol, isOpen } = useChiTietMaCK();
  const { data: symbolInfo, isLoading } = useSymbolInfo(symbol || "");
  const [selectedTab, setSelectedTab] = useState("tongquan");
  const { openModal } = useModalsState(MODALS.TIM_KIEM);

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
        base: "w-[90%] max-w-[90vw] max-w-[1400px] h-[90vh] max-h-[1000px] bg-card",
      }}
      onClose={() => setChiTietMaCK("")}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex h-[48px] items-center gap-8">
            <div>
              <div
                className="flex cursor-pointer items-center gap-3"
                onClick={() => openModal()}
              >
                <div className="h-6 w-6 overflow-hidden rounded-full bg-white">
                  <img
                    src={`https://finance.vietstock.vn/image/${symbol}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-[20px] font-semibold leading-[44px] text-white">
                  {symbol}
                </div>
                <div>
                  <ChevronDown />
                </div>
                <div>
                  <FavoriteStarButton symbol={symbol} />
                </div>
                <div className="flex items-center gap-2 text-medium">
                  <div className="bg-lineargreen h-2 w-2 rounded-full"></div>
                  <div className="text-lineargreen">{symbolInfo?.exchange}</div>
                </div>
              </div>
              <div className="h-5 flex-shrink-0 text-sm font-normal">
                {symbolInfo?.FullName}
              </div>
            </div>
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
                      "text-purple",
                    symbolInfo?.closePrice === symbolInfo?.floor && "text-cyan",
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
                  <div className="text-xs text-muted">Giá sàn</div>
                  <div className="text-md font-semibold text-cyan">
                    {formatPrice(symbolInfo?.floor)}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-xs text-muted">Giá tham chiếu</div>
                  <div className="text-md font-semibold text-yellow">
                    {formatPrice(symbolInfo?.reference)}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-xs text-muted">Giá trần</div>
                  <div className="text-md font-semibold text-purple">
                    {formatPrice(symbolInfo?.ceiling)}
                  </div>
                </div>
                <Divider />
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-xs text-muted">Giá trị khớp</div>
                  {symbolInfo.totalTradingValue ? (
                    <div className="text-md font-semibold">
                      {(
                        symbolInfo.totalTradingValue / 1000_000_000
                      ).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                      <span className="ml-1 text-sm font-normal text-muted">
                        tỷ
                      </span>
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-xs text-muted">Khối lượng khớp</div>
                  {symbolInfo.totalTrading ? (
                    <div className="text-md font-semibold">
                      {(+symbolInfo.totalTrading).toLocaleString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-xs text-muted">NN mua ròng</div>
                  {symbolInfo.foreignBuy ? (
                    <div className="text-md font-semibold text-green">
                      {(+symbolInfo.foreignBuy).toLocaleString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-xs text-muted">NN bán ròng</div>
                  {symbolInfo.foreignSell ? (
                    <div className="text-md font-semibold text-red">
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
          <div className="flex-shrink-0">
            <Tabs
              variant="underlined"
              color="secondary"
              classNames={{
                tabList: "p-0",
                tab: "py-0 text-sm font-semibold",
                panel: "h-full flex-1 overflow-hidden pb-0",
                cursor: "w-full",
                tabContent: "group-data-[selected=true]:!text-lineargreen",
              }}
              selectedKey={selectedTab}
              onSelectionChange={(k) => setSelectedTab(k as string)}
            >
              <Tab key="tongquan" title="Tổng quan"></Tab>
              <Tab key="phantichtaichinh" title="Phân tích tài chính"></Tab>
              <Tab key="phantichkythuat" title="Phân tích kỹ thuật"></Tab>
              <Tab key="baocaophantich" title="Báo cáo phân tích"></Tab>
              <Tab
                key="thongtindoanhnghiep"
                title="Thông tin doanh nghiệp"
              ></Tab>
              <Tab key="tintucsukien" title="Tin tức & Sự kiện"></Tab>
            </Tabs>
          </div>
          <div className="flex-1">
            <Suspense fallback={<DefaultLoader />}>
              {selectedTab === "tongquan" && <TabTongQuan />}
              {selectedTab === "phantichtaichinh" && <TabPhanTichTaiChinh />}
              {selectedTab === "phantichkythuat" && <TabPhanTichKyThuat />}
              {selectedTab === "baocaophantich" && <TabBaoCaoPhanTich />}
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
