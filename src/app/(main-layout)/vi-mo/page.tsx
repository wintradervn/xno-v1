"use client";
import ViMoComplexChart from "@/components/charts/ViMoComplexChart";
import { Select, SelectItem } from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, Tab } from "@heroui/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { PieChart2, Shop } from "solar-icon-set";

const dateOptions = [
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
];

const tieuChiList = [
  {
    id: "1",
    name: "Kinh tế vĩ mô",
    icon: <PieChart2 iconStyle="Bold" size={24} />,
    children: [
      {
        id: "1",
        name: "Tăng trưởng GDP vs VNINDEX",
        children: [
          { id: "1", name: "GDP theo giá so sánh" },
          { id: "2", name: "GDP theo giá hiện hành" },
        ],
      },
      {
        id: "2",
        name: "Tăng trưởng CPI vs VNINDEX",
        children: [
          { id: "3", name: "GDP theo giá so sánh" },
          { id: "4", name: "GDP theo giá hiện hành" },
        ],
      },
      {
        id: "3",
        name: "Chỉ số IIP - Sản xuất công nghiệp",
        children: [
          { id: "5", name: "GDP theo giá so sánh" },
          { id: "6", name: "GDP theo giá hiện hành" },
        ],
      },
      {
        id: "4",
        name: "Chỉ số PMI - Quản lý thu mua",
        children: [
          { id: "7", name: "GDP theo giá so sánh" },
          { id: "8", name: "GDP theo giá hiện hành" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Hàng hóa",
    icon: <Shop iconStyle="Bold" size={24} />,
    children: [
      {
        id: "1",
        name: "Tăng trưởng GDP vs VNINDEX",
        children: [
          { id: "9", name: "GDP theo giá so sánh" },
          { id: "10", name: "GDP theo giá hiện hành" },
        ],
      },
      {
        id: "2",
        name: "Tăng trưởng CPI vs VNINDEX",
        children: [
          { id: "11", name: "GDP theo giá so sánh" },
          { id: "12", name: "GDP theo giá hiện hành" },
        ],
      },
      {
        id: "3",
        name: "Chỉ số IIP - Sản xuất công nghiệp",
        children: [
          { id: "13", name: "GDP theo giá so sánh" },
          { id: "14", name: "GDP theo giá hiện hành" },
        ],
      },
      {
        id: "4",
        name: "Chỉ số PMI - Quản lý thu mua",
        children: [
          { id: "15", name: "GDP theo giá so sánh" },
          { id: "16", name: "GDP theo giá hiện hành" },
        ],
      },
    ],
  },
];

export default function ViMo() {
  return <VimoUndone />;
}

function VimoUndone() {
  const [selectedChart, setSelectedChart] = useState(["1", "2"]);
  const count = selectedChart.length;
  return (
    <div className="flex h-full w-full flex-1 gap-1">
      <div className="flex h-full flex-1 flex-col">
        <div className="card text-md flex w-fit items-center gap-1 rounded-b-none px-4 font-medium text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8c0-2.828 0-4.243.879-5.121C4.757 2 6.172 2 9 2h6c2.828 0 4.243 0 5.121.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22H9c-2.828 0-4.243 0-5.121-.879C3 20.243 3 18.828 3 16z" />
              <path
                strokeLinecap="round"
                d="M8 2.5V22M2 12h2m-2 4h2M2 8h2m7.5-1.5h5m-5 3.5h5"
              />
            </g>
          </svg>
          Kết quả so sánh
        </div>
        <div className="card flex flex-1 flex-col gap-5 rounded-tl-none p-3">
          <div className="flex shrink-0 items-center gap-4">
            <Tabs color="primary">
              <Tab title="Hàng tháng"></Tab>
              <Tab title="Hàng năm"></Tab>
            </Tabs>
            <div className="text-muted flex items-center gap-3 text-sm">
              Từ{" "}
              <Select
                variant="bordered"
                placeholder="--"
                size="sm"
                className="w-[92px]"
              >
                {dateOptions?.map((item) => (
                  <SelectItem key={item} classNames={{}}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
              đến
              <Select
                variant="bordered"
                placeholder="--"
                size="sm"
                className="w-[92px]"
              >
                {dateOptions?.map((item) => (
                  <SelectItem key={item} classNames={{}}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
            </div>{" "}
          </div>
          <div className="flex flex-1">
            <ViMoComplexChart count={count} />
          </div>
        </div>
      </div>
      <div className="flex h-full w-[340px] flex-col">
        <div className="card text-md flex w-fit items-center gap-1 rounded-b-none px-4 font-medium text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8c0-2.828 0-4.243.879-5.121C4.757 2 6.172 2 9 2h6c2.828 0 4.243 0 5.121.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22H9c-2.828 0-4.243 0-5.121-.879C3 20.243 3 18.828 3 16z" />
              <path
                strokeLinecap="round"
                d="M8 2.5V22M2 12h2m-2 4h2M2 8h2m7.5-1.5h5m-5 3.5h5"
              />
            </g>
          </svg>
          Tiêu chí so sánh
        </div>
        <div className="card flex flex-1 gap-5 rounded-tl-none p-3">
          <Accordion
            showDivider={false}
            selectionMode="multiple"
            defaultExpandedKeys={["1", "2"]}
          >
            {tieuChiList.map((tieuChi) => (
              <AccordionItem
                key={tieuChi.id}
                title={
                  <div className="text-medium flex gap-2 font-medium uppercase">
                    {tieuChi.icon}
                    <div>{tieuChi.name}</div>
                  </div>
                }
                classNames={{
                  trigger:
                    "bg-content1 p-3 rounded-[8px] border-l-2 border-[#67E1C0]",
                  indicator: "text-[24px]",
                }}
              >
                <div className="flex gap-2">
                  <Accordion showDivider={false} selectionMode="multiple">
                    {tieuChi.children?.map((child) => (
                      <AccordionItem
                        key={child.id}
                        startContent={
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle cx="12" cy="12" r="4" fill="currentColor" />
                          </svg>
                        }
                        title={
                          <div className="text-md font-bold">{child.name}</div>
                        }
                        classNames={{
                          trigger: "pr-1 py-2 border-none! outline-hidden",
                          content: "p-0 border-none",
                          indicator: "text-[24px]",
                        }}
                      >
                        {child.children?.map((subChild) => (
                          <div
                            key={subChild.id}
                            className={cn(
                              "hover:bg-content1 flex cursor-pointer items-center justify-between gap-2 p-2 pl-10 select-none",
                              selectedChart.includes(subChild.id)
                                ? "text-lineargreen"
                                : "",
                            )}
                            onClick={() => {
                              setSelectedChart((prev) =>
                                prev.includes(subChild.id)
                                  ? prev.filter((item) => item !== subChild.id)
                                  : [...prev, subChild.id],
                              );
                            }}
                          >
                            <div className="text-sm">{subChild.name}</div>
                            {/* <div className="group text-green">
                              <div className="group-hover:display-none">
                                <Check size={16} />
                              </div>
                            </div> */}
                          </div>
                        ))}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
