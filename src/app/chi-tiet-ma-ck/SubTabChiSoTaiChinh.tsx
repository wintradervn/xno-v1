import PhanTichTaiChinhBarChart from "@/components/charts/PhanTichTaiChinhBarChart";
import Button from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Tabs from "@/components/ui/Tabs";
import Documents from "@/icons/Documents";
import { Accordion, AccordionItem, Tab } from "@nextui-org/react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Chart,
  DoubleAltArrowLeft,
  DoubleAltArrowRight,
  GraphNew,
  Scale,
} from "solar-icon-set";

export default function SubTabChiSoTaiChinh() {
  const [selectedTab, setSelectedTab] = useState("chart");

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-muted">Đơn vị: </div>
          <div className="text-sm font-semibold">Tỷ VND</div>
        </div>
        <div className="flex items-center gap-3">
          <Tabs
            color="default"
            classNames={{
              tabList: "p-0.5 rounded-[6px]",
              tab: "h-[26px] rounded-[4px] text-sm",
              cursor: "rounded-[4px]",
            }}
          >
            <Tab title="Hàng quý"></Tab>
            <Tab title="Hàng năm"></Tab>
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
      <div className="flex-1">
        {selectedTab === "data" ? <SubTabData /> : <SubTabChart />}
      </div>
    </div>
  );
}

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

const data = [
  "Q1/2021",
  "Q2/2021",
  "Q3/2021",
  "Q4/2021",
  "Q1/2022",
  "Q2/2022",
  "Q3/2022",
  "Q4/2022",
  "Q1/2023",
  "Q2/2023",
  "Q3/2023",
  "Q4/2023",
  "Q1/2024",
  "Q2/2024",
  "Q3/2024",
  "Q4/2024",
];

function SubTabData() {
  const ref = useRef<HTMLDivElement>(null);

  const handleScrollClick = (direction: "left" | "right") => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft + (direction === "left" ? -400 : 400), // Adjust the value as needed
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollLeft = 9999;
    }
  }, []);

  return (
    <div className="no-scrollbar h-full overflow-auto text-md">
      <div className="flex h-fit w-full justify-between gap-2">
        <div className="mt-7 flex h-fit flex-shrink-0 flex-col">
          {statsGroup.map((group) => (
            <Fragment key={group.title}>
              <div
                className="text-lineargreen mt-4 h-[44px] text-md font-semibold uppercase"
                key={group.title}
              >
                {group.title}
              </div>
              {group.children.map((item) => (
                <div className="h-[44px] font-semibold" key={item}>
                  {item}
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
              {data.map((item) => (
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
              ))}
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

function SubTabChart() {
  const renderContent = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-lineargreen flex items-center gap-2 text-sm font-medium">
          <div className="bg-lineargreen h-2 w-2 rounded-full"></div>
          <div>Tiền mặt và tương đương tiền</div>
        </div>
        <div className="text-lineargreen flex items-center gap-2 text-sm font-medium">
          <div className="bg-lineargreen h-2 w-2 rounded-full"></div>
          <div>Tiền mặt và tương đương tiền</div>
        </div>
        <div className="text-lineargreen flex items-center gap-2 text-sm font-medium">
          <div className="bg-lineargreen h-2 w-2 rounded-full"></div>
          <div>Tiền mặt và tương đương tiền</div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="ml-4">Tiền mặt và tương đương tiền</div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex h-full gap-3">
      <div className="flex flex-1 flex-col gap-2 rounded-[8px] border border-neutral-800 p-2">
        <div className="flex items-center justify-between">
          <div className="text-caption">Kết quả so sánh</div>
          <div className="flex items-center gap-2 text-muted">
            <Scale size={24} />
          </div>
        </div>
        <div>
          <Button
            className="rounded-[4px] text-sm font-semibold"
            color="secondary"
            size="sm"
          >
            So sánh với giá cổ phiếu
          </Button>
        </div>
        <div className="flex flex-1">
          <PhanTichTaiChinhBarChart />
        </div>
      </div>
      <div className="flex max-w-[320px] flex-1 flex-col gap-2 rounded-[8px] border border-neutral-800 p-2">
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
          >
            {[
              "Chỉ số giá",
              // "Khả năng thanh toán",
              // "Chỉ số thanh toán",
              // "Chỉ số định giá",
              // "Cơ cấu tài sản",
            ].map((item) => (
              <AccordionItem
                title={
                  <div className="flex items-center gap-2 text-md font-medium">
                    <GraphNew iconStyle="Bold" size={24} />
                    {item}
                  </div>
                }
                indicator={
                  <ChevronDown style={{ transform: "rotate(90deg)" }} />
                }
                key={item}
              >
                {renderContent()}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}