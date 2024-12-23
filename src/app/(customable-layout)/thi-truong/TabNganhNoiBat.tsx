import useNganhNoiBatData from "@/hooks/useNganhNoiBatData";
import ChevronDown from "@/icons/ChevronDown";
import { cn, formatNumber, formatVeryLargeNumber } from "@/lib/utils";
import { Accordion, AccordionItem, Tooltip } from "@nextui-org/react";
import React, { useMemo } from "react";

const CashFlow = React.memo(function CashFlow({
  tang = 0,
  giam = 0,
  khongdoi = 0,
}: {
  tang?: number;
  giam?: number;
  khongdoi?: number;
}) {
  const total = tang + giam + khongdoi || 1;
  const percentTang = (tang / total) * 100;
  const percentGiam = (giam / total) * 100;
  const percentKhongDoi = (khongdoi / total) * 100;

  return (
    <Tooltip
      content={
        <div className="flex flex-col text-sm text-muted">
          <div>
            Tăng giá: <span className="font-semibold text-green">{tang}</span>
          </div>
          <div>
            Giảm giá: <span className="font-semibold text-red">{giam}</span>
          </div>
          <div>
            Không đổi:{" "}
            <span className="font-semibold text-yellow">{khongdoi}</span>
          </div>
        </div>
      }
      classNames={{
        content: "bg-background rounded-[4px]",
      }}
      showArrow
    >
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        <div
          className="h-full bg-green"
          style={{ width: percentTang.toString() + "%" }}
        ></div>
        <div
          className="h-full bg-red"
          style={{ width: percentGiam.toString() + "%" }}
        ></div>
        <div
          className="h-full bg-yellow"
          style={{ width: percentKhongDoi.toString() + "%" }}
        ></div>
      </div>
    </Tooltip>
  );
});

