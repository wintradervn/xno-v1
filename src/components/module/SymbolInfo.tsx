import TradingViewChart from "../TradingViewChart";
import {
  cn,
  formatNumber,
  formatPrice,
  formatVeryLargeNumber,
} from "@/lib/utils";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Tabs from "../ui/Tabs";
import { Tab, Tooltip } from "@heroui/react";
import DefaultLoader from "../ui/DefaultLoader";
import TabPhanTichTaiChinh from "@/app/(main-layout)/chi-tiet-ma-ck/TabPhanTichTaiChinh";
import TabPhanTichKyThuat from "@/app/(main-layout)/chi-tiet-ma-ck/TabPhanTichKyThuat";
import TabBaoCaoPhanTich from "@/app/(main-layout)/chi-tiet-ma-ck/TabBaoCaoPhanTich";
import TabThongTinDoanhNghiep from "@/app/(main-layout)/chi-tiet-ma-ck/TabThongTinDoanhNghiep";
import TabTinTucSuKien from "@/app/(main-layout)/chi-tiet-ma-ck/TabTinTucSuKien";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useMarketOverviewData from "@/hooks/useMarketOverview";
import useMuaBanChuDong from "@/hooks/api-v2/useMuaBanChuDong";
import NNMuaRong10PhienBarChart from "../charts/NNMuaRong10PhienBarChart";
import NNYTDStockBarChart from "../charts/NNYTDStockBarChart";
import useFINSCNhanDinhChuyenGia from "@/hooks/finsc/useFINSCNhanDinhChuyenGia";
import DefaultNodata from "../ui/DefaultNodata";
import useDNSEShareHolders from "@/hooks/dnse/useDNSEShareHolders";
import { InfoCircle } from "solar-icon-set";
import MuaBanChuDongBarChart from "../charts/MuaBanChuDongBarChart";
import useFilterProData from "@/hooks/useFilterProData";
import DinhGiaThiTruongScreen from "@/app/(main-layout)/chi-tiet-ma-ck/DinhGiaThiTruong";
import { MAU_HINH_PATTERN } from "@/app/(main-layout)/loc-co-phieu/constant";

const checkboxes = [
  "PE",
  "PB",
  "EPS",
  "EY",
  "ROE",
  "ROA",
  "VOL",
  "MA",
  "EMA",
  "MACD",
  "RSI",
  "BOLL",
];

export default function SymbolInfo() {
  const [checked, setChecked] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("bieudo");
  const { isIndex } = useCurrentSymbol();

  return (
    <div className="flex h-full w-full min-w-[200px] flex-col gap-2">
      <Tabs
        color="secondary"
        variant="underlined"
        classNames={{
          tab: "px-1.5 py-0 text-sm font-semibold min-w-fit",
          panel: "h-full flex-1 overflow-hidden pb-0",
          cursor: "w-full",
          tabList: "overflow-x-auto",
        }}
        defaultSelectedKey={"bieudo"}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab key="bieudo" title="Biểu đồ"></Tab>
        {/* {isIndex && (
          <>
            <Tab key="dinhgiathitruong" title="Định giá thị trường"></Tab>
            <Tab key="tamlythitruong" title="Tâm lý thị trường"></Tab>
          </>
        )} */}
        {!isIndex && (
          <>
            <Tab key="tongquan" title="Tổng quan"></Tab>
            <Tab key="taichinh" title="Tài chính"></Tab>
            <Tab key="phantichkythuat" title="Phân tích kỹ thuật"></Tab>
            {/* <Tab key="baocaophantich" title="Báo cáo phân tích"></Tab> */}
            <Tab key="hoso" title="Hồ sơ"></Tab>
            {/* <Tab key="tintucsukien" title="Tin tức & sự kiện"></Tab> */}
          </>
        )}
      </Tabs>
      <div className="flex flex-1 flex-col gap-2 p-2">
        <Suspense fallback={<DefaultLoader />}>
          {selectedTab === "bieudo" && (
            <>
              <TradingViewChart />
              <div className="flex shrink-0 flex-nowrap justify-center gap-7 overflow-hidden py-1 select-none">
                {checkboxes.map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "cursor-pointer text-xs font-medium",
                      checked.includes(i)
                        ? "text-linearpurple font-extrabold"
                        : "text-muted hover:text-foreground",
                    )}
                    onClick={() => {
                      if (checked.includes(i)) {
                        setChecked(checked.filter((item) => item !== i));
                      } else {
                        setChecked([...checked, i]);
                      }
                    }}
                  >
                    {i}
                  </div>
                ))}
              </div>
            </>
          )}
          {selectedTab === "dinhgiathitruong" && <DinhGiaThiTruongScreen />}
          {selectedTab === "tongquan" && <TabTongQuan />}
          {selectedTab === "taichinh" && <TabPhanTichTaiChinh />}
          {selectedTab === "phantichkythuat" && <TabPhanTichKyThuat />}
          {/* {selectedTab === "baocaophantich" && <TabBaoCaoPhanTich />} */}
          {selectedTab === "hoso" && <TabThongTinDoanhNghiep />}
          {selectedTab === "tintucsukien" && <TabTinTucSuKien />}
        </Suspense>
      </div>
    </div>
  );
}

