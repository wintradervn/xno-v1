import PhanTichTaiChinhBarChart from "@/components/charts/ChiSoTaiChinhComplexChart";
import Tabs from "@/components/ui/Tabs";
import useCanDoiKeToanData from "@/hooks/useCanDoiKeToanData";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useIsMobile from "@/hooks/useIsMobile";
import useKetQuaKinhDoanhData from "@/hooks/useKetQuaKinhDoanhData";
import Documents from "@/icons/Documents";
import { DANH_SACH_MA_NGAN_HANG } from "@/lib/constant";
import { cn, formatNumber } from "@/lib/utils";
import { Tab } from "@heroui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Banknote2,
  BillList,
  Chart,
  DoubleAltArrowLeft,
  DoubleAltArrowRight,
  GraphNew,
  TagPrice,
  TicketSale,
  Wallet,
} from "solar-icon-set";

export default function SubTabChiSoTaiChinh() {
  const [selectedTime, setSelectedTime] = useState<string>("hangquy");
  const [selectedTab, setSelectedTab] = useState<string>("chart");

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex shrink-0 justify-between">
        <div className="hidden items-center gap-2 sm:flex">
          <div className="text-muted text-xs font-medium">Đơn vị: </div>
          <div className="text-sm font-semibold">Tỷ VND</div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-normal">
          <Tabs
            color="default"
            classNames={{
              tabList: "p-0.5 rounded-[6px]",
              tab: "h-[26px] rounded-[4px] text-sm",
              cursor: "rounded-[4px]",
            }}
            selectedKey={selectedTime}
            onSelectionChange={(k) => setSelectedTime(k as string)}
          >
            <Tab key="hangquy" title="Hàng quý"></Tab>
            <Tab key="hangnam" title="Hàng năm"></Tab>
          </Tabs>
          <Tabs
            color="primary"
            classNames={{
              tabList: "p-0.5 rounded-[6px]",
              tab: "h-[26px] rounded-[4px] px-2",
              cursor: "rounded-[4px]",
            }}
            selectedKey={selectedTab}
            onSelectionChange={(k) => setSelectedTab(k as string)}
          >
            <Tab key="chart" title={<Chart />}></Tab>
            <Tab key="data" title={<Documents />}></Tab>
          </Tabs>
        </div>
      </div>
      <div className="flex-1 sm:order-2">
        {selectedTab === "chart" && <SubTabChart selectedTime={selectedTime} />}
        {selectedTab === "data" && <SubTabData selectedTime={selectedTime} />}
      </div>
    </div>
  );
}

