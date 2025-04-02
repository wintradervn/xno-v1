"use client";
import HieuSuatBotLineChart from "@/components/charts/HieuSuatBotLineChart";
import DefaultLoader from "@/components/ui/DefaultLoader";
import DefaultNodata from "@/components/ui/DefaultNodata";
import { ScrollArea } from "@/components/ui/scroll-area";
import Tabs from "@/components/ui/Tabs";
import useBotPhaiSinhHistory from "@/hooks/bot-api/useBotPhaiSinhHistory";
import useBotPhaiSinhInfoData from "@/hooks/bot-api/useBotPhaiSinhInfoData";
import { useXacNhanNhanThongBaoTinHieu } from "@/hooks/ui-components/useXacNhanNhanThongBaoTinHieu";
import useSelectedBotName from "@/hooks/useSelectedBotName";
import DoubleArrow from "@/icons/DoubleArrow";
import TrendingUp from "@/icons/TrendingUp";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { format, set } from "date-fns";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
} from "@heroui/react";
import clsx from "clsx";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import useBotPhaiSinhPNLData from "@/hooks/bot-api/useBotPhaiSinhPNLData";
import useBotPhaiSinhFollowsList from "@/hooks/bot-api/useBotPhaiSinhFollowsList";
import { CheckRead } from "solar-icon-set";

