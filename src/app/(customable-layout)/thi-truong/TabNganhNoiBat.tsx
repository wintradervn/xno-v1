import useNganhNoiBatData from "@/hooks/useNganhNoiBatData";
import ChevronDown from "@/icons/ChevronDown";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, Tooltip } from "@nextui-org/react";
import { useMemo } from "react";

const data = [
  {
    name: "Bất động sản",
    value: 100,
    mr: 50,
    percent1Day: 10,
    percent1Week: 20,
    cashFlow: 30,
    children: [
      {
        name: "Khu công nghiệp",
        value: 100,
        mr: 50,
        percent1Day: 10,
        percent1Week: 20,
        cashFlow: 30,
      },
      {
        name: "Nhà thầu & Nguyên vật liệu",
        value: 100,
        mr: 50,
        percent1Day: 10,
        percent1Week: 20,
        cashFlow: 30,
      },
      {
        name: "Nhà ở",
        value: 100,
        mr: 50,
        percent1Day: 10,
        percent1Week: 20,
        cashFlow: 30,
      },
    ],
  },
  {
    name: "Ngân hàng",
    value: 200,
    mr: 100,
    percent1Day: 20,
    percent1Week: 30,
    cashFlow: 40,
  },
  {
    name: "Tiêu dùng",
    value: 300,
    mr: 150,
    percent1Day: 30,
    percent1Week: 40,
    cashFlow: 50,
  },
  {
    name: "Logistics",
    value: 400,
    mr: 200,
    percent1Day: 40,
    percent1Week: 50,
    cashFlow: 60,
  },
  {
    name: "Chứng khoán",
    value: 500,
    mr: 250,
    percent1Day: 50,
    percent1Week: 60,
    cashFlow: 70,
  },
  {
    name: "Dầu khí",
    value: 500,
    mr: 250,
    percent1Day: 50,
    percent1Week: 60,
    cashFlow: 70,
  },
];

const CashFlow = () => {
  return (
    <Tooltip
      content={
        <div className="flex flex-col text-sm text-muted">
          <div>
            Tăng giá: <span className="font-semibold text-green">365 tỷ</span>
          </div>
          <div>
            Giảm giá: <span className="font-semibold text-red">185 tỷ</span>
          </div>
          <div>
            Không đổi: <span className="font-semibold text-yellow">185 tỷ</span>
          </div>
        </div>
      }
      classNames={{
        content: "bg-background rounded-[4px]",
      }}
      showArrow
    >
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        <div className="h-full w-1/2 bg-green"></div>
        <div className="h-full w-1/4 bg-red"></div>
        <div className="h-full w-1/4 bg-yellow"></div>
      </div>
    </Tooltip>
  );
};

export default function TabNganhNoiBat() {
  const { data: hihi } = useNganhNoiBatData();
  const formatedData = useMemo(() => {
    const newData = [] as any;
    if (!hihi) return newData;

    newData.push(
      ...hihi
        ?.filter((item) => item.level === 1)
        .sort((a, b) => b.dayValue - a.dayValue)
        .map((item) => ({ ...item, stocks: undefined })),
    );

    hihi
      .filter((item) => item.level === 2)
      .forEach((item) => {
        const parentIndex = newData.findIndex(
          (parent: any) => parent.code === item.parentCode,
        );
        if (parentIndex < 0) return;
        if (!newData[parentIndex].children) newData[parentIndex].children = [];
        newData[parentIndex].children.push(item);
      });

    return newData;
  }, [hihi]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lineargreen font-semibold">Ngành nổi bật</div>
      <div className="flex flex-col gap-2">
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "1.5fr repeat(5,1fr) 1.5fr" }}
        >
          <div className="text-sm text-muted">Nhóm</div>
          <div className="text-right text-sm text-muted">Giá trị GD (tỷ)</div>
          <div className="text-right text-sm text-muted">Volume GD</div>
          <div className="text-right text-sm text-muted">NN MR (tỷ)</div>
          <div className="text-right text-sm text-muted">Vốn hóa (tỷ)</div>
          <div className="text-right text-sm text-muted">%1 ngày</div>
          <div className="text-right text-sm text-muted">Phân bổ dòng tiền</div>
        </div>
        <Accordion
          showDivider={false}
          variant="light"
          className="px-0"
          itemClasses={{
            base: "px-0",
            titleWrapper: "py-0",
            trigger: "py-0 border-none outline-none group",
            content: "p-0",
            indicator: "hidden",
          }}
        >
          {formatedData.map((item: any) => (
            <AccordionItem
              key={item.name}
              title={
                <div
                  className="grid gap-5 py-2 text-sm font-medium text-white hover:bg-background/40"
                  style={{ gridTemplateColumns: "1.5fr repeat(5,1fr) 1.5fr" }}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {item.children ? (
                      <div className="-rotate-90 text-[#67E1C0] transition-all group-data-[open=true]:rotate-0">
                        <ChevronDown />
                      </div>
                    ) : (
                      <div className="pl-3"></div>
                    )}
                    <div>{item.name}</div>
                  </div>
                  <div className="text-right">
                    {(item.dayValue / 1_000_000_000).toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </div>
                  <div className="text-right">
                    {item.dayVolume
                      ? item.dayVolume.toLocaleString("en-US")
                      : "-"}
                  </div>
                  <div
                    className={cn(
                      "text-right",
                      item.dayNetForeignVal > 0 ? "text-green" : "text-red",
                    )}
                  >
                    {(item.dayNetForeignVal / 1_000_000_000).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 1, maximumFractionDigits: 1 },
                    )}
                  </div>
                  <div className="text-right">
                    {(item.dayMarketCap / 1_000_000_000).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 1, maximumFractionDigits: 1 },
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-right",
                      item.dayMarketCapChangePercent > 0
                        ? "text-green"
                        : "text-red",
                    )}
                  >
                    {item.dayMarketCapChangePercent.toFixed(2)}%
                  </div>

                  <div className="flex items-center">
                    <CashFlow />
                  </div>
                </div>
              }
            >
              {item.children?.map((child: any, index: number) => (
                <div
                  key={index}
                  className="grid gap-5 py-2 text-sm font-medium text-white"
                  style={{ gridTemplateColumns: "1.5fr repeat(5,1fr) 1.5fr" }}
                >
                  <div className="pl-5 font-semibold text-muted">
                    <div>{child.name}</div>
                  </div>
                  <div className="text-right">
                    {(child.dayValue / 1_000_000_000).toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </div>
                  <div className="text-right">
                    {child.dayVolume
                      ? child.dayVolume.toLocaleString("en-US")
                      : "-"}
                  </div>
                  <div
                    className={cn(
                      "text-right",
                      child.dayNetForeignVal > 0 ? "text-green" : "text-red",
                    )}
                  >
                    {(child.dayNetForeignVal / 1_000_000_000).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 1, maximumFractionDigits: 1 },
                    )}
                  </div>
                  <div className="text-right">
                    {(child.dayMarketCap / 1_000_000_000).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 1, maximumFractionDigits: 1 },
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-right",
                      child.dayMarketCapChangePercent > 0
                        ? "text-green"
                        : "text-red",
                    )}
                  >
                    {child.dayMarketCapChangePercent.toFixed(2)}%
                  </div>

                  <div className="flex items-center">
                    <CashFlow />
                  </div>
                </div>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