function TabTongQuan() {
  const [expanded, setExpanded] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const { symbol } = useChiTietMaCK();

  const { data: dataNhanDinhChuyenGia, isLoading: isLoadingNhanDinhChuyenGia } =
    useFINSCNhanDinhChuyenGia(symbol);
  const { data: dataShareHolders } = useDNSEShareHolders(symbol);
  const { data } = useMarketOverviewData();
  const { data: muabanchudong } = useMuaBanChuDong(symbol);
  const { data: filterProData } = useFilterProData();
  const filterProDataSymbol = useMemo(() => {
    return filterProData?.find((item) => item.MA === symbol);
  }, [filterProData, symbol]);

  const [selectedTab, setSelectedTab] = useState("10phien");

  const scrollDiv = useRef<HTMLDivElement>(null);

  const symbolData = useMemo(
    () => data?.find((item) => item.code === symbol),
    [data, symbol],
  );

  useEffect(() => {
    const div = scrollDiv.current;
    if (div) {
      // Check if the div is scrollable
      setIsScrollable(div.scrollHeight > div.clientHeight);
    } else {
      setIsScrollable(false);
    }
    setExpanded(false);
  }, [symbol]);

  const tyLeCoDac = useMemo(() => {
    if (!dataShareHolders) return {};
    const holders = dataShareHolders.shareHolders;
    if (!holders) return {};

    return {
      ratio: holders.reduce((acc, cur) => acc + cur.ratio, 0),
      value: holders.reduce((acc, cur) => acc + cur.value, 0),
    };
  }, [dataShareHolders]);
  const muaBanChuDongStats = useMemo(() => {
    if (!muabanchudong) return {};
    const data = muabanchudong[0];
    if (!data) return {};

    return {
      mua: data.Buy,
      ban: data.Sell,
      muaPercent: data.Buy / data.Sum,
      banPercent: data.Sell / data.Sum,
    };
  }, [muabanchudong]);

  return (
    <div className="no-scrollbar overflow-scroll">
      <div className="grid min-h-fit w-full grid-cols-2 gap-7 text-sm">
        <div className="h-fit shrink-0 sm:min-h-[250px]">
          <div className="mb-4 font-semibold">Tổng quan</div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="text-muted">Tham chiếu - Mở cửa</div>
              <div className="text-green font-bold">
                <span className="text-yellow">
                  {formatPrice(symbolData?.referPrice)}
                </span>{" "}
                - {formatPrice(symbolData?.openPrice)}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted">Cao nhất - Thấp nhất</div>
              <div
                className={cn(
                  "text-green font-bold",
                  symbolData?.highPrice === symbolData?.ceiling
                    ? "text-purple"
                    : "",
                )}
              >
                {formatPrice(symbolData?.highPrice)} -{" "}
                <span
                  className={cn(
                    "text-red",
                    symbolData?.lowPrice === symbolData?.floor
                      ? "text-floor"
                      : "",
                  )}
                >
                  {formatPrice(symbolData?.lowPrice)}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted">P/E</div>
              <div className="font-bold">{symbolData?.pe?.toFixed(2)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted">P/B</div>
              <div className="font-bold">{symbolData?.pb?.toFixed(2)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted">Vốn hóa</div>
              <div className="font-bold">
                {formatVeryLargeNumber(symbolData?.marketCap)}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-muted flex items-center gap-2">
                Tỷ lệ cổ phiếu cô đặc{" "}
                <Tooltip
                  content={
                    "Số cổ phiếu có tỷ lệ nắm giữ phần lớn thuộc các cổ đông nội bộ hay cổ đông chiến lược."
                  }
                  placement="top"
                  className="max-w-[200px]"
                >
                  <InfoCircle size={16} iconStyle="Broken" />
                </Tooltip>
              </div>
              <div className="font-bold">
                {tyLeCoDac.value
                  ? `${formatNumber(tyLeCoDac.value / 1000000, 2)} triệu cp (${formatNumber(tyLeCoDac.ratio, 1)}%)`
                  : ""}
              </div>
            </div>
            {/* <div className="flex items-center justify-between">
              <div className="text-muted">Khuyến nghị từ CTCK</div>
              <div className="badge-green">Mua</div>
            </div> */}
            <div className="flex items-center justify-between">
              <div className="text-muted">AI Trend</div>
              {filterProDataSymbol?.AiTrend === "Uptrend" ? (
                <div className="badge-green">Uptrend</div>
              ) : filterProDataSymbol?.AiTrend === "Downtrend" ? (
                <div className="badge-red">Downtrend</div>
              ) : (
                <div className="badge-yellow">Sideway</div>
              )}
            </div>
            <div className="flex justify-between">
              <div className="text-muted">Mẫu hình kỹ thuật</div>
              {filterProDataSymbol?.pattern && (
                <div className="flex flex-col items-end gap-1">
                  <div className="font-bold">{filterProDataSymbol.pattern}</div>
                  <div className="text-muted/70 text-xs">
                    (
                    {
                      MAU_HINH_PATTERN.find((item) =>
                        item.includes.some(
                          (p) => p === filterProDataSymbol.pattern,
                        ),
                      )?.label
                    }
                    )
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex h-fit shrink-0 flex-col gap-2",
            expanded
              ? "no-schrollbar overflow-auto"
              : "max-h-[250px] overflow-hidden",
          )}
          ref={scrollDiv}
        >
          <div className="no-scrollbar shrink-0 overflow-auto text-sm font-semibold">
            Nhận định
          </div>
          {isLoadingNhanDinhChuyenGia ? (
            <DefaultLoader />
          ) : dataNhanDinhChuyenGia ? (
            <>
              <div className="text-lineargreen flex shrink-0 items-center gap-2 text-sm font-semibold">
                Góc nhìn chuyên gia ({dataNhanDinhChuyenGia.d}){" "}
                <img src="/slidingStar.svg" />
              </div>
              <div className={cn("relative text-sm")}>
                <div>{dataNhanDinhChuyenGia.reason}</div>
                {isScrollable && !expanded && (
                  <div
                    className="bg-card text-purple absolute right-0 bottom-0 z-10! cursor-pointer text-sm font-medium dark:text-[#67E1C0] hover:dark:text-[#abf5e1]"
                    onClick={() => setExpanded(true)}
                  >
                    ... Xem thêm
                  </div>
                )}
                {expanded && (
                  <div
                    className="bg-card text-purple cursor-pointer pt-2 text-sm font-medium dark:text-[#67E1C0] hover:dark:text-[#abf5e1]"
                    onClick={() => setExpanded(false)}
                  >
                    Thu gọn
                  </div>
                )}
              </div>
            </>
          ) : (
            <DefaultNodata text="Chưa có nhận định" />
          )}
        </div>
        <div className="flex min-h-[180px] flex-col justify-center">
          <div className="mb-2 font-semibold">Mua bán chủ động</div>
          <div className="flex flex-1 items-center gap-2">
            <MuaBanChuDongBarChart symbol={symbol} />
          </div>
        </div>
        <div className="flex min-h-[250px] shrink-0 flex-col">
          <div className="flex items-start justify-between">
            <div className="text-sm font-semibold">NN mua ròng (tỷ)</div>
            <Tabs
              classNames={{
                tabList: "flex-1 bg-content1 p-1 rounded-[4px]",
                cursor: "bg-background! rounded-[4px]",
                tab: "text-sm py-0 h-6",
                panel: "h-full flex flex-col overflow-hidden",
              }}
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
            >
              <Tab key="10phien" title="10 phiên"></Tab>
              <Tab key="1nam" title="1 năm"></Tab>
            </Tabs>
          </div>
          {selectedTab === "10phien" ? (
            <NNMuaRong10PhienBarChart symbol={symbol} />
          ) : (
            <NNYTDStockBarChart symbol={symbol} />
          )}
        </div>
      </div>
    </div>
  );
}
