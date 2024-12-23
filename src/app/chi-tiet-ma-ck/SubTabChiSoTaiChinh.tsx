import PhanTichTaiChinhBarChart from "@/components/charts/ChiSoTaiChinhComplexChart";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import useCanDoiKeToanData from "@/hooks/useCanDoiKeToanData";
import useChiTietMaCK from "@/hooks/useChiTietMaCK";
import useKetQuaKinhDoanhData from "@/hooks/useKetQuaKinhDoanhData";
import Documents from "@/icons/Documents";
import { formatNumber } from "@/lib/utils";
import { Accordion, AccordionItem, Tab } from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import { Fragment, use, useEffect, useMemo, useRef, useState } from "react";
import {
  Chart,
  DoubleAltArrowLeft,
  DoubleAltArrowRight,
  GraphNew,
  Scale,
} from "solar-icon-set";

export default function SubTabChiSoTaiChinh() {
  const [selectedTime, setSelectedTime] = useState<string>("hangquy");
  const [selectedTab, setSelectedTab] = useState<string>("chart");

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-muted">Đơn vị: </div>
          <div className="text-sm font-semibold">Tỷ VND</div>
        </div>
        <div className="flex items-center gap-3">
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
        </div>
      </div>
      <div className="flex-1">
        {selectedTab === "chart" && <SubTabChart selectedTime={selectedTime} />}
        {selectedTab === "data" && <SubTabData selectedTime={selectedTime} />}
      </div>
    </div>
  );
}