export default function TabNganhNoiBat() {
  const { data: hihi } = useNganhNoiBatData();
  const formatedData = useMemo(() => {
    let newData = [] as any;
    if (!hihi) return newData;

    newData.push(
      ...hihi
        ?.filter((item) => item.level === 1)
        .sort((a, b) => b.dayValue - a.dayValue)
        .map((item) => ({
          ...item,
          pe:
            item.stocks.reduce(
              (acc, item) => acc + item.pe * item.dayMarketCap,
              0,
            ) / item.dayMarketCap,
          pb:
            item.stocks.reduce(
              (acc, item) => acc + item.pb * item.dayMarketCap,
              0,
            ) / item.dayMarketCap,
          tang: item.stocks.reduce(
            (acc, item2) =>
              item2.dayMarketCapChangePercent > 0 ? acc + 1 : acc,
            0,
          ),
          giam: item.stocks.reduce(
            (acc, item2) =>
              item2.dayMarketCapChangePercent < 0 ? acc + 1 : acc,
            0,
          ),
          khongdoi: item.stocks.reduce(
            (acc, item2) =>
              +item2.dayMarketCapChangePercent?.toFixed(2) === 0 ? 1 : acc,
            0,
          ),
          stocks: undefined,
        })),
    );

    hihi
      .filter((item) => item.level === 2)
      .map((item) => ({
        ...item,
        pe:
          item.stocks.reduce(
            (acc, item) => acc + item.pe * item.dayMarketCap,
            0,
          ) / item.dayMarketCap,
        pb:
          item.stocks.reduce(
            (acc, item) => acc + item.pb * item.dayMarketCap,
            0,
          ) / item.dayMarketCap,
        tang: item.stocks.reduce(
          (acc, item2) => (item2.dayMarketCapChangePercent > 0 ? acc + 1 : acc),
          0,
        ),
        giam: item.stocks.reduce(
          (acc, item2) => (item2.dayMarketCapChangePercent < 0 ? acc + 1 : acc),
          0,
        ),
        khongdoi: item.stocks.reduce(
          (acc, item2) =>
            +item2.dayMarketCapChangePercent?.toFixed(2) === 0 ? acc + 1 : acc,
          0,
        ),
      }))
      .forEach((item) => {
        const parentIndex = newData.findIndex(
          (parent: any) => parent.code === item.parentCode,
        );
        if (parentIndex < 0) return;
        if (!newData[parentIndex].children) newData[parentIndex].children = [];
        newData[parentIndex].children.push(item);
      });
    newData = newData.map((item: any) => ({
      ...item,
      children: item.children?.sort((a: any, b: any) =>
        a.name.localeCompare(b.name),
      ),
      pe:
        item.pe ||
        item.children?.reduce(
          (acc: any, item2: any) => acc + item2.pe * item2.dayMarketCap,
          0,
        ) / item.dayMarketCap,
      pb:
        item.pe ||
        item.children?.reduce(
          (acc: any, item2: any) => acc + item2.pb * item2.dayMarketCap,
          0,
        ) / item.dayMarketCap,
      tang:
        item.tang ||
        item.children?.reduce((acc: number, item2: any) => acc + item2.tang, 0),
      giam:
        item.giam ||
        item.children?.reduce((acc: number, item2: any) => acc + item2.giam, 0),
      khongdoi:
        item.khongdoi ||
        item.children?.reduce(
          (acc: number, item2: any) => acc + item2.khongdoi,
          0,
        ),
    }));
    return newData;
  }, [hihi]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lineargreen font-semibold">Ngành nổi bật</div>
      <div className="flex flex-col gap-2">
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "1.5fr repeat(6,1fr) 1.5fr" }}
        >
          <div className="text-sm text-muted">Nhóm</div>
          <div className="text-right text-sm text-muted">%1 ngày</div>
          {/* <div className="text-right text-sm text-muted">%1 tuần</div> */}
          <div className="text-right text-sm text-muted">Giá trị GD (tỷ)</div>
          <div className="text-right text-sm text-muted">NN MR (tỷ)</div>
          <div className="text-right text-sm text-muted">Vốn hóa (tỷ)</div>
          <div className="text-right text-sm text-muted">P/E</div>
          <div className="text-right text-sm text-muted">P/B</div>
          <div className="text-right text-sm text-muted">Phân bổ dòng tiền</div>
        </div>
        {formatedData ? (
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
            selectionMode="multiple"
            defaultExpandedKeys={["1", "2", "3"]}
          >
            {formatedData.map((item: any, index: number) => (
              <AccordionItem
                key={(index + 1).toString()}
                title={
                  <div
                    className="grid gap-5 py-2 text-sm font-medium text-white hover:bg-background/40"
                    style={{ gridTemplateColumns: "1.5fr repeat(6,1fr) 1.5fr" }}
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
                    {/* <div className="text-right">12.3%</div> */}
                    <div className="text-right">
                      {formatNumber(item.dayValue / 1_000_000_000, 1)}
                    </div>
                    <div
                      className={cn(
                        "text-right",
                        item.dayNetForeignVal > 0 ? "text-green" : "text-red",
                      )}
                    >
                      {formatNumber(item.dayNetForeignVal / 1_000_000_000, 1)}
                    </div>
                    <div className="text-right">
                      {formatNumber(item.dayMarketCap / 1_000_000_000, 1)}
                    </div>
                    <div className="text-right">{formatNumber(item.pe, 2)}</div>
                    <div className="text-right">{formatNumber(item.pb, 2)}</div>

                    <div className="flex items-center">
                      <CashFlow
                        tang={item.tang}
                        giam={item.giam}
                        khongdoi={item.khongdoi}
                      />
                    </div>
                  </div>
                }
              >
                {item.children?.map((child: any, index: number) => (
                  <div
                    key={index}
                    className="grid gap-5 py-2 text-sm font-medium text-white"
                    style={{ gridTemplateColumns: "1.5fr repeat(6,1fr) 1.5fr" }}
                  >
                    <div className="text-nowrap pl-5 font-semibold text-muted">
                      <div>{child.name}</div>
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
                    {/* <div className="text-right">12.3%</div> */}
                    <div className="text-right">
                      {formatNumber(child.dayValue / 1_000_000_000, 1)}
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
                    <div className="text-right">
                      {formatNumber(child.pe, 2)}
                    </div>
                    <div className="text-right">
                      {formatNumber(child.pb, 2)}
                    </div>
                    <div className="flex items-center">
                      <CashFlow
                        tang={child.tang}
                        giam={child.giam}
                        khongdoi={child.khongdoi}
                      />
                    </div>
                  </div>
                ))}
              </AccordionItem>
            ))}
          </Accordion>
        ) : null}
      </div>
    </div>
  );
}
