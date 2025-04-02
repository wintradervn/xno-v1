import { Tab } from "@heroui/react";
import Tabs from "../ui/Tabs";
import Button from "../ui/Button";
import { ScrollArea } from "../ui/scroll-area";
import GiaoDich from "./GiaoDich";
import UnfinishedFeature from "../ui/UnfinishedFeature";

function BotItem() {
  return (
    <div className="border-border rounded-[8px] border-[1.3px] p-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs">Cổ phiếu</div>
        <Button
          size="sm"
          className="bg-linearpurple h-[24px] w-[68px] rounded-[8px] text-xs font-semibold text-black!"
        >
          Sao chép
        </Button>
      </div>
      <div className="flex items-center justify-between py-1">
        <div className="flex flex-col">
          <div className="text-muted text-xs">PNL (%)</div>
          <div className="text-green text-lg font-semibold">7,32%</div>
        </div>
        <div>
          <svg
            width="60"
            height="21"
            viewBox="0 0 60 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M60 0.0253906C50.2519 0.56695 49.6482 13.5322 40 15.0254C32.0438 16.2567 28.0151 9.26721 20 10.0254C11.3064 10.8478 8.52444 18.1311 0 20.0254H60V0.0253906Z"
              fill="url(#paint0_linear_30091_30894)"
            />
            <path
              d="M0 20.0254C8.52444 18.1311 11.3064 10.8478 20 10.0254C28.0151 9.26721 32.0439 16.2567 40 15.0254C49.6482 13.5322 50.2519 0.56695 60 0.0253906"
              stroke="#1DF81F"
              strokeWidth="0.731707"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_30091_30894"
                x1="30"
                y1="0.0253906"
                x2="30"
                y2="20.0254"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.5" stopColor="#31BD65" stopOpacity="0.1" />
                <stop offset="1" stopColor="#EBF8F4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="text-muted text-xs">Thời gian hoạt động</div>
      <div className="mb-1 font-semibold">5 ngày 11 giờ 7 phút</div>
      <div className="text-muted text-xs">Tổng số người giao dịch bot</div>
      <div className="font-semibold">43</div>
    </div>
  );
}

function BotGiaoDich() {
  return (
    <div className="flex h-full flex-col">
      <div className="text-muted text-xs">Bot cổ phiếu</div>
      <ScrollArea className="">
        <div className="grid grid-cols-2 gap-2 py-2">
          <BotItem />
          <BotItem />
          <BotItem />
          <BotItem />
          <BotItem />
          <BotItem />
          <BotItem />
          <BotItem />
          <BotItem />
          <BotItem />
        </div>
      </ScrollArea>
    </div>
  );
}

export default function Trade() {
  return (
    <div className="flex h-full w-full min-w-[300px] flex-col">
      <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          tab: "px-2 py-0 text-sm text-cyan-400 ",
          panel: "h-full py-2 flex-1 min-h-0 overflow-hidden px-0 ",
          cursor: "w-full",
        }}
        defaultSelectedKey={"thitruong"}
      >
        <Tab key="giaodich" title="Giao dịch">
          <GiaoDich />
        </Tab>
        <Tab key="botgiaodich" title="Bot giao dịch">
          <UnfinishedFeature>
            <BotGiaoDich />
          </UnfinishedFeature>
        </Tab>
      </Tabs>
    </div>
  );
}