const dataConfig = [
  {
    key: "tangtruongketquakinhdoanh",
    name: "Tăng trưởng kết quả kinh doanh",
    children: [
      {
        key: "revenue",
        name: "Doanh thu thuần",
        type: "bar",
      },
      {
        key: "grossProfit",
        name: "Lợi nhuận gộp",
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
        formatLabel: (value: any) =>
          value ? `${formatNumber(value * 100, 2)}%` : "-",
      },
      {
        key: "yearShareHolderIncomeGrowth",
        name: "Tăng trưởng LNST YoY",
        type: "line",
        formatLabel: (value: any) =>
          value ? `${formatNumber(value * 100, 2)}%` : "-",
      },
      {
        key: "grossProfit/revenue",
        name: "Biên lợi nhuận gộp",
        type: "line",
        getData: (item: any) => (100 * item["grossProfit"]) / item["revenue"],
        formatLabel: (value: any) =>
          value ? `${formatNumber(value, 2)}%` : "-",
      },
      {
        key: "postTaxProfit/revenue",
        name: "Biên lợi nhuận ròng",
        type: "line",
        getData: (item: any) => (100 * item["postTaxProfit"]) / item["revenue"],
        formatLabel: (value: any) =>
          value ? `${formatNumber(value, 2)}%` : "-",
      },
    ],
  },
  {
    key: "phantichnguonvon",
    name: "Phân tích nguồn vốn",
    children: [
      {
        key: "asset",
        name: "Tổng nguồn vốn",
        type: "bar",
        stack: "a",
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
    children: [
      {
        key: "asset",
        name: "Tổng nguồn vốn",
        type: "bar",
        stack: "a",
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
        name: "Tiền/Tổng tài sản",
        type: "line",
        getData: (item: any) =>
          ((item["cash"] + item["shortInvest"]) * 100) / item["asset"],
        formatLabel: (value: any) =>
          value ? `${formatNumber(value, 2)}%` : "-",
      },
    ],
  },
];

const statsGroup = [
  {
    title: "Định giá và sinh lời",
    children: ["P/E", "P/B", "ROE", "CASA", "VỐN HÓA"],
  },
  {
    title: "Tăng trưởng",
    children: [
      "Tăng trưởng TN lãi thuần",
      "Tăng trưởng LNST",
      "Tăng trưởng tín dụng",
      "Tăng trưởng tổng tài sản",
    ],
  },
  {
    title: "Hiệu quả hoạt động",
    children: ["COF - Chi phí vốn", "NIM", "YOEA"],
  },
  {
    title: "An toàn vốn",
    children: ["Tỷ lệ nợ xấu (%)", "Tỷ lệ bao phủ nợ xấu (%)"],
  },
];

function SubTabData({ selectedTime }: { selectedTime: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { symbol } = useChiTietMaCK();
  const yearly = selectedTime !== "hangquy";
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
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft + (direction === "left" ? -400 : 400), // Adjust the value as needed
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
    <div className="no-scrollbar h-full overflow-auto text-md">
      <div className="flex h-fit w-full justify-between gap-2">
        <div className="mt-7 flex h-fit flex-shrink-0 flex-col">
          {dataConfig.map((group) => (
            <Fragment key={group.key}>
              <div
                className="text-lineargreen mt-4 h-[44px] text-md font-semibold uppercase"
                key={group.key}
              >
                {group.name}
              </div>
              {group.children.map((item) => (
                <div className="h-[44px] font-semibold" key={item.key}>
                  {item.name}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
        <div className="flex flex-1 justify-center gap-2">
          <div className="flex-shrink-0">
            <div
              className="cursor-pointer text-muted hover:text-white"
              onClick={() => handleScrollClick("left")}
            >
              <DoubleAltArrowLeft size={24} />
            </div>
          </div>
          <div className="no-scrollbar flex w-[800px] overflow-auto" ref={ref}>
            <div className="flex w-fit min-w-full justify-center">
              {combinedData.map((item: any) => (
                <div
                  key={item.year.toString() + item.quarter.toString()}
                  className="flex w-[100px] flex-shrink-0 flex-col text-right text-md font-semibold"
                >
                  <div>
                    {yearly
                      ? item.year.toString()
                      : `Q${item.quarter}/${item.year}`}
                  </div>
                  {dataConfig.map((group: any, index: number) => (
                    <Fragment key={index}>
                      <div className="mt-4 h-[44px]"></div>
                      {group.children.map((config: any, index: number) => (
                        <div className="h-[44px] font-medium" key={index}>
                          {config.formatLabel
                            ? config.formatLabel(
                                item[config.key as string] ||
                                  config.getData?.(item) ||
                                  "",
                              )
                            : formatNumber(
                                item[config.key as string] ||
                                  config.getData?.(item) ||
                                  "",
                              )}
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
              ))}
              {/* {combinedData.map((item) => (
                <Fragment key={item}>
                  <div className="flex w-[100px] flex-shrink-0 flex-col text-md font-semibold">
                    <div>{item}</div>
                    {statsGroup.map((group: any, index: number) => (
                      <Fragment key={index}>
                        <div className="mt-4 h-[44px]"></div>
                        {group.children.map((_: any, index: number) => (
                          <div className="h-[44px] font-medium" key={index}>
                            5.3
                          </div>
                        ))}
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              ))} */}
            </div>
          </div>
          <div className="flex-shrink-0">
            <div
              className="cursor-pointer text-muted hover:text-white"
              onClick={() => handleScrollClick("right")}
            >
              <DoubleAltArrowRight size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubTabChart({ selectedTime }: { selectedTime: string }) {
  const [selectedChart, setSelectedChart] = useState<Set<string>>(
    new Set(["tangtruongketquakinhdoanh"]),
  );

  return (
    <div className="flex h-full gap-3">
      <div className="flex flex-1 flex-col gap-2 rounded-[8px] border border-neutral-800 p-2">
        <div className="flex items-center justify-between">
          <div className="text-caption">Kết quả so sánh</div>
          <div className="flex items-center gap-2 text-muted">
            <Scale size={24} />
          </div>
        </div>
        <div className="flex flex-1">
          <PhanTichTaiChinhBarChart
            yearly={selectedTime !== "hangquy"}
            selectedChart={Array.from(selectedChart)[0]}
          />
        </div>
      </div>
      <div className="no-scrollbar flex max-w-[320px] flex-1 flex-col gap-2 overflow-auto rounded-[8px] border border-neutral-800 p-2">
        <div className="text-caption">Chỉ số tài chính</div>
        <div className="px-2 py-5">
          <Accordion
            className="!px-0"
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
          </Accordion>
        </div>
      </div>
    </div>
  );
}