export default function BotModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const defaultTab = searchParams.get("defaultTab") || "hieusuat";
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [selectedTime, setSelectedTime] = useState("1M");
  const {
    openModal: openModalXacNhan,
    ModalComponent: XacNhanNhanThongBaoModal,
  } = useXacNhanNhanThongBaoTinHieu();
  const { botName } = useSelectedBotName();
  const { data: botInfo } = useBotPhaiSinhInfoData(botName || undefined);
  const { data: followsList } = useBotPhaiSinhFollowsList();

  const isPhaiSinh = botInfo?.symbol.startsWith("VN30F");
  const isDaNhanTinHieu = !!followsList?.some((f) => f.name === botName);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("botName");
    params.delete("defaultTab");
    router.replace(pathname + "?" + params.toString());
  };

  useEffect(() => {
    setSelectedTab(defaultTab);
  }, [defaultTab]);
  useEffect(() => {
    setSelectedTime("1M");
  }, [isPhaiSinh]);
  return (
    <>
      <Modal
        isOpen={!!botName}
        onClose={handleClose}
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: "w-[90%] max-w-[90vw] max-w-[1100px] max-h-[calc(96vh-60px)] bg-card rounded-[8px] shadow-lg mt-4",
          closeButton: "hover:bg-background active:bg-background",
          backdrop: "bg-neutral-800/30",
        }}
        placement="top-center"
      >
        <ModalContent>
          <ModalHeader className="shrink-0 px-5 pt-7 pb-3">
            <div className="flex w-full items-end justify-between">
              <div className="flex gap-2">
                <div className="relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full sm:h-[60px] sm:w-[60px]">
                  <Image src="/image/bot-image.png" fill alt="bot image" />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="text-linearpurple text-md truncate font-semibold sm:text-xl">
                    Bot{" "}
                    {botInfo
                      ? isPhaiSinh
                        ? `${botInfo.symbol} ${botInfo.freq} ${botInfo.book_size / 1000000}`
                        : `${botInfo.symbol}`
                      : ""}
                  </div>
                  {botInfo && (
                    <div className="text-md">
                      {botInfo.total_followers}{" "}
                      <span className="text-muted text-sm font-normal">
                        Người theo dõi
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {isDaNhanTinHieu ? (
                <div className="bg-background text-md flex items-center gap-1 rounded-full px-3 py-1.5 font-medium">
                  Đã nhận tín hiệu <CheckRead size={16} />
                </div>
              ) : (
                <div
                  className="text-refine-bg hover:text-refine-bg group relative z-1 block h-[34px] cursor-pointer appearance-none transition-all duration-100 hover:no-underline focus:outline-hidden active:scale-[0.96] sm:h-[44px]"
                  onClick={() => openModalXacNhan()}
                >
                  <div className="blur-0 absolute -top-[1px] -right-[1px] -bottom-[1px] -left-[1px] z-[-1] overflow-hidden rounded-full">
                    <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute top-[-24px] left-[-12.5%] aspect-square h-auto w-[125%] sm:top-[-44px]"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 -bottom-1 -left-1 z-[-1] overflow-hidden rounded-full opacity-0 blur-[1px] transition-all duration-300 group-hover:opacity-70 group-hover:blur-[4px]">
                    <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute top-[-24px] left-[-12.5%] aspect-square h-auto w-[125%] sm:top-[-44px]"></div>
                  </div>
                  <div className="bg-card rounded-full group-hover:bg-white group-hover:dark:bg-black">
                    <div className="flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out">
                      <div className="animate-pause group-hover:animate-running text-foreground sm:text-md h-[34px]! rounded-full px-3 py-2 text-sm font-semibold text-nowrap transition-colors select-none sm:h-[44px]! sm:px-4 sm:py-3">
                        Nhận tín hiệu
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ModalHeader>
          <ModalBody className="relative mb-4 flex h-full flex-col gap-2 px-5 sm:gap-5">
            <Tabs
              color="primary"
              classNames={{
                tabList: "w-full sm:w-fit",
                tab: "flex-1 sm:flex-none",
                base: "shrink-0",
              }}
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
            >
              <Tab key="hieusuat" title="Hiệu suất"></Tab>
              <Tab key="lenhmo-lichsu" title="Lệnh mở - Lịch sử"></Tab>
            </Tabs>
            {selectedTab === "hieusuat" ? (
              <>
                <Tabs
                  color="primary"
                  classNames={{
                    tabList: "w-full sm:w-fit",
                    tab: "flex-1 sm:flex-none",
                    base: "shrink-0 sm:absolute right-5",
                  }}
                  selectedKey={selectedTime}
                  onSelectionChange={(key) => setSelectedTime(key as string)}
                >
                  {isPhaiSinh && <Tab key="1W" title="1W"></Tab>}
                  <Tab key="1M" title="1M"></Tab>
                  <Tab key="tatca" title="Tất cả"></Tab>
                </Tabs>
                <TabHieuSuat
                  botName={botName || undefined}
                  timeFrame={selectedTime}
                />
              </>
            ) : null}
            {selectedTab === "lenhmo-lichsu" ? <TabLenhMoLichSu /> : null}
          </ModalBody>
        </ModalContent>
      </Modal>
      <XacNhanNhanThongBaoModal />
    </>
  );
}

function TabHieuSuat({
  botName,
  timeFrame,
}: {
  botName?: string;
  timeFrame?: string;
}) {
  const { data: botInfo, isLoading } = useBotPhaiSinhInfoData(botName);
  const isPhaiSinh = botInfo?.symbol.startsWith("VN30F");
  if (isLoading) return <DefaultLoader />;
  if (!botInfo) return <DefaultNodata text="Không có dữ liệu của bot" />;

  return (
    <>
      <div className="border-border shrink-0 rounded-[8px] border p-1 sm:p-3">
        <HieuSuatBotLineChart timeFrame={timeFrame} />
      </div>
      <div className="flex shrink-0 flex-wrap justify-center gap-2 gap-x-4 px-4 sm:gap-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-[6px] w-[15px] shrink-0 rounded-[2px] bg-[#FF80B6]">
            {" "}
          </div>
          {isPhaiSinh ? "Chỉ số VN30F1M" : botInfo?.symbol}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-[6px] w-[15px] shrink-0 rounded-[2px] bg-[#7B61FF]">
            {" "}
          </div>
          BotXNO
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-green h-[6px] w-[15px] shrink-0 rounded-[2px]">
            {" "}
          </div>
          {isPhaiSinh ? "Long" : "Buy"}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-red h-[6px] w-[15px] shrink-0 rounded-[2px]">
            {" "}
          </div>
          {isPhaiSinh ? "Short" : "Sell"}
        </div>
        {isPhaiSinh && (
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-yellow h-[6px] w-[15px] shrink-0 rounded-[2px]">
              {" "}
            </div>
            Cover
          </div>
        )}
      </div>
      <div className="border-border shrink-0 rounded-[8px] border p-3">
        <div className="text-caption mb-2 flex items-center gap-2">
          Hiệu suất giao dịch <TrendingUp />
        </div>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-10">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-muted text-sm font-normal">
                Thời gian hoạt động:
              </div>
              <div className="text-md font-semibold">
                {formatDuration({
                  start: botInfo.start_candle,
                  end: botInfo.current_candle,
                })}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted text-sm font-normal">
                Tổng NAV ban đầu:
              </div>
              <div className="text-md font-semibold">
                {formatNumber(botInfo.book_size)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted text-sm font-normal">
                Tổng lợi nhuận:
              </div>
              <div className="text-green text-md font-semibold">
                {formatNumber(botInfo.cumulative_pnl)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted text-sm font-normal">
                Tỷ lệ lợi nhuận:
              </div>
              <div
                className={clsx(
                  "h-6 min-w-10 px-2",
                  botInfo.cumulative_return > 0 ? "badge-green" : "badge-red",
                )}
              >
                {formatNumber(botInfo.cumulative_return * 100, 1)}%
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-muted text-sm font-normal">
                Tổng phí giao dịch:
              </div>
              <div className="text-md font-semibold">
                {formatNumber(-botInfo.cumulative_fee)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted text-sm font-normal">Tỷ lệ thắng:</div>
              <div
                className={clsx(
                  "h-6 min-w-10 px-2",
                  botInfo.win_rate > 0 ? "badge-green" : "badge-red",
                )}
              >
                {formatNumber(botInfo.win_rate * 100, 1)}%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted text-sm font-normal">
                Mức sụt giảm tối đa:
              </div>
              <div className="badge-yellow h-6 min-w-10 px-2">
                {formatNumber(botInfo.mdd * 100, 1)}%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted text-sm font-normal">
                Tỷ lệ sharpe:
              </div>
              <div className="text-md font-semibold">
                {formatNumber(botInfo.sharpe, 2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TabLenhMoLichSu() {
  const { botName } = useSelectedBotName();
  const { history } = useBotPhaiSinhHistory(botName || undefined);
  const { data: botInfo } = useBotPhaiSinhInfoData(botName || undefined);
  const { data: pnlData } = useBotPhaiSinhPNLData(botName || undefined);
  const lastHistory = useMemo(
    () => (history ? history[history.length - 1] : undefined),
    [history],
  );
  const lastPnL = useMemo(() => {
    if (!lastHistory || !pnlData) return 0;
    const index = pnlData.time.findIndex((t) => t === lastHistory.open_time);
    if (index === -1) return 0;
    return pnlData.value[pnlData.value.length - 1] - pnlData.value[index];
  }, [pnlData]);
  return (
    <div className="min-h-[500px] flex-1">
      <div className="flex shrink-0 flex-col gap-3">
        <div className="text-sm font-semibold">Lệnh mở</div>
        <div className="flex flex-col gap-2">
          {lastHistory && lastHistory.type !== "Cover" ? (
            <div className="flex shrink-0 flex-col gap-1 rounded-[8px] border p-2">
              <div className="flex items-center gap-2">
                <div className="text-md">{botInfo?.symbol} - 1,270</div>
                <div className="text-green flex items-center text-sm">
                  <DoubleArrow /> +0.9 (+0.11%)
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    lastHistory.type === "Long"
                      ? "badge-green"
                      : lastHistory.type === "Short"
                        ? "badge-red"
                        : "badge-yellow",
                  )}
                >
                  {lastHistory.type}
                </div>
                <div className="text-md font-normal">
                  {format(lastHistory.open_time * 1000, "dd/MM/yyyy hh:mm:ss")}
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="text-muted text-sm">
                  Thời gian mở:{" "}
                  <span className="text-md text-foreground">
                    {format(
                      lastHistory.open_time * 1000,
                      "dd/MM/yyyy hh:mm:ss",
                    )}
                  </span>
                </div>
                <div className="text-muted text-sm">
                  Vùng giá:{" "}
                  <span className="text-md text-foreground">
                    {lastHistory.signal_price}
                  </span>
                </div>
                <div className="text-muted text-sm">
                  PNL ước tính:{" "}
                  <span className="text-md text-green font-semibold">
                    {botInfo?.book_size
                      ? formatNumber((lastPnL / botInfo?.book_size) * 100, 2) +
                        "%"
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted flex shrink-0 flex-col items-center gap-1 rounded-[8px] border p-6 text-sm">
              Không có lệnh đang mở
            </div>
          )}
        </div>
        <div className="text-sm font-semibold">Lịch sử</div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {[
              ...history.slice(
                0,
                lastHistory && lastHistory.type !== "Cover"
                  ? history.length - 1
                  : history.length - 2,
              ),
            ]
              .slice(0, history.length - 2)
              .reverse()
              .map((position: any, i: number) => (
                <div
                  className="flex flex-col gap-1 rounded-[8px] border p-2"
                  key={i}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-md">{botInfo?.symbol}</div>
                      <div
                        className={cn(
                          "text-sm font-semibold",
                          position.type === "Long"
                            ? "badge-green"
                            : position.type === "Short"
                              ? "badge-red"
                              : "badge-yellow",
                        )}
                      >
                        {position.type}{" "}
                        {botInfo?.max_position && position
                          ? (
                              Math.abs(position.change / botInfo.max_position) *
                              100
                            ).toString() + "%"
                          : ""}
                      </div>
                      <div className="text-md font-normal">
                        {format(
                          position.open_time * 1000,
                          "dd/MM/yyyy hh:mm:ss",
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-300">
                      Đã đóng
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="text-muted w-60 text-sm text-nowrap">
                      Thời gian mở:{" "}
                      <span className="text-md text-foreground">
                        {format(
                          position.open_time * 1000,
                          "dd/MM/yyyy hh:mm:ss",
                        )}
                      </span>
                    </div>
                    <div className="text-muted w-40 text-sm text-nowrap">
                      Giá vào lệnh:{" "}
                      <span className="text-md text-foreground">
                        {position.signal_price}
                      </span>
                    </div>
                    {position.type === "Cover" ? (
                      <div className="text-muted w-50 text-right text-sm text-nowrap">
                        PNL đã thực hiện:{" "}
                        <span
                          className={cn(
                            "text-md font-semibold",
                            position.pnl > 0 ? "text-green" : "text-red",
                          )}
                        >
                          {botInfo
                            ? formatNumber(
                                (position.pnl / botInfo.book_size) * 100,
                                2,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    ) : (
                      <div className="w-50"></div>
                    )}
                  </div>
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="text-muted w-60 text-sm text-nowrap">
                      Thời gian đóng:{" "}
                      <span className="text-md text-foreground">
                        {position.close_time
                          ? format(
                              position.close_time * 1000,
                              "dd/MM/yyyy hh:mm:ss",
                            )
                          : "-"}
                      </span>
                    </div>
                    <div className="text-muted w-40 text-sm text-nowrap">
                      Giá khớp:{" "}
                      <span className="text-md text-foreground">
                        {position.signal_price}
                      </span>
                    </div>
                    <div className="text-muted w-50 text-right text-sm text-nowrap">
                      HĐ Đã đóng:{" "}
                      <span className="text-md text-foreground">
                        {position.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