const dataConfig = [
  {
    key: "tangtruongketquakinhdoanh",
    name: "Tăng trưởng KQKD",
    icon: (isMobile: boolean) => (
      <BillList size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "revenue",
        name: "Doanh thu thuần",
        type: "bar",
      },
      {
        key: "postTaxProfit",
        name: "LNST",
        type: "bar",
      },
      {
        key: "yearRevenueGrowth",
        name: "Tăng trưởng Doanh thu YoY",
        type: "line",
        getData: (item: any) => item["yearRevenueGrowth"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "yearShareHolderIncomeGrowth",
        name: "Tăng trưởng LNST YoY",
        type: "line",
        getData: (item: any) => item["yearShareHolderIncomeGrowth"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
    ],
  },
  {
    key: "phantichnguonvon",
    name: "Phân tích nguồn vốn",
    icon: (isMobile: boolean) => (
      <TagPrice size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "asset",
        name: "Tổng nguồn vốn",
        type: "bar",
        hidden: true,
      },
      {
        key: "shortDebt+longDebt",
        name: "Nợ vay",
        type: "bar",
        stack: "a",
        getData: (item: any) => item["shortDebt"] + item["longDebt"],
      },
      {
        key: "capital",
        name: "Vốn góp",
        type: "bar",
        stack: "a",
      },
      {
        key: "unDistributedIncome",
        name: "LN chưa phân phối",
        type: "bar",
        stack: "a",
      },
      {
        key: "debt-shortDebt-longDebt",
        name: "Nợ chiếm dụng",
        type: "bar",
        stack: "a",
        getData: (item: any) =>
          item["debt"] - item["shortDebt"] - item["longDebt"],
      },
      {
        key: "minorShareHolderProfit",
        name: "LN cổ đông không kiểm soát",
        type: "bar",
        stack: "a",
      },
      {
        key: "shortDebt+longDebt/asset",
        name: "Nợ vay/Tổng nguồn vốn (%)",
        type: "line",
        getData: (item: any) =>
          ((item["shortDebt"] + item["longDebt"]) * 100) / item["asset"],
        formatLabel: (value: any) =>
          value ? `${formatNumber(value, 2)}%` : "-",
      },
    ],
  },
  {
    key: "phantichtaisan",
    name: "Phân tích tài sản",
    icon: (isMobile: boolean) => (
      <TicketSale size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "asset",
        name: "Tổng tài sản",
        type: "bar",
        hidden: true,
      },
      {
        key: "cash+longDebt",
        name: "Tiền + Gửi bank",
        type: "bar",
        stack: "a",
        getData: (item: any) => item["cash"] + item["shortInvest"],
      },
      {
        key: "shortRecaivable",
        name: "Phải thu ngắn hạn",
        type: "bar",
        stack: "a",
      },
      {
        key: "inventory",
        name: "Tồn kho",
        type: "bar",
        stack: "a",
      },
      {
        key: "fixedAsset",
        name: "Tài sản cố định",
        type: "bar",
        stack: "a",
      },
      {
        key: "longAsset",
        name: "Tài sản dài hạn",
        type: "bar",
        stack: "a",
      },
      {
        key: "stockInvest",
        name: "Đầu tư chứng khoán",
        type: "bar",
        stack: "a",
      },
      {
        key: "otherAsset",
        name: "Tài sản khác",
        type: "bar",
        stack: "a",
      },
      {
        key: "cash+shortInvest/asset",
        name: "Tiền và tương đương tiền/TTS",
        type: "line",
        getData: (item: any) =>
          ((item["cash"] + item["shortInvest"]) * 100) / item["asset"],
        formatLabel: (value: any) =>
          value ? `${formatNumber(value, 2)}%` : "-",
      },
    ],
  },
  {
    key: "hieuquasinhloi",
    dataset: "financialratio",
    name: "Hiệu quả sinh lời",
    icon: (isMobile: boolean) => (
      <Banknote2 size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "priceToEarning",
        name: "PE",
        type: "bar",
        getData: (item: any) => item["priceToEarning"],
        formatLabel: (value: any) => `${formatNumber(value, 1)}`,
      },
      {
        key: "priceToBook",
        name: "PB",
        type: "bar",
        getData: (item: any) => item["priceToBook"],
        formatLabel: (value: any) => `${formatNumber(value, 1)}`,
      },
      {
        key: "roe",
        name: "ROE",
        type: "line",
        getData: (item: any) => item["roe"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "roa",
        name: "ROA",
        type: "line",
        getData: (item: any) => item["roa"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
    ],
  },
  {
    key: "suckhoetaichinh",
    name: "Sức khoẻ tài chính",
    dataset: "balancesheet",
    icon: (isMobile: boolean) => (
      <Wallet size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "Tiền và tương đương tiền/nợ vay",
        name: "Tiền và tương đương tiền/nợ vay",
        type: "line",
        getData: (item: any) =>
          item["shortDebt"] + item["longDebt"] > 0
            ? ((item["cash"] + item["shortInvest"]) * 100) /
              (item["shortDebt"] + item["longDebt"])
            : 0,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "Nợ vay/VCSH (D/E)",
        name: "Nợ vay/VCSH (D/E)",
        type: "line",
        getData: (item: any) =>
          item["equity"]
            ? ((item["shortDebt"] + item["longDebt"]) * 100) / item["equity"]
            : 0,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "Nợ vay/Tổng tài sản",
        name: "Nợ vay/Tổng tài sản",
        type: "line",
        getData: (item: any) =>
          item["asset"]
            ? ((item["shortDebt"] + item["longDebt"]) * 100) / item["asset"]
            : 0,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
    ],
  },
];

const bankConfig = [
  {
    key: "tangtruongketquakinhdoanh",
    name: "Tăng trưởng KQKD",
    icon: (isMobile: boolean) => (
      <BillList size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "revenue",
        name: "Doanh thu thuần",
        type: "bar",
      },
      {
        key: "postTaxProfit",
        name: "LNST",
        type: "bar",
      },
      {
        key: "yearRevenueGrowth",
        name: "Tăng trưởng Doanh thu YoY",
        type: "line",
        getData: (item: any) => item["yearRevenueGrowth"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "yearShareHolderIncomeGrowth",
        name: "Tăng trưởng LNST YoY",
        type: "line",
        getData: (item: any) => item["yearShareHolderIncomeGrowth"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      // {
      //   key: "postTaxProfit/revenue",
      //   name: "Biên lợi nhuận ròng",
      //   type: "line",
      //   getData: (item: any) => (100 * item["postTaxProfit"]) / item["revenue"],
      //   formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      // },
    ],
  },
  {
    key: "phanTichNguonVon",
    dataset: "balancesheet",
    name: "Phân tích nguồn vốn",
    icon: (isMobile: boolean) => (
      <TagPrice size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "asset",
        name: "Tổng nguồn vốn",
        type: "bar",
        hidden: true,
      },
      {
        key: "deposit",
        name: "Tiền gửi KH",
        type: "bar",
        stack: "a",
      },
      {
        key: "oweOtherBank+otherBankCredit",
        name: "Tiền G&V ngân hàng khác",
        type: "bar",
        stack: "a",
        getData: (item: any) => item["oweOtherBank"] + item["otherBankCredit"],
      },
      {
        key: "oweCentralBank",
        name: "Nợ Ngân hàng Trung ương",
        type: "bar",
        stack: "a",
      },
      {
        key: "valuablePaper",
        name: "Phát hành giấy tờ có giá",
        type: "bar",
        stack: "a",
      },
      {
        key: "capital",
        name: "Vốn điều lệ",
        type: "bar",
        stack: "a",
      },
      {
        key: "unDistributedIncome+fund",
        name: "LNCPP, các Quỹ",
        type: "bar",
        stack: "a",
        getData: (item: any) => item["unDistributedIncome"] + item["fund"],
      },
      {
        key: "deposit/deposit",
        name: "Tăng trưởng huy động",
        type: "line",
        stack: "a",
        getData: (item: any, index: number, data: any) =>
          data[index - 1]?.["deposit"]
            ? (100 * (item["deposit"] - data[index - 1]["deposit"])) /
              data[index - 1]["deposit"]
            : null,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
    ],
  },
  {
    key: "phanTichTaiSan",
    dataset: "balancesheet",
    name: "Phân tích tài sản",
    icon: (isMobile: boolean) => (
      <TicketSale size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "asset",
        name: "Tổng tài sản",
        type: "bar",
        hidden: true,
      },
      {
        key: "cash",
        name: "TM, vàng bạc đá quý",
        type: "bar",
        stack: "a",
      },
      {
        key: "centralBankDeposit",
        name: "Tiền gửi tại NHNN",
        type: "bar",
        stack: "a",
      },
      {
        key: "otherBankDeposit+otherBankLoan",
        name: "G&V TCTD khác",
        type: "bar",
        stack: "a",
        getData: (item: any) =>
          item["otherBankDeposit"] + item["otherBankLoan"],
      },
      {
        key: "stockInvest",
        name: "CK đầu tư",
        type: "bar",
        stack: "a",
      },
      {
        key: "netCustomerLoan",
        name: "Cho vay KH",
        type: "bar",
        stack: "a",
      },
      {
        key: "netCustomerLoan2",
        name: "Tăng trưởng tín dụng",
        type: "line",
        getData: (item: any, index: number, data: any) =>
          data[index - 1]?.["netCustomerLoan"]
            ? (100 *
                (item["netCustomerLoan"] -
                  data[index - 1]["netCustomerLoan"])) /
              data[index - 1]["netCustomerLoan"]
            : null,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
    ],
  },
  {
    key: "tisuatsinhloi",
    dataset: "financialratio",
    name: "Tỉ suất sinh lời",
    icon: (isMobile: boolean) => (
      <BillList size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "interestMargin",
        name: "Biên lãi thuần (NIM)",
        type: "line",
        getData: (item: any) => item["interestMargin"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "costToIncome",
        name: "Tỷ lệ thu nhập chi phí (CIR)",
        type: "line",
        getData: (item: any) => item["costToIncome"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "costOfFinancing",
        name: "Chi phí vốn huy động (COF)",
        type: "line",
        getData: (item: any) => item["costOfFinancing"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
    ],
  },
  {
    key: "hieuquasinhloi",
    dataset: "financialratio",
    name: "Hiệu quả sinh lời",
    icon: (isMobile: boolean) => (
      <Banknote2 size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "priceToEarning",
        name: "PE",
        type: "bar",
        getData: (item: any) => item["priceToEarning"],
        formatLabel: (value: any) => `${formatNumber(value, 1)}`,
      },
      {
        key: "priceToBook",
        name: "PB",
        type: "bar",
        getData: (item: any) => item["priceToBook"],
        formatLabel: (value: any) => `${formatNumber(value, 1)}`,
      },
      {
        key: "roe",
        name: "ROE",
        type: "line",
        getData: (item: any) => item["roe"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "roa",
        name: "ROA",
        type: "line",
        getData: (item: any) => item["roa"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
    ],
  },
  {
    key: "tilenoxau",
    dataset: "financialratio",
    name: "Tỷ lệ nợ xấu (NPL) & tỷ lệ bao phủ nợ xấu (LLR)",
    icon: (isMobile: boolean) => (
      <Wallet size={isMobile ? 20 : 24} iconStyle="Bold" />
    ),
    children: [
      {
        key: "provisionOnBadDebt",
        name: "Tỷ lệ bao phủ nợ xấu",
        type: "line",
        getData: (item: any) => item["provisionOnBadDebt"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
      {
        key: "badDebtPercentage",
        name: "Tỷ lệ nợ xấu",
        type: "line",
        getData: (item: any) => item["badDebtPercentage"] * 100,
        formatLabel: (value: any) => `${formatNumber(value, 2)}%`,
      },
    ],
  },
];

function SubTabData({ selectedTime }: { selectedTime: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { symbol } = useChiTietMaCK();
  const yearly = selectedTime !== "hangquy";
  const isMobile = useIsMobile();
  const isBank = DANH_SACH_MA_NGAN_HANG.includes(symbol);

  const config = isBank ? bankConfig : dataConfig;

  const { data } = useKetQuaKinhDoanhData(symbol, yearly);
  const { data: data2 } = useCanDoiKeToanData(symbol, yearly);
  const combinedData = useMemo(() => {
    if (!data || !data2) return [];
    const firstData = data.length >= data2.length ? data : data2;
    const secondData = data.length >= data2.length ? data2 : data;

    return firstData.map((item) => {
      const secondItem = secondData.find(
        (_) => _.year === item.year && _.quarter === item.quarter,
      );
      return {
        ...item,
        ...secondItem,
      };
    });
  }, [data, data2]);

  const handleScrollClick = (direction: "left" | "right") => {
    const slideRange = isMobile ? 140 : 400;
    if (ref.current) {
      ref.current.scrollTo({
        left:
          ref.current.scrollLeft +
          (direction === "left" ? -slideRange : slideRange), // Adjust the value as needed
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (ref.current && combinedData) {
      ref.current.scrollLeft = 9999;
    }
  }, [combinedData]);

  return (
    <div className="no-scrollbar sm:text-md h-full overflow-auto text-sm">
      <div className="flex h-fit w-full justify-between gap-2">
        <div className="mt-5 flex h-fit max-w-[200px] shrink-0 flex-col">
          {config.map((group) => (
            <Fragment key={group.key}>
              <div
                className="text-lineargreen sm:text-md mt-2 line-clamp-1 h-[44px] max-w-[200px] overflow-hidden text-sm font-semibold text-nowrap text-ellipsis uppercase sm:mt-4"
                key={group.key}
              >
                {group.name}
              </div>
              {group.children.map((item) => (
                <div
                  className="sm:text-md h-[44px] text-sm font-semibold"
                  key={item.key}
                >
                  {item.name}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
        <div className="flex flex-1 justify-center gap-1 sm:gap-2">
          <div className="shrink-0">
            <div
              className="text-muted hover:text-foreground cursor-pointer"
              onClick={() => handleScrollClick("left")}
            >
              <DoubleAltArrowLeft size={isMobile ? 16 : 24} />
            </div>
          </div>
          <div
            className="no-scrollbar flex w-[560px] overflow-auto sm:w-[800px]"
            ref={ref}
          >
            <div className="flex w-fit min-w-full justify-center">
              {combinedData.map((item: any, index: any) => (
                <div
                  key={item.year.toString() + item.quarter.toString()}
                  className="sm:text-md flex w-[70px] shrink-0 flex-col text-right text-sm font-semibold sm:w-[100px]"
                >
                  <div>
                    {yearly
                      ? item.year.toString()
                      : `Q${item.quarter}/${item.year}`}
                  </div>
                  {config.map((group: any, index: number) => (
                    <Fragment key={index}>
                      <div className="mt-4 h-[44px]"></div>
                      {group.children.map((config: any, index: number) => (
                        <div className="h-[44px] font-medium" key={index}>
                          {config.formatLabel
                            ? config.formatLabel(
                                item[config.key as string] ||
                                  config.getData?.(item, index, combinedData) ||
                                  "",
                              )
                            : formatNumber(
                                item[config.key as string] ||
                                  config.getData?.(item, index, combinedData) ||
                                  "",
                              )}
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <div
              className="text-muted hover:text-foreground cursor-pointer"
              onClick={() => handleScrollClick("right")}
            >
              <DoubleAltArrowRight size={isMobile ? 16 : 24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubTabChart({ selectedTime }: { selectedTime: string }) {
  const [selectedChart, setSelectedChart] = useState<string>(
    "tangtruongketquakinhdoanh",
  );
  const { symbol } = useChiTietMaCK();
  const isMobile = useIsMobile();
  const isBank = DANH_SACH_MA_NGAN_HANG.includes(symbol);

  const config = isBank ? bankConfig : dataConfig;

  const chartConfig = useMemo(
    () => config.find((item) => item.key === selectedChart),
    [selectedChart, config],
  );

  return (
    <div className="flex h-full flex-col gap-3 sm:flex-row">
      <div className="border-background order-2 flex flex-1 flex-col gap-2 rounded-[8px] border p-2 sm:order-1 dark:border-neutral-800">
        {/* <div className="flex items-center justify-between">
          <div className="text-caption">Kết quả so sánh</div>
          <div className="flex items-center gap-2 text-muted">
            <Scale size={24} />
          </div>
        </div> */}
        <div className="flex flex-1">
          <PhanTichTaiChinhBarChart
            yearly={selectedTime !== "hangquy"}
            chartConfig={chartConfig}
          />
        </div>
      </div>
      <div className="no-scrollbar border-background order-1 flex flex-1 flex-col gap-2 overflow-auto rounded-[8px] border p-2 sm:order-2 sm:max-w-[260px] dark:border-neutral-800">
        <div className="text-caption">Chỉ số tài chính</div>
        <div className="flex flex-col gap-1 sm:gap-2 sm:py-5">
          {config.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                setSelectedChart(item.key);
              }}
              className={cn(
                "sm:text-md relative flex cursor-pointer items-center gap-3 rounded-[8px] p-2 text-sm sm:p-3",
                selectedChart === item.key
                  ? "bg-background"
                  : "hover:bg-content1/80 border-transparent",
              )}
            >
              <div
                className={cn(
                  "absolute top-0 left-0 h-full w-[15px] rounded-[8px] border-l-2 bg-transparent transition-all",
                  selectedChart === item.key
                    ? "border-[#67E1C0]"
                    : "border-transparent",
                )}
              ></div>
              {item.icon ? (
                item.icon(isMobile)
              ) : (
                <GraphNew iconStyle="Bold" size={isMobile ? 20 : 24} />
              )}
              {item.name}
            </div>
          ))}
          {/* <Accordion
            className="px-0!"
            showDivider={false}
            itemClasses={{
              trigger:
                "data-[open=true]:bg-content1 px-2 rounded-[12px] border-l-2 border-transparent data-[open=true]:border-[#67E1C0] transition-all",
              content: "p-4",
            }}
            selectionMode="single"
            selectedKeys={selectedChart}
          >
            {dataConfig.map((item) => (
              <AccordionItem
                title={
                  <div className="flex items-center gap-2 text-md font-medium">
                    <GraphNew iconStyle="Bold" size={24} />
                    {item.name}
                  </div>
                }
                indicator={
                  <ChevronDown style={{ transform: "rotate(90deg)" }} />
                }
                key={item.key}
                onPress={() => {
                  setSelectedChart(new Set([item.key]));
                }}
              >
                <div className="flex flex-col gap-6">
                  {item.children.map((child, index: number) => (
                    <div
                      className="text-lineargreen flex items-center gap-2 text-sm font-medium"
                      key={child.key + index}
                    >
                      <div className="bg-lineargreen h-2 w-2 rounded-full"></div>
                      <div>{child.name}</div>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            ))}
          </Accordion> */}
        </div>
      </div>
    </div>
  );
}
